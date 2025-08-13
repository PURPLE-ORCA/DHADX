
# **DHADX - v1.1 Beta**

## **Overview**

DHADX is a comprehensive, real-time platform designed for interactive training and collaborative development management. It provides a full suite of tools for mentors and users to engage in live training sessions, manage complex projects, and track skill progression. The application is built around a powerful **Live Seance Module**, which centralizes learning activities and eliminates the need for scattered, third-party tools.

## **Features**

### **The Live Seance Module (Real-Time)**
The core of the DHADX platform. A dedicated environment for interactive learning.
-   **Seance Lifecycle Management:** Mentors can schedule, start, finish, and cancel sessions, with the UI for all participants updating in real-time.
-   **Real-Time Presence Checking:** At any point during a live seance, mentors can initiate a presence check, prompting users to confirm their attendance within a time limit. The mentor's attendance list updates live.
-   **Live Exercise Submissions:** Mentors can create exercises on the fly. Users submit their work (text, code, or files) directly in the app, and submissions appear instantly on the mentor's screen for immediate review.
-   **Integrated Submission Viewer:** A clean, drawer-style UI allows mentors to view text, code, and image submissions without leaving the seance page.

### **Standalone Whiteboard Library**
-   A full-featured, persistent digital whiteboard powered by **Excalidraw**.
-   Each user has a personal library of whiteboards with auto-saving functionality.
-   Supports a "Public/Private" toggle to generate shareable, view-only links.

### **Core Management & Tracking**
-   **User & Course Management:** Robust CRUD interfaces for managing users, courses, camps, and their relationships.
-   **Leaderboard System:** Ranks users based on course progression, fostering healthy competition.
-   **Hierarchical Task Management:** A comprehensive system for assigning and tracking nested tasks with various statuses and priorities. **!! the tasks functionalities are Postponed for now untile we reach a decision on the new system for it !!**

### **User Experience & Notifications**
-   **Modern UI:** A sleek, dark-mode-first, and responsive interface built with Tailwind CSS and Shadcn UI.
-   **Intelligent Notification System:** A centralized helper formats notifications for a clean, user-friendly experience. The header dropdown shows unread items, while the dashboard widget provides a history.
-   **Role-Specific Dashboards:**
    -   **Admin:** High-level overview of platform statistics.
    -   **Student/Participant:** A "mission control" layout featuring a dynamic "Live or Next Seance" widget with a countdown, urgent tasks, and progress tracking.
-   **Multi-language Support:** Fully translated into Arabic, English, and French.

## **Technologies Used**

### **Backend**
-   **Laravel 12 (PHP):** Core backend framework.
-   **PostgreSQL:** Primary relational database.
-   **Laravel Reverb:** First-party WebSocket server for real-time communication.
-   **Redis:** High-performance key-value store used for both **Queueing** and as the **Pub/Sub driver** for broadcasting events to Reverb.
-   **Pest:** PHP testing framework.

### **Frontend**
-   **React 19 (JSX):** Frontend library.
-   **Inertia.js:** SPA bridge between Laravel and React.
-   **Vite:** Next-generation frontend tooling.
-   **Tailwind CSS 4:** Utility-first CSS framework.
-   **Shadcn UI:** Reusable UI component library.
-   **Axios:** Used for all background API requests that don't require a page reload (e.g., auto-saves, check-ins).
-   **Laravel Echo & Pusher.js:** Client-side libraries for listening to WebSocket events.

## **Setup Instructions**

1.  **Clone & Install:**
    ```bash
    git clone https://github.com/PURPLE-ORCA/DAHDTRACK.git
    cd DAHDTRACK
    composer install
    npm install
    ```
2.  **Environment Configuration:**
    -   Copy `.env.example` to `.env`.
    -   Run `php artisan key:generate`.
    -   Configure your `DB_*` variables for PostgreSQL.
    -   Ensure your `QUEUE_CONNECTION` is set to `database` or `redis`.
    -   Ensure your `BROADCAST_CONNECTION` is set to `reverb`.
    -   Configure your `REVERB_*` and `VITE_REVERB_*` variables according to your local environment (e.g., Laravel Herd).

3.  **Database & Linking:**
    ```bash
    php artisan migrate:fresh --seed
    php artisan storage:link
    ```
4.  **Run the Servers (Requires 3-4 separate terminals):**
    -   **Vite:** `npm run dev`
    -   **Reverb Server:** `php artisan reverb:start`
    -   **Queue Worker:** `php artisan queue:work`
    -   **(Optional) Dev Server:** `php artisan serve`

5.  **Access the Application:**
    Navigate to your configured local domain (e.g., `https://dhadx.test`).

## **Key Architectural Decisions & Patterns**

-   **Real-Time First Architecture:** The stack is built around a **Laravel > Redis > Reverb > Echo** pipeline. Using Redis as the pub/sub transport layer is critical, as it decouples the web server from the WebSocket server and bypasses local SSL/cURL issues.
-   **State-Driven UI:** Features like the Live Seance dashboard heavily rely on React state (`useState`) being updated by WebSocket events, which then drives conditional rendering.
-   **Policy-Based Authorization:** Permissions are handled by dedicated Laravel Policy classes (e.g., `SeancePolicy`) and applied via middleware, providing granular control over actions. This is favored over simple role checks.
-   **Data Integrity via Seeders:** The `DatabaseSeeder` is the single source of truth for creating user profiles with appropriate roles, preventing critical authorization bugs.
-   **Purpose-Built API Calls:** A clear distinction is made between Inertia-driven page visits and `axios`-driven background API calls to prevent "plain JSON response" errors.

## **Current Status**

DHADX v1.1 is feature-complete and ready for beta testing. The core modules—Live Seances, Whiteboards, and Course Management—are fully functional.

### **Known Issues**
-   None at the moment. All major bugs identified during the development of the Live Seance module have been resolved. The focus is now on gathering user feedback for v1.5.