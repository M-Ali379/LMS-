# LMS Performance Review & Optimization Plan

## 1. Backend Optimization

### A. API Pagination (Critical)
**Current Status:** Endpoints like `/api/courses` and `/api/users` use `find()` without limits. This will crash the server as the database grows.
**Recommendation:** Implement cursor-based or offset-based pagination.
-   **Action:** Modify `getCourses` and `getUsers` to accept `page` and `limit` query parameters.
    ```javascript
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const courses = await Course.find().skip(skip).limit(limit);
    ```

### B. MongoDB Indexing
**Current Status:**
-   `User`: Email is unique (indexed).
-   `Progress`: Compound index on `{ student: 1, course: 1 }` (Good).
-   `Course`: No explicit indexes on foreign keys or search fields.
**Recommendation:** Add indexes for frequent query patterns.
-   **Action:** Add indexes to `Course.js`:
    ```javascript
    courseSchema.index({ instructor: 1 }); // For fetching "My Courses"
    courseSchema.index({ category: 1 });   // For filtering
    courseSchema.index({ title: 'text' }); // For search functionality
    ```

### C. Data Population/Selection
**Current Status:** `getCourse` populates `lessons`. If a course has 50 lessons with long text content, the payload is massive.
**Recommendation:** Select only necessary fields.
-   **Action:** When listing courses, don't populate full instructor details.
-   **Action:** When fetching a single course, populate lessons but exclude `content` if it's large text.
    ```javascript
    .populate('lessons', 'title type duration videoUrl completed')
    ```

### D. Caching (Future)
-   **Recommendation:** Use Redis to cache the result of `getCourses` for public users, invalidating it only when a course is created/updated.

## 2. Frontend Optimization (Client)

### A. Lazy Loading & Code Splitting
**Current Status:** Good. `App.jsx` uses `React.lazy` and `Suspense`. Routes are code-split.
**Recommendation:** Ensure "heavy" components like the Text Editor (if added) or Chart libraries are also dynamically imported.

### B. Image Optimization
**Current Status:** Using direct URLs or YouTube thumbnails.
**Recommendation:** Implement lazy loading for images using the `loading="lazy"` attribute (standard in HTML5) or a specialized Image component.

### C. Debouncing
**Current Status:** Search inputs on dashboards might trigger API calls on every keystroke (need to check implementation).
**Recommendation:** Ensure search is debounced by 300-500ms.

## 3. Implementation Steps

1.  **Modify `User.js` and `Course.js` models** to add indexes.
2.  **Update `courseController.js`** to support pagination in `getCourses`.
3.  **Update `userController.js`** to support pagination in `getUsers`.
4.  (Optional) Setup `api-rate-limit` middleware to prevent abuse.
