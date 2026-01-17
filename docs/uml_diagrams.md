# LMS Project UML Diagrams

## 1. Use Case Diagram
**Description:** This diagram illustrates the interactions between different user roles (Actors) and the system's functionalities.
-   **Student:** Can browse courses, watch lessons, and take quizzes.
-   **Instructor:** Can manage courses and view their own analytics.
-   **Admin:** Has full control over users and system-wide visibility.

```mermaid
usecaseDiagram
    actor Student
    actor Instructor
    actor Admin

    package "LMS System" {
        usecase "Login / Register" as UC1
        usecase "View Profile" as UC2
        usecase "Browse Courses" as UC3
        usecase "Watch Lessons" as UC4
        usecase "Take Quiz" as UC5
        usecase "Create / Edit Course" as UC6
        usecase "Manage Users" as UC7
        usecase "View Analytics" as UC8
        usecase "View My Performance" as UC9
    }

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC9

    Instructor --> UC1
    Instructor --> UC2
    Instructor --> UC6
    Instructor --> UC8

    Admin --> UC1
    Admin --> UC7
    Admin --> UC8
```

## 2. Class Diagram (Domain Model)
**Description:** Represents the static structure of the database models and their relationships.
-   **User:** Base entity for all roles.
-   **Course:** Contains metadata and is linked to an Instructor.
-   **Lesson:** Belongs to a Course and can contain Quiz questions.
-   **QuizResult:** Tracks a Student's performance on a specific Lesson (Quiz).

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String name
        +String email
        +String password
        +String role
        +Date createdAt
    }

    class Course {
        +ObjectId _id
        +String title
        +String category
        +String description
        +String image
        +ObjectId instructor
        +getLessons()
    }

    class Lesson {
        +ObjectId _id
        +ObjectId courseId
        +String title
        +String type
        +String videoUrl
        +Array questions
        +Number duration
    }

    class QuizResult {
        +ObjectId _id
        +ObjectId student
        +ObjectId lesson
        +ObjectId course
        +Number score
        +Boolean isPassed
    }

    User "1" -- "0..*" Course : creates (Instructor)
    User "1" -- "0..*" QuizResult : has (Student)
    Course "1" *-- "0..*" Lesson : contains
    Course "1" -- "0..*" QuizResult : associated with
    Lesson "1" -- "0..*" QuizResult : attempts
```

## 3. Sequence Diagrams

### 3.1 Login Process
**Description:** Detailed flow of authentication where the client sends credentials and receives a JWT token via an HTTP-only cookie.

```mermaid
sequenceDiagram
    participant User
    participant Client as React Client
    participant API as AuthController
    participant DB as MongoDB

    User->>Client: Enters Email & Password
    Client->>API: POST /api/auth/login
    API->>DB: findOne({ email })
    DB-->>API: User Document
    API->>API: bcrypt.compare(password, hash)
    
    alt Invalid Credentials
        API-->>Client: 401 Unauthorized
        Client-->>User: Show Error Message
    else Valid Credentials
        API->>API: Generate JWT
        API-->>Client: 200 OK (Set-Cookie: accessToken)
        Client->>Client: Update AuthContext
        Client-->>User: Redirect to Dashboard
    end
```

### 3.2 View Course Details
**Description:** How the system retrieves course information and specific user progress when a student opens a course page.

```mermaid
sequenceDiagram
    participant Student
    participant Page as CourseDetail Page
    participant API as CourseController
    participant DB as MongoDB

    Student->>Page: Clicks Course Card
    Page->>API: GET /api/courses/:id
    API->>DB: findById(id).populate('lessons')
    DB-->>API: Course Data + Lessons
    API-->>Page: JSON { course, lessons }
    
    par Load Progress
        Page->>API: GET /api/progress/:courseId
        API->>DB: find({ student, course })
        DB-->>API: Progress Data
        API-->>Page: JSON { completedLessonIds }
    end

    Page-->>Student: Renders Video Player & Sidebar
```

## 4. Entity-Relationship (ER) Diagram
**Description:** Visualizes the database schema for the MERN stack application. It highlights the *One-to-Many* relationships between Instructors and Courses, and Courses and Lessons.

```mermaid
erDiagram
    USER ||--o{ COURSE : "instructs"
    USER ||--o{ PROGRESS : "tracks"
    USER ||--o{ QUIZ_RESULT : "attempts"
    
    COURSE ||--|{ LESSON : "contains"
    COURSE ||--o{ PROGRESS : "has"
    
    LESSON ||--o{ QUIZ_RESULT : "evaluated by"

    USER {
        string _id PK
        string name
        string email
        string password
        enum role
    }

    COURSE {
        string _id PK
        string title
        string category
        string description
        string instructor_id FK
    }

    LESSON {
        string _id PK
        string course_id FK
        string title
        enum type
        json questions
    }

    QUIZ_RESULT {
        string _id PK
        string student_id FK
        string lesson_id FK
        number score
        boolean isPassed
    }
```
