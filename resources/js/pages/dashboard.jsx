import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AdminTaskSummary from '@/components/dashboard/AdminTaskSummary';
import CollaboratorMyTasks from '@/components/dashboard/CollaboratorMyTasks';
import LatestNotifications from '@/components/dashboard/LatestNotifications';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import MyCampProgressWidget from '@/components/dashboard/MyCampProgressWidget'; // Import the new widget
import Masonry from 'react-masonry-css'; // <<<< IMPORT MASONRY
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

function Dashboard({ user, collabCount, formationsCount, specialitysCount, coursCount, taskSummaries, latestNotifications, upcomingTasks, collaboratorActiveCamps }) {
    const { translations } = useContext(TranslationContext);

    const breadcrumbs = [
        {
            title: translations.dashboard.title,
            href: '/dashboard',
        },
    ];
    const isAdmin = user.roles.some(role => role.name === 'admin');
    const isCollaborator = user.roles.some(role => role.name === 'collaborator');

    // Define breakpoint columns for Masonry
    // This tells Masonry how many columns to use at different screen widths
    const breakpointColumnsObj = {
        default: 4, // Default number of columns (e.g., for very large screens or if others don't match)
        1280: 3,    // 3 columns at 1280px wide and up (xl)
        1024: 2,    // 2 columns at 1024px wide and up (lg)
        768: 1      // 1 column at 768px wide and up (md)
    };

    // Collect all widgets that should be part of the Masonry layout
    const widgets = [];

    if (isAdmin) {
        widgets.push(
            <AdminTaskSummary
                key="admin-summary" // Important: add unique keys to children of Masonry
                collabCount={collabCount}
                specialitysCount={specialitysCount}
                coursCount={coursCount}
                formationsCount={formationsCount}
                taskSummaries={taskSummaries}
            />
        );
    }

    widgets.push(<LatestNotifications key="notifications" notifications={latestNotifications} />);

    if (isCollaborator) {
        widgets.push(
            <UpcomingDeadlines
            key="collab-deadlines"
            upcomingTasks={upcomingTasks}
            />,
            <MyCampProgressWidget
            key="collab-progress"
            camps={collaboratorActiveCamps}
            />,
            <CollaboratorMyTasks
                key="collab-tasks"
                taskSummaries={taskSummaries}
            />
        );
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                {/* Replace your old grid div with Masonry */}
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid flex w-auto" // `flex w-auto` is from react-masonry-css docs
                    columnClassName="my-masonry-grid_column bg-clip-padding px-2" // `px-2` for gap, adjust as needed
                >
                    {/* Render all collected widgets */}
                    {widgets}
                </Masonry>
            </div>
        </AppLayout>
    );
}

export default Dashboard;
