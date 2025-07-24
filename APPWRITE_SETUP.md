# Appwrite Database Configuration

This document provides the complete database schema and collection configuration for the Quiz Master application.

## Database Setup

1. **Database Name**: `quiz_database`
2. **Database ID**: `quiz_database` (use this in your .env file)

## Authentication Setup

### Enable Email/Password Authentication
1. Go to **Auth** in your Appwrite console
2. Click on **Settings**
3. Enable **Email/Password** authentication method
4. Set **Password Policy** (minimum 8 characters recommended)
5. Enable **Email confirmation** if desired
6. Configure **Password recovery** if needed

### Create Admin User
1. Go to **Auth** → **Users**
2. Click **Create User**
3. Enter admin details:
   - **Email**: admin@yourcompany.com
   - **Password**: Create a strong password
   - **Name**: Admin
4. Click **Create**

### Configure Auth Permissions
1. In **Settings** → **Permissions**
2. Set **Users** role permissions:
   - Read: Allow authenticated users
   - Create: Allow for registration (optional)
   - Update: Allow users to update their own data
   - Delete: Restrict to admin only

## Collections Configuration

### 1. Quizzes Collection

**Collection ID**: `quizzes`

| Attribute | Type | Size | Required | Default | Array | Description |
|-----------|------|------|----------|---------|-------|-------------|
| `title` | String | 255 | Yes | - | No | Quiz title |
| `description` | String | 1000 | Yes | - | No | Quiz description |
| `difficulty` | String | 50 | No | "Easy" | No | Quiz difficulty level |
| `timeLimit` | Integer | - | No | 10 | No | Time limit in minutes |
| `questionCount` | Integer | - | No | 0 | No | Number of questions |
| `createdAt` | String | 50 | Yes | - | No | Creation timestamp |
| `imageUrl` | String | 500 | No | - | No | Quiz cover image URL |
| `createdBy` | String | 50 | No | - | No | User ID who created the quiz |

**Indexes**:
- `title_index` on `title` (ASC)
- `difficulty_index` on `difficulty` (ASC)
- `created_index` on `createdAt` (DESC)
- `created_by_index` on `createdBy` (ASC)

**Permissions**:
- Read: `users`, `guests`
- Create: `users` (authenticated users only)
- Update: `users` (quiz creators and admins)
- Delete: `users` (quiz creators and admins)

### 2. Questions Collection

**Collection ID**: `questions`

| Attribute | Type | Size | Required | Default | Array | Description |
|-----------|------|------|----------|---------|-------|-------------|
| `quiz_id` | String | 50 | Yes | - | No | Reference to quiz |
| `question` | String | 1000 | Yes | - | No | Question text |
| `options` | String | 2000 | Yes | - | Yes | Answer options (JSON array) |
| `correctAnswer` | Integer | - | Yes | - | No | Index of correct answer |
| `explanation` | String | 1000 | No | - | No | Answer explanation |
| `order` | Integer | - | No | 0 | No | Question order |

**Indexes**:
- `quiz_id_index` on `quiz_id` (ASC)
- `order_index` on `order` (ASC)

**Permissions**:
- Read: `users`, `guests`
- Create: `users` (authenticated users only)
- Update: `users` (quiz creators and admins)
- Delete: `users` (quiz creators and admins)

### 3. Results Collection

**Collection ID**: `results`

| Attribute | Type | Size | Required | Default | Array | Description |
|-----------|------|------|----------|---------|-------|-------------|
| `quiz_id` | String | 50 | Yes | - | No | Reference to quiz |
| `user_name` | String | 100 | Yes | - | No | User's name |
| `user_email` | String | 255 | Yes | - | No | User's email |
| `score` | Integer | - | Yes | - | No | Number of correct answers |
| `total_questions` | Integer | - | Yes | - | No | Total number of questions |
| `percentage` | Integer | - | Yes | - | No | Score percentage |
| `answers` | String | 5000 | Yes | - | No | User's answers (JSON string) |
| `time_taken` | Integer | - | No | 0 | No | Time taken in seconds |
| `timestamp` | String | 50 | Yes | - | No | Completion timestamp |

**Indexes**:
- `quiz_id_index` on `quiz_id` (ASC)
- `percentage_index` on `percentage` (DESC)
- `time_taken_index` on `time_taken` (ASC)
- `timestamp_index` on `timestamp` (DESC)

**Permissions**:
- Read: `users`, `guests`
- Create: `users`, `guests` (allow anonymous quiz taking)
- Update: `users`
- Delete: `users`

## Storage Configuration

### Storage Bucket

**Bucket ID**: `quiz_images`

**Configuration**:
- Name: Quiz Images
- File Security: Enabled
- Maximum File Size: 5MB
- Allowed File Extensions: `jpg`, `jpeg`, `png`, `gif`, `webp`
- Encryption: Enabled
- Antivirus: Enabled

**Permissions**:
- Read: `users`, `guests`
- Create: `users` (authenticated users only)
- Update: `users`
- Delete: `users`

## Step-by-Step Setup Guide

### 1. Create Database
```bash
Database Name: quiz_database
Database ID: quiz_database
```

### 2. Setup Authentication
1. Enable Email/Password auth in **Auth** → **Settings**
2. Create your admin user in **Auth** → **Users**
3. Configure session settings and security policies

### 3. Create Collections

#### A. Quizzes Collection
1. Go to Databases → quiz_database
2. Click "Create Collection"
3. Collection ID: `quizzes`
4. Add attributes as specified above
5. Set permissions (allow guests to read, users to create/update/delete)
6. Create indexes

#### B. Questions Collection
1. Create Collection with ID: `questions`
2. Add attributes as specified above
3. Set permissions (allow guests to read, users to create/update/delete)
4. Create indexes

#### C. Results Collection
1. Create Collection with ID: `results`
2. Add attributes as specified above
3. Set permissions (allow guests to read and create, users to update/delete)
4. Create indexes

### 4. Create Storage Bucket
1. Go to Storage
2. Click "Create Bucket"
3. Bucket ID: `quiz_images`
4. Configure settings as specified above
5. Set permissions (allow guests to read, users to create/update/delete)

## Environment Variables

Update your `.env` file with these values:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=quiz_database
```

## Authentication Flow

### Admin Login
1. Admin visits `/admin` route
2. If not authenticated, login form is displayed
3. Enter admin email and password
4. On successful login, admin panel is accessible
5. User info is displayed in header with logout option

### Security Features
- **Session Management**: Automatic session handling
- **Route Protection**: Admin routes require authentication
- **Secure Logout**: Proper session cleanup
- **Error Handling**: Graceful error messages for failed logins

## Collection Relationships

```
User (1) → Quizzes (Many) [createdBy relationship]
Quiz (1) → Questions (Many)
Quiz (1) → Results (Many)
```

## Sample Data Structure

### Sample Admin User
```json
{
  "$id": "admin_user_id",
  "email": "admin@company.com",
  "name": "Admin",
  "emailVerification": true,
  "status": true
}
```

### Sample Quiz Document (with Auth)
```json
{
  "$id": "quiz_unique_id",
  "title": "JavaScript Fundamentals",
  "description": "Test your knowledge of JavaScript basics",
  "difficulty": "Medium",
  "timeLimit": 15,
  "questionCount": 10,
  "createdAt": "2025-07-24T10:30:00.000Z",
  "createdBy": "admin_user_id",
  "imageUrl": "https://example.com/quiz-image.jpg"
}
```

### Sample Question Document
```json
{
  "$id": "question_unique_id",
  "quiz_id": "quiz_unique_id",
  "question": "What is the correct way to declare a variable in JavaScript?",
  "options": ["var x = 5", "variable x = 5", "v x = 5", "declare x = 5"],
  "correctAnswer": 0,
  "explanation": "The 'var' keyword is used to declare variables in JavaScript",
  "order": 1
}
```

### Sample Result Document
```json
{
  "$id": "result_unique_id",
  "quiz_id": "quiz_unique_id",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "score": 8,
  "total_questions": 10,
  "percentage": 80,
  "answers": "[0, 1, 2, 0, 3, 1, 2, 0, 1, 2]",
  "time_taken": 450,
  "timestamp": "2025-07-18T10:45:00.000Z"
}
```

## Important Security Notes

1. **Admin Access**: Only authenticated users can create/edit quizzes
2. **Guest Access**: Anonymous users can still take quizzes and view leaderboards
3. **Data Protection**: User sessions are securely managed by Appwrite
4. **Permission Model**: Granular permissions ensure proper access control
5. **Password Security**: Enforce strong password policies in Appwrite settings

## Troubleshooting Authentication

### Common Issues
1. **Login Failed**: Check email/password combination and user status
2. **Session Expired**: User needs to login again
3. **Permission Denied**: Verify collection permissions are set correctly
4. **CORS Issues**: Ensure domain is added to Appwrite platform settings

### Testing Authentication
1. Create a test admin user in Appwrite console
2. Try logging in through the application
3. Verify admin panel access after login
4. Test logout functionality
5. Confirm session persistence across browser refreshes

Make sure to configure these collections and authentication settings exactly as specified for the application to work properly with admin login functionality.