import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AdminTaskSummary from '@/components/dashboard/AdminTaskSummary';
import CollaboratorMyTasks from '@/components/dashboard/CollaboratorMyTasks';
import LatestNotifications from '@/components/dashboard/LatestNotifications';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

function Dashboard({ user, collabCount, formationsCount, specialitysCount, coursCount, taskSummaries, latestNotifications, upcomingTasks }) {
    const isAdmin = user.roles.some(role => role.name === 'admin');
    const isCollaborator = user.roles.some(role => role.name === 'collaborator');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {isAdmin && (
                        <AdminTaskSummary
                            collabCount={collabCount}
                            specialitysCount={specialitysCount}
                            coursCount={coursCount}
                            formationsCount={formationsCount}
                            taskSummaries={taskSummaries}
                        />
                    )}

                    {isCollaborator && (
                        <>
                            <CollaboratorMyTasks
                                taskSummaries={taskSummaries}
                            />
                            <UpcomingDeadlines
                                upcomingTasks={upcomingTasks}
                            />
                        </>
                    )}

                    {(isAdmin || isCollaborator) && (
                        <LatestNotifications
                            notifications={latestNotifications}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default Dashboard;
