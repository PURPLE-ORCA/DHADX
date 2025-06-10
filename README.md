# DAHDTRACK

## Overview
DAHDTRACK is a full-stack application designed for managing and tracking educational or training programs. It provides robust features for managing collaborators, courses, camps, and formations, with a strong emphasis on a dynamic leaderboard and a comprehensive task management system. The application aims to centralize progress tracking, streamline work assignments, and enhance communication through real-time notifications.

## Features

### Core Management
- **Collaborator Management:** CRUD operations for collaborators, including personal details and associated specialities.
- **Course and Camp Management:** Define courses with different levels and associate them with specific camps, tracking progress within each.

### Leaderboard System
- Displays collaborators ranked by their highest course level achieved and progress within that level.

### Task Management System
- **Task Lifecycle:** Supports various task statuses: `pending`, `in_progress`, `submitted`, `completed`, `needs_revision`, `overdue`, `cancelled`.
- **Role-Based Access Control:** Admins can create, edit, view, and delete tasks, assigning them to collaborators. Collaborators can view, update status, and add comments to their assigned tasks.
- **Automated Overdue Tracking:** Daily scheduled command (`tasks:check-overdue`) automatically updates overdue task statuses.
- **Task Review Workflow:** Assigners/Admins can review submitted tasks, approve completion, or request revisions.
- **Dashboard Integration:** Task summaries are displayed on the dashboard based on user roles.

### Notification System
- Real-time notifications for:
    - Task assignments to collaborators.
    - Task submissions for review to admins.
    - Collaborator enrollment in camps.
- Notifications are displayed via a bell icon with a pending count and a dropdown of latest notifications.
- Users can mark notifications as read.

### User Interface & Experience
- Modern, responsive, and intuitive UI built with Tailwind CSS and shadcn/ui.
- Supports **dark mode** as the default.
- Implemented **multi-language support** using `i18next` (Arabic, English, French).

## Technologies Used

### Backend
- **Laravel 12 (PHP):** Core backend framework.
- **PostgreSQL:** Relational database.
- **Pest:** PHP testing framework.

### Frontend
- **React 19 (JavaScript/JSX):** Frontend framework.
- **Inertia.js:** SPA bridge between Laravel and React.
- **Tailwind CSS 4:** Utility-first CSS framework for styling.
- **shadcn/ui:** Reusable UI component library.
- **Vite:** Frontend build tool.
- **i18next:** Internationalization library.

### Other
- **Laravel Breeze:** Authentication scaffolding.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/PURPLE-ORCA/DAHDTRACK.git
    cd DAHDTRACK
    ```

2.  **Install PHP Dependencies:**
    ```bash
    composer install
    ```

3.  **Install JavaScript Dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

4.  **Environment Configuration:**
    -   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    -   Generate an application key:
        ```bash
        php artisan key:generate
        ```
    -   Configure your PostgreSQL or MySql database connection in the `.env` file.

5.  **Database Migration and Seeding:**
    ```bash
    php artisan migrate --seed
    ```

6.  **Run Frontend Assets:**
    ```bash
    npm run dev
    # or yarn dev
    ```

7.  **Start Laravel Development Server:**
    ```bash
    php artisan serve
    ```

8.  **Access the Application:**
    Open your browser and navigate to `http://localhost:8000` (or the URL provided by `php artisan serve`).

## Key Architectural Decisions & Patterns

-   **Laravel-Inertia-React Stack:** Combines the power of Laravel with the reactivity of React, bridged by Inertia.js for a seamless SPA experience.
-   **Service-Repository Pattern:** Intended for complex business logic to ensure separation of concerns.
-   **Inertia.js Partial Reloads:** Used for efficient data updates.
-   **Optimized Leaderboard Query:** Leverages PostgreSQL's `LATERAL JOIN` for complex aggregations.
-   **Role-Based Access Control (RBAC):** Implemented using Laravel Gates for granular permission management.
-   **Laravel Notification System:** Utilizes the database channel for persistent notifications.
-   **Component-Based UI:** React components are structured for reusability and maintainability.

## Current Status

The core backend logic for the leaderboard and a comprehensive task management system are fully implemented. The notification system and multi-language support are also in place.

### Known Issues
-   **Frontend Task Display Alignment:** The `MyTasks.jsx` component needs further alignment with `CollaboratorPortalController.php` to correctly display tasks for collaborators.
