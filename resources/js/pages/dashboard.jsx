import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

function Dashboard({ collabCount, formationsCount, specialitysCount, coursCount, taskSummaries, auth }) {
    const isAdmin = auth.user.roles.some(role => role.name === 'admin');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">

                    {isAdmin ? (
                        <>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="text-4xl">{collabCount}</div>
                            <div className="mt-2 text-neutral-400">Collaborateurs</div>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="text-4xl">{specialitysCount}</div>
                            <div className="mt-2 text-neutral-400">Specialities</div>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="text-4xl">{coursCount}</div>
                            <div className="mt-2 text-neutral-400">Cours</div>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="text-4xl">{formationsCount}</div>
                            <div className="mt-2 text-neutral-400">Formations</div>
                        </div>
                    </div>
                            <Link href={route('tasks.index')} className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="text-4xl">{taskSummaries.submittedForReviewCount}</div>
                                    <div className="mt-2 text-neutral-400">Tasks for Review</div>
                                </div>
                            </Link>
                            <Link href={route('tasks.index', { status: 'overdue' })} className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="text-4xl">{taskSummaries.globalOverdueCount}</div>
                                    <div className="mt-2 text-neutral-400">Global Overdue Tasks</div>
                                </div>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href={route('tasks.index', { status: 'pending' })} className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="text-4xl">{taskSummaries.pendingTasksCount}</div>
                                    <div className="mt-2 text-neutral-400">Pending Tasks</div>
                                </div>
                            </Link>
                            <Link href={route('tasks.index', { status: 'overdue' })} className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="text-4xl">{taskSummaries.overdueTasksCount}</div>
                                    <div className="mt-2 text-neutral-400">Overdue Tasks</div>
                                </div>
                            </Link>
                        </>
                    )}
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}

export default Dashboard;
