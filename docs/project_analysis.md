# LMS Project Analysis Report

## Executive Summary
This project is a **Learning Management System (LMS)** built on the **MERN Stack** (MongoDB, Express.js, React, Node.js). It features a modern, responsive frontend using **Vite** and **Tailwind CSS**, and a robust backend API handling authentication, course management, and student progress tracking.

## Technology Stack

### Frontend (Client)
-   **Framework:** React 19 (via Vite)
-   **Styling:** Tailwind CSS 4 & Framer Motion (for animations)
-   **Routing:** React Router DOM 7
-   **State/Network:** Axios (requests), Context API (Auth, Socket)
-   **Real-time:** Socket.io Client
-   **Icons:** Lucide React

### Backend (Server)
-   **Runtime:** Node.js
-   **Framework:** Express 5
-   **Database:** MongoDB (via Mongoose 9)
-   **Authentication:** JSON Web Tokens (JWT) & bcryptjs
-   **Real-time:** Socket.io
-   **Security:** CORS, Cookie Parser

## Application Architecture

### 1. Authentication & Authorization
The application uses a secure, role-based authentication system:
-   **Roles:**
    -   `student`: Can view courses and track progress.
    -   `instructor`: Can create and manage courses.
    -   `admin`: Full system access.
-   **Mechanism:**
    -   Users log in via `/api/auth/login`.
    -   A **JWT** is returned and stored in `localStorage`.
    -   The `AuthContext` automatically attaches this token to the `Authorization` header for all Axios requests.
    -   **Private Routes** in `App.jsx` ensure users can only access pages authorized for their role.

### 2. Frontend Structure (`client/`)
-   **Entry Point:** `main.jsx` mounts `App.jsx`.
-   **Routing (`App.jsx`):**
    -   Uses `DashboardLayout` for authenticated views.
    -   Implements Lazy Loading for performance.
    -   Redirects users to their specific dashboard (`/student`, `/instructor`, `/admin`) upon login.
-   **Features:**
    -   **Course Player:** (`CourseDetail.jsx`) Includes a video player (YouTube embed handling) and a sidebar for lesson navigation.
    -   **Progress Tracking:** Students can mark lessons as complete; visual progress bars update dynamically.

### 3. Backend Structure (`server/`)
-   **API Design:** RESTful API with routes prefixed by `/api`.
-   **Key Routes:**
    -   `/auth`: Login/Register.
    -   `/courses`: CRUD for courses.
    -   `/lessons`: Management of course content.
    -   `/progress`: Tracks which lessons a student has completed.
-   **Database Models:**
    -   `User`: Stores credentials and role.
    -   `Course` & `Lesson`: Content hierarchy.
    -   `Progress`: Relational data linking Users to completed Lessons.

## Data Flow Example: Viewing a Course
1.  **User Action:** Student clicks a course.
2.  **Client:** `CourseDetail.jsx` mounts.
3.  **API Call:** Fires `axios.get('/api/courses/:id')` and `axios.get('/api/progress/:id')`.
4.  **Server:**
    -   `verify-token` middleware confirms identity.
    -   Controller fetches course data and user's progress from MongoDB.
5.  **Response:** JSON data returns to client.
6.  **UI Update:** React renders the video player and highlights completed lessons in the sidebar.

## Current State Observations
-   **Modern & Bleeding Edge:** The project uses very new versions of libraries (React 19, Tailwind 4, Express 5), indicating a forward-looking codebase.
-   **Clean Separation:** Good separation of concerns between Controllers, Routes, and Models.
-   **Production Ready Features:** Includes error handling, loading states (`Loader2`), and real-time capability foundations.
