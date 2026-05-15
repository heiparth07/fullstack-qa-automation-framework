# API Documentation

Base URL: `http://localhost:3001/api`

## Endpoints

### Health Check

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Check API and database health |

**Response 200:**
```json
{ "status": "healthy", "timestamp": "2024-01-15T10:30:00.000Z" }
```

### Tasks

| Method | Path | Description |
|--------|------|-------------|
| GET | `/tasks` | List tasks (paginated) |
| GET | `/tasks/:id` | Get single task |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

#### GET /tasks

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page (max 100) |
| status | string | - | Filter: pending, in_progress, completed |
| priority | string | - | Filter: low, medium, high |
| sortBy | string | created_at | Sort column |
| sortOrder | string | desc | Sort direction: asc, desc |

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Task title",
      "description": "Task description",
      "status": "pending",
      "priority": "medium",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### POST /tasks

**Request Body:**
```json
{
  "title": "string (required, 1-255 chars)",
  "description": "string (optional)",
  "status": "pending | in_progress | completed (default: pending)",
  "priority": "low | medium | high (default: medium)"
}
```

**Response 201:**
```json
{ "data": { "id": 1, "title": "...", ... } }
```

**Response 400 (Validation Error):**
```json
{
  "error": "Validation failed",
  "details": [
    { "field": "title", "message": "String must contain at least 1 character(s)" }
  ]
}
```

#### PUT /tasks/:id

**Request Body:** Same as POST, all fields optional.

**Response 200:** Updated task object.
**Response 404:** `{ "error": "Task with id X not found" }`

#### DELETE /tasks/:id

**Response 204:** No content (success).
**Response 404:** `{ "error": "Task with id X not found" }`

## Error Responses

All errors return JSON:
```json
{
  "error": "Error description",
  "details": []  // Optional, for validation errors
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request / Validation error |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
