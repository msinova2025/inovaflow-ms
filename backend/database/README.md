# Database Schema Documentation

## Overview
This document describes the database schema for MS INOVA MAIS platform.

## Database: PostgreSQL 16

### Tables

#### 1. users
Stores user information for both challengers and solvers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| full_name | VARCHAR(255) | NOT NULL | Full name |
| role | VARCHAR(50) | NOT NULL | Role: 'challenger', 'solver', 'admin' |
| organization | VARCHAR(255) | | Organization name |
| phone | VARCHAR(20) | | Contact phone |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- Primary key on `id`
- Unique index on `email`

---

#### 2. challenges
Stores innovation challenges posted by challengers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Challenge title |
| description | TEXT | NOT NULL | Detailed description |
| category | VARCHAR(100) | NOT NULL | Challenge category |
| status | VARCHAR(50) | NOT NULL | Status: 'open', 'in_progress', 'closed' |
| created_by | UUID | FOREIGN KEY → users(id) | Creator user ID |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |
| deadline | TIMESTAMP | | Submission deadline |

**Indexes:**
- Primary key on `id`
- Index on `created_by`
- Index on `status`

---

#### 3. solutions
Stores solutions submitted by solvers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| challenge_id | UUID | FOREIGN KEY → challenges(id) | Related challenge |
| submitted_by | UUID | FOREIGN KEY → users(id) | Submitter user ID |
| title | VARCHAR(255) | NOT NULL | Solution title |
| description | TEXT | NOT NULL | Detailed description |
| status | VARCHAR(50) | NOT NULL | Status: 'pending', 'approved', 'rejected' |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- Primary key on `id`
- Index on `challenge_id`
- Index on `submitted_by`

---

#### 4. comments
Stores comments on challenges.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| challenge_id | UUID | FOREIGN KEY → challenges(id) | Related challenge |
| user_id | UUID | FOREIGN KEY → users(id) | Comment author |
| content | TEXT | NOT NULL | Comment content |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Indexes:**
- Primary key on `id`
- Index on `challenge_id`

---

## Relationships

```
users (1) ──< (N) challenges
users (1) ──< (N) solutions
users (1) ──< (N) comments
challenges (1) ──< (N) solutions
challenges (1) ──< (N) comments
```

## Triggers

- **update_updated_at_column**: Automatically updates `updated_at` field on UPDATE operations for `users`, `challenges`, and `solutions` tables.

## Estimated Storage

- Initial: ~10GB
- Growth: ~2GB/month (estimated)

## Security Notes

- All user passwords will be managed by Keycloak (SETDIG)
- No sensitive data stored in application database
- All connections use SSL/TLS
