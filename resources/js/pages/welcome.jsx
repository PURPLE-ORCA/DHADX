import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpenCheck, BrainCircuit, TrendingUp } from 'lucide-react'; // Some thematic icons

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome to DHADX">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-neutral-100 p-6 text-neutral-800 lg:justify-center lg:p-8 dark:bg-neutral-950 dark:text-neutral-100">
                <header className="fixed top-0 right-0 left-0 z-10 p-6">
                    <nav className="mx-auto flex max-w-5xl items-center justify-between">
                        <Link href={route('home')} className="text-primary dark:text-primary-foreground text-2xl font-bold">
                            DHADX
                        </Link>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-block rounded-md px-5 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-block rounded-md px-5 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="flex flex-grow flex-col items-center justify-center text-center">
                    <div className="max-w-2xl">
                        <h1 className="mb-6 text-5xl font-bold tracking-tight text-neutral-900 sm:text-6xl dark:text-neutral-50">
                            Welcome to <span className="text-primary">DHADX</span>
                        </h1>
                        <p className="mb-8 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                            The central hub for tracking collaborator development, managing courses, and fostering growth.
                        </p>

                        {/* Optional: Some feature highlights or icons */}
                        <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
                            <div className="flex flex-col items-center">
                                <BookOpenCheck className="text-primary mb-3 h-10 w-10" />
                                <h3 className="text-md font-semibold">Organized Learning</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Track progress through structured courses and formations.
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <TrendingUp className="text-primary mb-3 h-10 w-10" />
                                <h3 className="text-md font-semibold">Monitor Growth</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Visualize collaborator development and identify top performers.
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <BrainCircuit className="text-primary mb-3 h-10 w-10" />
                                <h3 className="text-md font-semibold">Skill Enhancement</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Empower the team by managing their learning journey effectively.
                                </p>
                            </div>
                        </div>

                        {!auth.user && (
                            <div className="flex items-center justify-center gap-x-6">
                                <Link href={route('login')} className="text-lg leading-6 font-semibold text-neutral-900 dark:text-neutral-100">
                                    Log In <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        )}
                        {auth.user && (
                            <Link
                                href={route('dashboard')}
                                className="bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:outline-primary rounded-md px-6 py-3 text-lg font-semibold shadow-sm transition-colors focus-visible:outline-offset-2"
                            >
                                Go to Dashboard
                            </Link>
                        )}
                    </div>
                </main>

                {/* Footer (Optional) */}
                <footer className="w-full p-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
                    © {new Date().getFullYear()} DHADX. All rights reserved.
                </footer>
            </div>
        </>
    );
}
