# 🇮🇳 Tiranga Connect API Documentation

## Base URL

```
http://localhost:5000/api
```

## Response Format

### Success
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "ERROR_CODE"
}
```

---

## Authentication

### POST `/auth/register`
Register a new user.

**Body:**
```json
{
  "name": "Sonu",
  "username": "sonu",
  "email": "sonu@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "referralCode": "RAHUL82"
}
```

### POST `/auth/login`
Login with email and password.

**Body:**
```json
{
  "email": "demo@tirangaconnect.app",
  "password": "Demo@123"
}
```

### POST `/auth/logout`
Logout and clear cookie.

### GET `/auth/me`
Get current authenticated user. Requires auth token.

---

## Users

### GET `/users/profile`
Get current user profile. (Protected)

### PUT `/users/profile`
Update profile. (Protected)

**Body:**
```json
{
  "name": "New Name",
  "username": "newusername"
}
```

### PUT `/users/password`
Change password. (Protected)

**Body:**
```json
{
  "currentPassword": "OldPassword",
  "newPassword": "NewPassword"
}
```

### GET `/users/referral/:code`
Get public user info by referral code. (Public)

---

## Referrals

### GET `/referrals/my`
Get direct referrals. (Protected)

Query: `?page=1&limit=20`

### GET `/referrals/tree`
Get recursive referral tree. (Protected)

Query: `?depth=5`

### GET `/referrals/stats`
Get referral statistics. (Protected)

### GET `/referrals/analytics`
Get analytics data. (Protected)

Query: `?period=7d|30d|all`

### GET `/referrals/:code`
Get referral data by code. (Protected)

---

## Leaderboard

### GET `/leaderboard`
Get leaderboard. (Public)

Query: `?page=1&limit=20`

---

## Achievements

### GET `/achievements`
Get user achievements with progress. (Protected)

---

## Notifications

### GET `/notifications`
Get user notifications. (Protected)

Query: `?page=1&limit=20`

### PUT `/notifications/read-all`
Mark all notifications as read. (Protected)

### PUT `/notifications/:id/read`
Mark single notification as read. (Protected)

### DELETE `/notifications/:id`
Delete notification. (Protected)

---

## Admin (Requires admin role)

### GET `/admin/stats`
Get system statistics.

### GET `/admin/users`
Get all users with search/filter/pagination.

Query: `?page=1&search=sonu&status=active`

### PUT `/admin/users/:id/status`
Toggle user active/inactive status.

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (Duplicate) |
| 422 | Validation Error |
| 500 | Server Error |
