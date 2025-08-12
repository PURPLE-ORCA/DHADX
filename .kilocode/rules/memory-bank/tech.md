# Tech Context

## Technologies Used
- **Backend**:
    - **Laravel 12**: PHP Framework for backend logic, routing, and database interaction.
    - **PHP**: Core language for backend development.
    - **PostgreSQL**: Relational database for data storage.
    - **Breeze**: Laravel starter kit for authentication.
    - **Pest**: PHP testing framework.
    - **Laravel Reverb:** For WebSocket communication.
    - **Redis:** For queueing and broadcasting.
- **Frontend**:
- **React 19**: JavaScript library for building user interfaces.
- **Inertia.js**: Adapter to connect Laravel backend with React frontend, enabling SPA-like experience with server-side routing.
- **Tailwind CSS 4**: Utility-first CSS framework for styling.
- **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS.
- **Iconify**: Icon library.
- **date-fns**: JavaScript date utility library.
-**Laravel Echo & `pusher-js`:** For subscribing to WebSocket channels.
-**`axios`:** For background API requests.
- **Sonner**: Toast notification library.
- **Custom Internationalization**: Implemented using React Context (`TranslationContext`) and JSON language files (`resources/js/lang/*.json`) for multi-language support.
- **Development Tools**:
    - **Composer**: PHP dependency manager.
    - **NPM**: JavaScript package managers.
    - **Vite**: Frontend build tool.
    - **ESLint**: JavaScript linter.
    - **Prettier**: Code formatter.

## Development Setup
- **Environment Variables**: Sensitive credentials and configurations are managed via `.env` files.
- **Database Migrations**: Database schema changes are managed using Laravel migrations.
- **Seeding**: Database seeders are used to populate the database with dummy data for development and testing.
- **Asset Compilation**: Vite is used to compile and bundle frontend assets (JS, CSS).

## Technical Constraints
- **Laravel/PHP Version**: Requires PHP 8.2+ for Laravel 12.
- **Node.js Version**: Specific Node.js version might be required for frontend dependencies.
- **Database**: Currently configured for PostgreSQL.

## Dependencies
- **Composer Dependencies**: Listed in `composer.json` (e.g., `laravel/framework`, `inertiajs/inertia-laravel`, `tighten/ziggy`).
- **NPM Dependencies**: Listed in `package.json` (e.g., `react`, `tailwindcss`, `@inertiajs/react`, `lucide-react`, `date-fns`, `sonner`).

## Tool Usage Patterns
- **Laravel Artisan**: Used for migrations, seeding, caching, and other backend tasks.
- **Vite**: `npm run dev` for development server, `npm run build` for production assets.
- **Pest**: `php artisan test` for running backend tests.
- **ESLint/Prettier**: Integrated into development workflow for code quality and formatting.