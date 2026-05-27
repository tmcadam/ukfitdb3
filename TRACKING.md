# Analytics Tracking

This document describes the Matomo analytics tracking implementation for the FIT-Publications DB.

## Site Search Tracking

### Overview

Search terms entered by users are automatically tracked via Matomo's built-in **Site Search** feature. When a user stops typing for 2 seconds or more, the search term is added to the URL as a query parameter (`?q=term`), which Matomo detects and logs.

### How It Works

```
User types: "falklands"
  t=0ms    Debounce timer starts (2000ms)
  t=500ms  User types more → Timer resets
  t=2500ms User stops → Timer expires
  t=2500ms URL updates to: /?q=falklands
  t=2500ms Matomo detects ?q= → Logs to Site Search report
```

### Implementation Details

- **Debounce delay:** 2000ms — only tracks after the user stops typing
- **Minimum search length:** 3 characters — short terms are not tracked
- **Query parameter:** `q`
- **Location:** [`src/useSearch.ts`](src/useSearch.ts:1)

### Matomo Admin Configuration

Configure site search in your Matomo admin:

1. Go to **Settings > Websites > Your Site > Site Search**
2. Set the **Query parameter** to: `q`

That's all — Matomo will automatically:
- Log search terms in **Site Search > Search Terms** report
- Track search exit rate and no-results rate
- Exclude search page views from regular page views (if configured)

### Test Coverage

Tests are located in [`src/useSearch.test.ts`](src/useSearch.test.ts:157):

| Test | Verifies |
|---|---|
| `should update URL with search query parameter after debounce delay` | `?q=` added only after 2000ms |
| `should reset debounce timer on each new search term` | Timer resets on subsequent input |
| `should not track search terms shorter than 3 characters` | Short terms skipped |
| `should clear debounce timer on clearSearch` | No tracking after clear |
| `should clear the URL to root on clearSearch` | URL resets to `/` on clear |

Run tests with:

```bash
npm test
```

### Clearing Search

When the user clears the search, the URL is reset to the root path (`/`), removing all query parameters:

```
User clicks clear → URL: /?q=falklands → URL: /
```

### Privacy Considerations

- Search terms are stored in the URL, which means they may appear in server logs
- Consider enabling Matomo's GDPR features if tracking EU users
- Search terms containing PII should be reviewed and potentially filtered
