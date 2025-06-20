import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Clock, User } from 'lucide-react';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import TaskPriorityBadge, { getPriorityConfig } from './TaskPriorityBadge';
import TaskStatusBadge, { getStatusConfig } from './TaskStatusBadge';
import { Users } from 'lucide-react';

export default function TaskCard({ task }) {
    const { translations } = useContext(TranslationContext);
    const statusConfig = getStatusConfig(task.status);
    const StatusIcon = statusConfig.icon;

    return (
        <Card className="bg-white transition-all duration-300 hover:border-[var(--brand-color)] hover:shadow-xl dark:bg-[var(--background)]">
            <CardHeader className="">
                <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-2 text-lg font-bold text-black transition-colors group-hover:text-[var(--brand-color)] dark:text-white">
                        {task.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {task.sub_tasks && task.sub_tasks.length > 0 && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <Users className="h-4 w-4" />
                                <span>{task.sub_tasks.length}</span>
                            </div>
                        )}
                        <TaskPriorityBadge priority={task.priority} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Due Date */}
                <div className="flex items-center gap-3 text-sm font-medium text-black dark:text-white">
                    <Clock className="h-4 w-4" />
                    <span>{translations.tasks.card.due_date_prefix}: {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : translations.tasks.card.no_due_date}</span>
                </div>

                {/* Action */}
                <Link href={route('tasks.show', task.id)}>
                    <Button variant="ghost" className="mt-2 w-full font-semibold text-[var(--brand-color)] transition-colors">
                        {translations.tasks.card.view_details_button}
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
