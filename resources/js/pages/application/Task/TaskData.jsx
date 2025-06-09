import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Eye, Pencil } from 'lucide-react';
import DeleteTask from './DeleteTask';

export default function TaskData({ tasks, auth, onDeleted }) {
    const isAdmin = auth.user.roles.some(role => role.name === 'admin');

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'pending':
                return 'secondary';
            case 'in_progress':
                return 'default';
            case 'submitted':
                return 'info'; // Assuming 'info' variant exists or can be mapped
            case 'completed':
                return 'success'; // Assuming 'success' variant exists or can be mapped
            case 'needs_revision':
                return 'warning'; // Assuming 'warning' variant exists or can be mapped
            case 'overdue':
                return 'destructive';
            case 'cancelled':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const getPriorityBadgeVariant = (priority) => {
        switch (priority) {
            case 'low':
                return 'secondary';
            case 'medium':
                return 'default';
            case 'high':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const TaskCard = ({ task }) => (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>{task.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Due: {task.due_date ? format(new Date(task.due_date), 'PPP') : 'N/A'}
                </p>
                <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={getStatusBadgeVariant(task.status)}>{task.status.replace('_', ' ')}</Badge>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Assigner: {task.assigner?.name || 'N/A'}</p>
                <Link href={route('tasks.show', task.id)}>
                    <Button variant="link" className="p-0 h-auto mt-2">View Details</Button>
                </Link>
            </CardContent>
        </Card>
    );

    const KanbanBoard = ({ tasks }) => {
        const statuses = ['pending', 'in_progress', 'submitted', 'needs_revision', 'completed', 'overdue', 'cancelled'];
        const tasksByStatus = statuses.reduce((acc, status) => {
            acc[status] = tasks.filter(task => task.status === status);
            return acc;
        }, {});

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {statuses.map(status => (
                    <div key={status} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 capitalize">{status.replace('_', ' ')} ({tasksByStatus[status].length})</h3>
                        {tasksByStatus[status].length > 0 ? (
                            tasksByStatus[status].map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks in this status.</p>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const AdminTableView = ({ tasks }) => (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Assigner</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>{task.assignee?.name || 'N/A'}</TableCell>
                            <TableCell>{task.assigner?.name || 'N/A'}</TableCell>
                            <TableCell>{task.due_date ? format(new Date(task.due_date), 'PPP') : 'N/A'}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(task.status)}>{task.status.replace('_', ' ')}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                                <div className="flex items-center justify-end gap-6">
                                    <Link className="flex items-center gap-1" href={route('tasks.show', task.id)}>
                                        <Eye className="w-4" /> Show
                                    </Link>
                                    <Link className="flex items-center gap-1" href={route('tasks.edit', task.id)}>
                                        <Pencil className="w-4" /> Edit
                                    </Link>
                                    <DeleteTask task={task} onDeleted={onDeleted} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <>
            {isAdmin ? (
                <AdminTableView tasks={tasks} />
            ) : (
                <KanbanBoard tasks={tasks} />
            )}
        </>
    );
}
