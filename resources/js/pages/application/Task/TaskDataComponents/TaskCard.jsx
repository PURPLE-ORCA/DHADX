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
        <Card className="bg-white transition-all duration-300 hover:border-[var(--brand-color)] hover:shadow-xl dark:bg-[var(--background)]">
            <CardHeader className="">
                <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-2 text-lg font-bold text-black transition-colors group-hover:text-[var(--brand-color)] dark:text-white">
                        {task.title}
                    </CardTitle>
                    <TaskPriorityBadge priority={task.priority} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Due Date */}
                <div className="flex items-center gap-3 text-sm font-medium text-black dark:text-white">
                    <Clock className="h-4 w-4" />
                    <span>Due: {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}</span>
                </div>

                {/* Action */}
                <Link href={route('tasks.show', task.id)}>
                    <Button variant="ghost" className="mt-2 w-full font-semibold text-[var(--brand-color)] transition-colors">
                        View Details
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
