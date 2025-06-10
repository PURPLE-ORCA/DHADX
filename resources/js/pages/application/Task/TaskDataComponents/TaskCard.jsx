import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Clock, User } from 'lucide-react';
import TaskPriorityBadge, { getPriorityConfig } from './TaskPriorityBadge';
import TaskStatusBadge, { getStatusConfig } from './TaskStatusBadge';

export default function TaskCard({ task }) {
    const statusConfig = getStatusConfig(task.status);
    const StatusIcon = statusConfig.icon;

    return (
        <Card className="group border-2 border-black bg-white transition-all duration-300 hover:border-[var(--brand-color)] hover:shadow-xl dark:border-white dark:bg-black">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-2 text-lg font-bold text-black transition-colors group-hover:text-[var(--brand-color)] dark:text-white">
                        {task.title}
                    </CardTitle>
                    <TaskPriorityBadge priority={task.priority} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Status */}
                <div className={`flex items-center gap-3 rounded-lg p-3 font-semibold ${statusConfig.bg}`}>
                    <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                    <span className={`text-sm ${statusConfig.color}`}>{task.status.replace('_', ' ').toUpperCase()}</span>
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-3 text-sm font-medium text-black dark:text-white">
                    <Clock className="h-5 w-5" />
                    <span>Due: {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}</span>
                </div>

                {/* Assigner */}
                <div className="flex items-center gap-3 text-sm font-medium text-black dark:text-white">
                    <User className="h-5 w-5" />
                    <span>Assigned by: {task.assigner?.name || 'N/A'}</span>
                </div>

                {/* Action */}
                <Link href={route('tasks.show', task.id)}>
                    <Button
                        variant="outline"
                        className="mt-4 w-full border-2 border-black font-semibold transition-colors hover:border-[var(--brand-color)] hover:bg-[var(--brand-color)] hover:text-white dark:border-white"
                    >
                        View Details
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
