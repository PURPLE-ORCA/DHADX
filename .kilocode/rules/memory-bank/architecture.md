# System Architecture

This project follows a monolithic architecture with a tightly coupled frontend and backend, using Laravel and Inertia.js.

## Backend Architecture

The backend is built with the Laravel framework, following the Model-View-Controller (MVC) pattern.

-   **Models**: Located in `app/Models`, these Eloquent models represent the database tables and handle data logic. Key models include `User`, `Task`, `Camp`, `Seance`, and `Collaborator`.
-   **Controllers**: Located in `app/Http/Controllers`, these handle incoming HTTP requests, interact with models, and return responses, typically rendering Inertia pages.
-   **Routes**: Defined in `routes/web.php`, `routes/auth.php`, and `routes/settings.php`, they map URLs to controller actions.
-   **Database**: Migrations in `database/migrations` define the schema for the PostgreSQL database.

## Frontend Architecture

The frontend is a single-page application (SPA) built with React and managed by Inertia.js.

-   **Pages**: Located in `resources/js/Pages`, these are the top-level components for each route, rendered by Inertia.
-   **Components**: Reusable UI components are in `resources/js/components`, including UI primitives from `shadcn/ui`.
-   **Layouts**: `resources/js/layouts` define the overall page structure, such as the main application layout and authentication pages.
-   **Styling**: Tailwind CSS is used for styling, with the configuration in `tailwind.config.js` and the main CSS file at `resources/css/app.css`.

## Key Technical Decisions

-   **Inertia.js**: Chosen to bridge the gap between a classic server-side rendered Laravel application and a modern JavaScript-based SPA, allowing for a responsive UI without the complexity of a separate API.
-   **React**: Used for building a component-based and interactive user interface.
-   **Shadcn UI**: Provides a set of accessible and reusable UI components, accelerating frontend development.
-   **Laravel Reverb**: Used for real-time features like notifications and live seance updates via WebSockets.

## Design Patterns

-   **MVC (Model-View-Controller)**: The core pattern for the Laravel backend.
-   **Repository Pattern**: Not explicitly used, but could be a future improvement for data abstraction.
-   **Service Classes**: Some logic is encapsulated in services, but most business logic resides in controllers.
-   **Component-Based Architecture**: The frontend is built with reusable React components.