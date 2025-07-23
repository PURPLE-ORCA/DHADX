import { Head, Link, usePage } from '@inertiajs/react';
// Correct, more appropriate icons for your actual features
import { ClipboardCheck, Presentation, Trophy } from 'lucide-react';
import AppLogo from '../components/app-logo'; // Using the corrected import path

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome to DHADX">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-neutral-950 text-neutral-100 selection:bg-red-500/80">
                <header className="fixed top-0 right-0 left-0 z-10 border-b border-neutral-800/50 p-4 backdrop-blur-sm">
                    <nav className="mx-auto flex max-w-7xl items-center justify-between">
                        <Link href={route('home')}>
                            <AppLogo className="h-8 w-auto" />
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
                                        className="rounded-md px-5 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
                                    >
                                        Log in
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="flex flex-grow flex-col items-center justify-center px-4 pt-24 text-center">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold tracking-tight text-neutral-50 sm:text-6xl md:text-7xl">
                            Your Development Journey,
                            <span className="relative ml-4 whitespace-nowrap text-red-500">Amplified</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-neutral-400">
                            DHADX is your dedicated platform for live training, hands-on exercises, and collaborative learning. This is where your
                            skills grow.
                        </p>

                        <div className="mt-10">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-red-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline-red-600"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded-md bg-red-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline-red-600"
                                >
                                    Get Started <span aria-hidden="true">→</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </main>

                <section className="mt-20 w-full max-w-7xl p-8">
                    <div className="grid grid-cols-1 gap-12 text-left sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col">
                            <Presentation className="mb-4 h-8 w-8 text-red-500" />
                            <h3 className="text-lg font-semibold text-white">Live Seances</h3>
                            <p className="mt-2 text-base text-neutral-400">
                                Participate in interactive sessions with real-time presence checks, instant exercise feedback, and a shared digital
                                whiteboard for brainstorming.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <ClipboardCheck className="mb-4 h-8 w-8 text-red-500" />
                            <h3 className="text-lg font-semibold text-white">Structured Learning Paths</h3>
                            <p className="mt-2 text-base text-neutral-400">
                                Follow a clear path through courses and formations. Track your progress, tackle assigned tasks, and see your skills
                                develop in real-time.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <Trophy className="mb-4 h-8 w-8 text-red-500" />
                            <h3 className="text-lg font-semibold text-white">Measure Your Growth</h3>
                            <p className="mt-2 text-base text-neutral-400">
                                Stay accountable with a personal dashboard, check your standing on the leaderboard, and manage all your tasks and
                                submissions in one place.
                            </p>
                        </div>
                    </div>
                </section>

                <footer className="w-full p-6 text-center text-sm text-neutral-500">
                    © {new Date().getFullYear()} DHADX
                    <span className="mx-2 text-neutral-700">|</span>
                    <span className="rounded-md bg-neutral-800 px-2 py-1 text-xs font-bold text-neutral-400">v1.0 Beta</span>
                </footer>
            </div>
        </>
    );
}
