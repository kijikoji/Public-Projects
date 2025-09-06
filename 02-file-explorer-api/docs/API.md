# File Explorer API Documentation

## Overview
A RESTful API for file management with user authentication and secure file operations.

## Base URL
```
http://localhost:3000/api
```

## Authentication
All file operations require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

### File Operations

#### List Files
```http
GET /api/files?path=optional/path
Authorization: Bearer <token>
```

#### Upload File
```http
POST /api/files
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <file>
path: optional/subfolder (optional)
```

#### Download File
```http
GET /api/files/:filename?path=optional/path
Authorization: Bearer <token>
```

#### Delete File/Folder
```http
DELETE /api/files?path=file/or/folder/path
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Additional error details"]
}
```

## Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `500` - Internal Server Error
