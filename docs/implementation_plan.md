# Quiz & Assessment System Implementation Plan

## Goal
Enable instructors to create quizzes as part of a course, and allow students to take them with auto-grading.

## Proposed Changes

### Server (`server/`)

#### [MODIFY] `server/models/Lesson.js`
-   **Schema Update:**
    -   Make `videoUrl` **optional** (required only if `type === 'video'`).
    -   Add `questions`: Array of objects.
        ```javascript
        questions: [{
            questionText: String,
            options: [String],
            correctOptionIndex: Number, // 0-3
            points: { type: Number, default: 1 }
        }]
        ```

#### [NEW] `server/models/QuizResult.js`
-   Store student attempts.
    ```javascript
    {
        student: { ObjectId, ref: 'User' },
        lesson: { ObjectId, ref: 'Lesson' },
        course: { ObjectId, ref: 'Course' },
        score: Number,
        totalPoints: Number,
        isPassed: Boolean
    }
    ```

#### [MODIFY] `server/controllers/lessonController.js`
-   **`createLesson`**: Update to accept `questions` in `req.body` and validate them if type is 'quiz'.
-   **`getLesson`**: Ensure questions are returned (strip `correctOptionIndex` for students? Or send it and trust client? *Secure approach: Strip answers, allow backend grading*).
    -   **Decision**: For simplicity in MERN, often answers are sent. **Better**: Create a specific `submitQuiz` endpoint that grades it.
-   **[NEW] `submitQuiz`**:
    -   Receive `{ answers: [indices] }`.
    -   Fetch `Lesson` with correct answers.
    -   Calculate score.
    -   Save `QuizResult`.
    -   Update `Progress` to mark lesson as completed if passed.

#### [MODIFY] `server/routes/lessonRoutes.js`
-   `POST /:id/submit` (Protect, Student)

### Client (`client/`)

#### [MODIFY] `client/src/pages/Dashboards/InstructorDashboard.jsx` (or `InstructorCourseManagement` page)
-   The "Create Lesson" UI needs a major upgrade.
-   Add a **Type Switcher**: Video vs Quiz.
-   If Quiz, render a **Question Builder**:
    -   Add Question button.
    -   Input for Question Text.
    -   Inputs for 4 Options.
    -   Radio button to select Correct Option.

#### [NEW] `client/src/components/QuizPlayer.jsx`
-   Render questions with radio buttons.
-   "Submit" button.
-   Display score after submission.

#### [MODIFY] `client/src/pages/LessonViewer.jsx` (or wherever lessons are viewed)
-   Switch between `VideoPlayer` and `QuizPlayer` based on `lesson.type`.
-   If `lesson.type === 'quiz'`, pass lesson data to `QuizPlayer`.

## Verification Plan
1.  **Backend Test**: Use `curl` or script to create a quiz lesson and submit an attempt.
2.  **Frontend Test**:
    -   Instructor: Create a Quiz with 2 questions.
    -   Student: Open the lesson, see the specific UI, submit wrong answers (check score), submit right answers (check score & progress update).
