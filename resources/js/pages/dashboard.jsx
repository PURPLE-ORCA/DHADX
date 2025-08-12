import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AdminTaskSummary from '@/components/dashboard/AdminTaskSummary';
import LatestNotifications from '@/components/dashboard/LatestNotifications';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import MyCampProgressWidget from '@/components/dashboard/MyCampProgressWidget'; // Import the new widget
import LiveSeanceWidget from '@/components/dashboard/LiveSeanceWidget';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import Masonry from 'react-masonry-css';

function Dashboard({ user, usersCount, formationsCount, specialitysCount, coursCount, taskSummaries, latestNotifications, urgentTasks, userActiveCamps, activeSeance }) {
    const { translations } = useContext(TranslationContext);

    const breadcrumbs = [
        {
            title: translations.dashboard.title,
            href: '/dashboard',
        },
    ];
    const isAdmin = user.roles.some(role => role.name === 'admin');
    const isUser = user.roles.some(role => role.name === 'user');

    if (isUser) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <LiveSeanceWidget seance={activeSeance} />
                        <UpcomingDeadlines urgentTasks={urgentTasks} />
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <MyCampProgressWidget camps={userActiveCamps} />
                        <LatestNotifications notifications={latestNotifications} />
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Admin rendering logic can stay the same with Masonry
    const breakpointColumnsObj = {
        default: 4,
        1280: 3,
        1024: 2,
        768: 1
    };

    const widgets = [];

    if (isAdmin) {
        widgets.push(
            <AdminTaskSummary
                key="admin-summary"
                usersCount={usersCount}
                specialitysCount={specialitysCount}
                coursCount={coursCount}
                formationsCount={formationsCount}
                taskSummaries={taskSummaries}
            />
        );
    }

    widgets.push(<LatestNotifications key="notifications" notifications={latestNotifications} />);

    if (isUser) {
        widgets.push(
            <UpcomingDeadlines
            key="collab-deadlines"
            urgentTasks={urgentTasks}
            />,
            <MyCampProgressWidget
            key="collab-progress"
            camps={userActiveCamps}
            />,
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid flex w-auto"
                    columnClassName="my-masonry-grid_column bg-clip-padding px-2"
                >
                    {widgets}
                </Masonry>
            </div>
        </AppLayout>
    );
}

export default Dashboard;
