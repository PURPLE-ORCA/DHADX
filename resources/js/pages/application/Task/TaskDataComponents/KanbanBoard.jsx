import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskStatusBadge, { getStatusConfig } from './TaskStatusBadge';

export default function KanbanBoard({ tasks }) {
    const statuses = ['pending', 'in_progress', 'submitted', 'needs_revision', 'completed', 'overdue', 'cancelled'];
    const tasksByStatus = statuses.reduce((acc, status) => {
        acc[status] = tasks.filter((task) => task.status === status);
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {statuses.map((status) => {
                const statusConfig = getStatusConfig(status);
                const StatusIcon = statusConfig.icon;

                return (
                    <div key={status} className="rounded-xl border-2 border-black bg-white p-6 dark:border-white dark:bg-black">
                        <div className="mb-6 flex items-center gap-3">
                            <div className={`rounded-lg p-2 ${statusConfig.bg}`}>
                                <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                            </div>
                            <h3 className="flex-1 text-lg font-bold text-black capitalize dark:text-white">{status.replace('_', ' ')}</h3>
                            <Badge className="bg-black font-bold text-white dark:bg-white dark:text-black">{tasksByStatus[status].length}</Badge>
                        </div>

                        <div className="space-y-4">
                            {tasksByStatus[status].length > 0 ? (
                                tasksByStatus[status].map((task) => <TaskCard key={task.id} task={task} />)
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-white dark:border-white dark:bg-black">
                                        <StatusIcon className="h-8 w-8 text-black dark:text-white" />
                                    </div>
                                    <p className="font-medium text-black dark:text-white">No tasks in this status</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
