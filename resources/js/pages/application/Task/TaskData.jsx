import { Clock } from 'lucide-react';
import AdminTableView from './TaskDataComponents/AdminTableView';
import TasksByStatusView from './TaskDataComponents/TasksByStatusView';

export default function TaskData({ tasks, auth, onDeleted }) {
    const isAdmin = auth.user.roles.some((role) => role.name === 'admin');

    return (
        <>
            {tasks.length === 0 ? (
                <div className="rounded-xl border-2 border-black bg-white py-20 text-center dark:border-white dark:bg-black">
                    <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border-2 border-black bg-white dark:border-white dark:bg-black">
                        <Clock className="h-16 w-16 text-black dark:text-white" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">No tasks found</h3>
                    <p className="mx-auto max-w-md font-medium text-neutral-600 dark:text-neutral-300">
                        There are currently no tasks to display for the selected criteria.
                    </p>
                </div>
            ) : (
                <TasksByStatusView tasks={tasks} />
            )}
        </>
    );
}
