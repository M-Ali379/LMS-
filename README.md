# MERN Stack Learning Management System (LMS)

A complete LMS built with MongoDB, Express, React, and Node.js.

## Features
- **User Roles**: Admin, Instructor, Student
- **Authentication**: JWT, bcrypt, Protected Routes
- **Courses**: Create, Browse, Enroll
- **Lessons**: Video Support, Progress Tracking
- **Dashboards**: Role-specific dashboards

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### Backend Setup
1. Navigate to server:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on port 5000):
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to client:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (runs on port 5173):
   ```bash
   npm run dev
   ```

## Demo Credentials
(You can register new users, but here is how to simulate roles)
- Register a user and select the role "Student", "Instructor", or "Admin" from the registration dropdown.

## API Documentation
- `POST /api/auth/register`: Register user
- `POST /api/auth/login`: Login user
- `GET /api/courses`: Get all courses
- `POST /api/courses`: Create course (Instructor/Admin)
- `POST /api/courses/:id/enroll`: Enroll in course
- `GET /api/progress/:courseId`: Get progress

## Folder Structure
- `/client`: React Frontend
- `/server`: Node/Express Backend
  - `/models`: Mongoose Schemas
  - `/controllers`: Logic
  - `/routes`: API Routes
  - `/middleware`: Auth Protection
