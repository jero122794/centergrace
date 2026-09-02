# Users module

## Purpose

Directory of church members with strict RBAC. The DEVELOPER account cannot be created, deactivated, deleted or reassigned through these endpoints.

## Endpoints

- `GET /api/users` — Admin/Leader/Developer list with filters
- `PATCH /api/users/:id` — Admin/Developer update profile
- `PATCH /api/users/:id/role` — Admin/Developer, never DEVELOPER
- `PATCH /api/users/:id/toggle-active` — Admin/Developer, never DEVELOPER
- `POST /api/users/create-student` — Leader creates STUDENT + SES welcome
