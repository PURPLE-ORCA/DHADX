import { Clock } from 'lucide-react';
import AdminTableView from './TaskDataComponents/AdminTableView';
import TasksByStatusView from './TaskDataComponents/TasksByStatusView';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function TaskData({ tasks, auth, onDeleted }) {
    const { translations } = useContext(TranslationContext);
    const isAdmin = auth.user.roles.some((role) => role.name === 'admin');

    return (
        <>
            {tasks.length === 0 ? (
                <div className="bg-background  py-20 text-center">
                    <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border-2 border-black bg-white dark:border-white dark:bg-black">
                        <Clock className="h-16 w-16 text-black dark:text-white" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">{translations.tasks.data.no_tasks_found}</h3>
                    <p className="mx-auto max-w-md font-medium text-neutral-600 dark:text-neutral-300">{translations.tasks.data.no_tasks_message}</p>
                </div>
            ) : (
                <TasksByStatusView tasks={tasks} />
            )}
        </>
    );
}
