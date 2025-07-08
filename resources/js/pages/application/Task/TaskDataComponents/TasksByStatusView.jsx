import { useState, useMemo, useContext } from 'react';
import { Clock } from 'lucide-react';
import { AnimatedBackground } from '@/components/motion-primitives/animated-background'; 
import TaskCard from './TaskCard'; 
import { getStatusConfig } from './TaskStatusBadge';
import { TranslationContext } from '@/context/TranslationProvider';

export default function TasksByStatusView({ tasks }) {
    const { translations } = useContext(TranslationContext);

    // Define your statuses - these will be the segments
    // Use useMemo to ensure translations are available when STATUS_OPTIONS is defined
    const STATUS_OPTIONS = useMemo(() => [
        { id: 'pending', label: translations.tasks.status.pending },
        { id: 'in_progress', label: translations.tasks.status.in_progress },
        { id: 'submitted', label: translations.tasks.status.submitted },
        { id: 'needs_revision', label: translations.tasks.status.needs_revision },
        { id: 'completed', label: translations.tasks.status.completed },
        { id: 'overdue', label: translations.tasks.status.overdue },
        { id: 'cancelled', label: translations.tasks.status.cancelled },
    ], [translations]); // Dependency array includes translations

    const [activeStatus, setActiveStatus] = useState(STATUS_OPTIONS[0].id); // Default to the first status ID

    // Memoize filtered tasks to avoid re-filtering on every render unless tasks or activeStatus changes
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => task.status === activeStatus);
    }, [tasks, activeStatus]);

    const handleStatusChange = (newActiveId) => {
        if (newActiveId) {
            setActiveStatus(newActiveId);
        }
    };

    return (
        <div className="w-full">
            {/* Segmented Control */}
            <div className="mb-6 flex justify-center">
                <AnimatedBackground
                    defaultValue={activeStatus}
                    onValueChange={handleStatusChange}
                    className="rounded-full bg-neutral-100 p-1 dark:bg-neutral-800 flex" // Add flex for horizontal layout
                    // transition={{ type: "spring", stiffness: 200, damping: 20 }} // Example transition
                    enableHover={false} // Usually false for segmented controls
                >
                    {STATUS_OPTIONS.map((statusOption) => (
                        <button
                            key={statusOption.id}
                            data-id={statusOption.id} // Required by AnimatedBackground
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors focus:outline-none
                                        ${activeStatus === statusOption.id
                                            ? 'text-black dark:text-white' // Active text color handled by AnimatedBackground usually
                                            : 'text-black hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                                        }`}
                            // The AnimatedBackground typically handles the "active" background style
                        >
                            {statusOption.label}
                        </button>
                    ))}
                </AnimatedBackground>
            </div>

            {/* Task List Area */}
            {filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center">
                    {(() => {
                        const statusConfig = getStatusConfig(activeStatus);
                        const StatusIcon = statusConfig.icon || Clock; // Fallback icon
                        return (
                            <>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                                    <StatusIcon className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
                                </div>
                                <p className="font-medium text-neutral-700 dark:text-neutral-300">
                                    {(translations.tasks.data?.no_tasks_in_status || 'No tasks in \':status\' status.').replace(':status', STATUS_OPTIONS.find(s => s.id === activeStatus)?.label || activeStatus)}
                                </p>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
