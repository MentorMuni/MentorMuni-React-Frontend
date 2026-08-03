# Backend ask — TPO My Workspace (personal notes / todos)

## Goal
Persist each Org Admin’s personal workspace items on the server so they survive logout/login and work across devices. FE is already wired to these routes.

## Auth
Tenant JWT + `X-API-Key`.  
Role: `ORG_ADMIN` (TPO / Dean / Director).  
Items are **private to `user_id`** (never shared across admins in the same org).

## API

| Method | Path |
|--------|------|
| `GET` | `/organizations/workspace/items` |
| `POST` | `/organizations/workspace/items` |
| `PUT` | `/organizations/workspace/items/{id}` |
| `DELETE` | `/organizations/workspace/items/{id}` |

### Create / update body
```json
{
  "text": "Call Infosys HR about drive slots",
  "due_date": "2026-08-20",
  "kind": "todo",
  "done": false
}
```

- `text` — required (non-empty)
- `due_date` — optional `YYYY-MM-DD` or `null`
- `kind` — optional: `todo` | `note` | `reminder` (default `todo`)
- `done` — boolean (create defaults `false`; PUT can toggle)

### List response
```json
{
  "items": [
    {
      "id": 12,
      "text": "Call Infosys HR about drive slots",
      "due_date": "2026-08-20",
      "kind": "todo",
      "done": false,
      "created_at": "2026-08-03T20:00:00Z",
      "updated_at": "2026-08-03T20:00:00Z"
    }
  ]
}
```

### Rules
1. `GET/POST/PUT/DELETE` only return/mutate rows owned by the authenticated user.
2. Cross-user access → `404` (don’t leak existence).
3. Soft-delete optional; hard delete is fine for v1.
4. Soft limit ~500 open items per user is enough.

## FE status
`src/organizationPortal/workspaceApi.js` + My Workspace page already call these endpoints. Demo login still uses local storage only.
