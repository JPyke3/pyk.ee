# API Contract: GitHub Repository Stats

**Feature**: 004-projects-page
**Date**: 2025-12-03
**Type**: External API (Read-only)

## Endpoint

**URL**: `https://api.github.com/repos/{owner}/{repo}`

**Method**: GET

**Authentication**: None (public endpoint)

## Request

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `owner` | string | Yes | GitHub username or organization |
| `repo` | string | Yes | Repository name |

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Accept` | `application/vnd.github.v3+json` | Recommended |
| `User-Agent` | `pyk.ee-portfolio` | Required by GitHub |

### Example Request

```http
GET https://api.github.com/repos/JPyke3/mbp-manjaro HTTP/1.1
Accept: application/vnd.github.v3+json
User-Agent: pyk.ee-portfolio
```

## Response

### Success (200 OK)

**Full Response** (abbreviated - only relevant fields shown):

```json
{
  "id": 123456789,
  "name": "mbp-manjaro",
  "full_name": "JPyke3/mbp-manjaro",
  "description": "ISO build scripts for Manjaro Linux on T2 MacBooks",
  "html_url": "https://github.com/JPyke3/mbp-manjaro",
  "stargazers_count": 61,
  "watchers_count": 61,
  "forks_count": 10,
  "language": "Shell",
  "topics": ["linux", "manjaro", "macbook"],
  "created_at": "2020-01-15T10:30:00Z",
  "updated_at": "2024-11-20T15:45:00Z",
  "pushed_at": "2024-11-01T09:00:00Z"
}
```

**Fields Used by Projects Page**:

| Field | Type | Description |
|-------|------|-------------|
| `stargazers_count` | integer | Number of stars |
| `forks_count` | integer | Number of forks |
| `language` | string | Primary programming language |

### Error Responses

#### 404 Not Found

Repository does not exist or is private.

```json
{
  "message": "Not Found",
  "documentation_url": "https://docs.github.com/rest/repos/repos#get-a-repository"
}
```

**Handling**: Use fallback stats from projects.json

#### 403 Forbidden (Rate Limited)

API rate limit exceeded.

```json
{
  "message": "API rate limit exceeded for xxx.xxx.xxx.xxx",
  "documentation_url": "https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting"
}
```

**Headers**:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1701594000
```

**Handling**: Use fallback stats, retry after reset time

#### 5xx Server Error

GitHub service unavailable.

**Handling**: Use fallback stats, silent failure

## Rate Limiting

| Limit Type | Value |
|------------|-------|
| Unauthenticated | 60 requests/hour per IP |
| Reset | Hourly (check `X-RateLimit-Reset` header) |

**Strategy**:
1. Cache responses in localStorage (1-hour TTL)
2. Check cache before making API request
3. Batch requests on page load (max 9 for current project count)
4. Silent fallback on any error

## Client Implementation

### Fetch Function

```javascript
function fetchGitHubStats(owner, repo) {
  var url = 'https://api.github.com/repos/' + owner + '/' + repo;

  return fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'pyk.ee-portfolio'
    }
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('GitHub API error: ' + response.status);
    }
    return response.json();
  })
  .then(function(data) {
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language
    };
  });
}
```

### Fetch with Timeout

```javascript
function fetchWithTimeout(url, options, timeout) {
  return Promise.race([
    fetch(url, options),
    new Promise(function(_, reject) {
      setTimeout(function() {
        reject(new Error('Request timeout'));
      }, timeout);
    })
  ]);
}
```

### Batch Fetch Pattern

```javascript
function fetchAllStats(projects) {
  var promises = projects.map(function(project) {
    var cached = getCachedStats(project.github_owner, project.github_repo);
    if (cached) {
      return Promise.resolve({ id: project.id, stats: cached });
    }

    return fetchGitHubStats(project.github_owner, project.github_repo)
      .then(function(stats) {
        setCachedStats(project.github_owner, project.github_repo, stats);
        return { id: project.id, stats: stats };
      })
      .catch(function() {
        return { id: project.id, stats: null }; // Silent failure
      });
  });

  return Promise.all(promises);
}
```

## Testing

### Manual Test Cases

1. **Happy Path**: Verify stats display for public repo
2. **Cache Hit**: Second load uses cached data (check Network tab)
3. **Rate Limit**: Exhaust quota, verify fallback works
4. **Network Offline**: Verify fallback stats display
5. **Invalid Repo**: Test with non-existent repo, verify silent failure

### Test URLs

```
# Valid repos
https://api.github.com/repos/JPyke3/mbp-manjaro
https://api.github.com/repos/JPyke3/arch-mbp-archiso

# Rate limit check
https://api.github.com/rate_limit
```
