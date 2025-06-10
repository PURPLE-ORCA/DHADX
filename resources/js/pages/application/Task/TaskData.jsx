import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle2, Clock, Eye, Pencil, User } from 'lucide-react';
import DeleteTask from './DeleteTask';

export default function TaskData({ tasks, auth, onDeleted }) {
    const isAdmin = auth.user.roles.some((role) => role.name === 'admin');

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                variant: 'outline',
                icon: Clock,
                color: 'text-black dark:text-white',
                bg: 'bg-white dark:bg-black border-2 border-black dark:border-white',
                badgeClass: 'border-black dark:border-white text-black dark:text-white',
            },
            in_progress: {
                variant: 'default',
                icon: AlertCircle,
                color: 'text-white',
                bg: 'bg-[var(--brand-color)]',
                badgeClass: 'bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90',
            },
            submitted: {
                variant: 'default',
                icon: CheckCircle2,
                color: 'text-white',
                bg: 'bg-black dark:bg-white',
                badgeClass: 'bg-black dark:bg-white text-white dark:text-black',
            },
            completed: {
                variant: 'default',
                icon: CheckCircle2,
                color: 'text-white',
                bg: 'bg-black dark:bg-white',
                badgeClass: 'bg-black dark:bg-white text-white dark:text-black',
            },
            needs_revision: {
                variant: 'destructive',
                icon: AlertCircle,
                color: 'text-white',
                bg: 'bg-[var(--brand-color)]',
                badgeClass: 'bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90',
            },
            overdue: {
                variant: 'destructive',
                icon: AlertCircle,
                color: 'text-white',
                bg: 'bg-[var(--brand-color)]',
                badgeClass: 'bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90',
            },
            cancelled: {
                variant: 'outline',
                icon: Clock,
                color: 'text-black dark:text-white',
                bg: 'bg-white dark:bg-black border-2 border-black dark:border-white',
                badgeClass: 'border-black dark:border-white text-black dark:text-white',
            },
        };
        return configs[status] || configs.pending;
    };

    const getPriorityConfig = (priority) => {
        const configs = {
            low: {
                variant: 'outline',
                color: 'text-black dark:text-white',
                badgeClass: 'border-black dark:border-white text-black dark:text-white',
            },
            medium: {
                variant: 'default',
                color: 'text-white',
                badgeClass: 'bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color)]/90',
            },
            high: {
                variant: 'default',
                color: 'text-white',
                badgeClass: 'bg-black dark:bg-white text-white dark:text-black',
            },
        };
        return configs[priority] || configs.low;
    };

    const TaskCard = ({ task }) => {
        const statusConfig = getStatusConfig(task.status);
        const priorityConfig = getPriorityConfig(task.priority);
        const StatusIcon = statusConfig.icon;

        return (
            <Card className="group border-2 border-black bg-white transition-all duration-300 hover:border-[var(--brand-color)] hover:shadow-xl dark:border-white dark:bg-black">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-2 text-lg font-bold text-black transition-colors group-hover:text-[var(--brand-color)] dark:text-white">
                            {task.title}
                        </CardTitle>
                        <Badge className={`ml-2 shrink-0 font-semibold ${priorityConfig.badgeClass}`}>{task.priority.toUpperCase()}</Badge>
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
    };

    const KanbanBoard = ({ tasks }) => {
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
    };

    const AdminTableView = ({ tasks }) => (
        <div className="overflow-hidden rounded-xl border-2 border-black bg-white dark:border-white dark:bg-black">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-2 border-black bg-black dark:border-white dark:bg-white">
                            <TableHead className="font-bold text-white dark:text-black">Title</TableHead>
                            <TableHead className="font-bold text-white dark:text-black">Assignee</TableHead>
                            <TableHead className="font-bold text-white dark:text-black">Assigner</TableHead>
                            <TableHead className="font-bold text-white dark:text-black">Due Date</TableHead>
                            <TableHead className="font-bold text-white dark:text-black">Status</TableHead>
                            <TableHead className="font-bold text-white dark:text-black">Priority</TableHead>
                            <TableHead className="text-right font-bold text-white dark:text-black">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => {
                            const statusConfig = getStatusConfig(task.status);
                            const priorityConfig = getPriorityConfig(task.priority);

                            return (
                                <TableRow
                                    key={task.id}
                                    className="border-b border-black transition-colors hover:bg-[var(--brand-color)]/10 dark:border-white"
                                >
                                    <TableCell className="font-bold text-black dark:text-white">{task.title}</TableCell>
                                    <TableCell className="font-medium text-black dark:text-white">{task.assignee?.name || 'N/A'}</TableCell>
                                    <TableCell className="font-medium text-black dark:text-white">{task.assigner?.name || 'N/A'}</TableCell>
                                    <TableCell className="font-medium text-black dark:text-white">
                                        {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={statusConfig.badgeClass}>{task.status.replace('_', ' ').toUpperCase()}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={priorityConfig.badgeClass}>{task.priority.toUpperCase()}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={route('tasks.show', task.id)}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="border border-black hover:bg-[var(--brand-color)] hover:text-white dark:border-white"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={route('tasks.edit', task.id)}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="border border-black hover:bg-[var(--brand-color)] hover:text-white dark:border-white"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <DeleteTask task={task} onDeleted={onDeleted} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );

    return (
        <>
            {tasks.length === 0 ? (
                <div className="rounded-xl border-2 border-black bg-white py-20 text-center dark:border-white dark:bg-black">
                    <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border-2 border-black bg-white dark:border-white dark:bg-black">
                        <Clock className="h-16 w-16 text-black dark:text-white" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">No tasks found</h3>
                    <p className="mx-auto max-w-md font-medium text-black dark:text-white">
                        {isAdmin ? 'Create your first task to get started.' : 'No tasks match your current search criteria.'}
                    </p>
                </div>
            ) : isAdmin ? (
                <AdminTableView tasks={tasks} />
            ) : (
                <KanbanBoard tasks={tasks} />
            )}
        </>
    );
}
