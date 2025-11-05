# Database Migration Instructions

## Setup Steps

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Create and Run Migration**
   ```bash
   npx prisma migrate dev --name add_projects_and_applications
   ```

3. **Push to Database (Alternative)**
   If migrations fail, you can push the schema directly:
   ```bash
   npx prisma db push
   ```

## New Features

### For Professors:
- Create research projects with title, description, duration, difficulty, department, and category
- View all student applicants in one place
- Accept or reject student applications
- View their own projects

### For Students:
- Browse all available research projects
- Apply to projects with one click
- View projects they've applied to
- View projects they're working on (accepted applications)
- See application status (pending/accepted/rejected)

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects (with optional filters)
  - Query params: `type`, `professorId`, `studentId`, `view`
- `POST /api/projects` - Create new project (professors only)

### Applications
- `POST /api/applications` - Apply to a project (students only)
- `GET /api/applications?username=X` - Get all applicants for professor's projects
- `PATCH /api/applications` - Accept/reject application (professors only)

### Users
- `GET /api/user?username=X` - Get user data
- `POST /api/signin` - Sign in with credentials
- `POST /api/signup` - Create new account

## Database Schema

### User
- id, username, password, usertype, university, batch
- Relations: projects (as professor), applications (as student)

### Project
- id, title, description, duration, difficulty, department, type
- professorId (foreign key to User)
- Relations: professor, applications

### Application
- id, studentId, projectId, status, appliedAt
- Relations: student, project
- Unique constraint on (studentId, projectId)

## Testing the Features

1. **Sign up as Professor**
   - Go to `/signup`
   - Check "SIGNUP AS PROFESSOR"
   - Create account

2. **Create a Project**
   - Click "CREATE PROJECT" button in dashboard
   - Fill in project details
   - Submit

3. **Sign up as Student** (in incognito/different browser)
   - Go to `/signup`
   - Leave professor checkbox unchecked
   - Create account

4. **Apply to Project**
   - View projects in "All Projects" tab
   - Click "Apply_Now" button

5. **Accept/Reject as Professor**
   - Switch back to professor account
   - View "Applicants" tab
   - Click Accept or Reject buttons
