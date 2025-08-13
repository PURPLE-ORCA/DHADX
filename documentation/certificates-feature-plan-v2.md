# Certificates Feature: Technical Plan (v2)

This document outlines the technical plan for implementing and updating the Certificates feature. This version incorporates the requirement to link each certificate to a specific course.

## 1. Database Schema

The `certificates` table will be modified to include a foreign key to the `cours` table.

**Table: `certificates`**

| Column | Type | Modifiers |
| :--- | :--- | :--- |
| `id` | `bigint` (unsigned) | Primary Key, Auto-increment |
| `user_id` | `bigint` (unsigned) | Foreign Key to `users(id)` on delete cascade |
| **`course_id`** | **`bigint` (unsigned)** | **Foreign Key to `cours(id)` on delete cascade** |
| `code` | `varchar(255)` | Unique, Indexed |
| `image` | `varchar(255)` | Nullable |
| `created_at`| `timestamp` | Nullable |
| `updated_at`| `timestamp` | Nullable |

**Migration:**
The existing `create_certificates_table` migration will be modified to add the `course_id` column.

```php
// database/migrations/2025_08_13_161321_create_certificates_table.php
Schema::create('certificates', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('course_id')->constrained('cours')->onDelete('cascade'); // New column
    $table->string('code')->unique();
    $table->string('image')->nullable();
    $table->timestamps();
});
```

## 2. Backend Architecture

### Laravel Model (`App\Models\Certificate.php`)

The `Certificate` model will be updated to include the new relationship.

-   **Relationships**:
    -   `user()`: A `belongsTo` relationship to the `User` model.
    -   **`course()`**: A `belongsTo` relationship to the `Cour` model.

```php
// app/Models/Certificate.php
class Certificate extends Model
{
    // ... existing code

    public function course()
    {
        return $this->belongsTo(Cour::class);
    }
}
```

### Controller (`CertificateController.php`)

The controller logic will be updated to handle the `course_id`.

-   **`index()`**:
    -   Eager-load the `user` and `course` relationships.
    -   Pass the list of all courses to the frontend for the creation form.
-   **`store(Request $request)`**:
    -   Update validation to require `user_id` and `course_id`.
    -   Save the `course_id` when creating the new `Certificate` record.

```php
// app/Http/Controllers/CertificateController.php

// index()
public function index()
{
    $certificates = Certificate::with(['user', 'course'])->latest()->get();
    $users = User::all();
    $courses = Cour::all(); // Fetch courses
    return inertia('application/Certificate/Index', [
        'certificates' => $certificates,
        'users' => $users,
        'courses' => $courses, // Pass courses to frontend
    ]);
}

// store()
public function store(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'course_id' => 'required|exists:cours,id', // Add validation
    ]);

    // ... certificate creation logic
}
```

## 3. Frontend Architecture

### Add/Edit Certificate Form (`resources/js/pages/application/Certificate/Data.jsx`)

-   **Description**: The form for creating and editing a certificate will be updated.
-   **Components**:
    -   Add a `Select` component for choosing a `Course`. This dropdown will be populated with the `courses` prop.
-   **Props**:
    -   `courses`: An array of course objects from the backend.

### Certificate List (`resources/js/pages/application/Certificate/Index.jsx`)

-   **Description**: The main table listing all certificates will be updated.
-   **Components**:
    -   Add a "Course" column to the data table to display `certificate.course.title`.

### View Certificate Modal (`resources/js/pages/application/Certificate/ViewCertificateModal.jsx`)

-   **Description**: The modal for viewing a single certificate's details will be updated.
-   **Components**:
    -   Add a field to display the name of the associated course.

## 4. Step-by-step Implementation Plan

1.  **Database**:
    1.  Modify the `2025_08_13_161321_create_certificates_table.php` migration to add the `course_id` foreign key.
    2.  Run `php artisan migrate:fresh --seed` to apply the schema changes.

2.  **Backend**:
    1.  Update `app/Models/Certificate.php` to add the `course()` relationship.
    2.  Update `app/Http/Controllers/CertificateController.php`:
        -   Modify `index()` to eager-load `course` and pass the `courses` collection to the view.
        -   Modify `store()` to include validation for `course_id`.

3.  **Frontend**:
    1.  Update `resources/js/pages/application/Certificate/Data.jsx` to include a `Select` input for courses.
    2.  Update `resources/js/pages/application/Certificate/Index.jsx` to add a "Course" column to the certificates table.
    3.  Update `resources/js/pages/application/Certificate/ViewCertificateModal.jsx` to display the course name.

4.  **Testing**:
    1.  Verify that the "Add Certificate" form shows a list of courses and requires one to be selected.
    2.  Confirm that the new certificate is saved with the correct `course_id`.
    3.  Ensure the main certificate list and view modal correctly display the associated course name.