import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function Index({ tasks, auth }) {
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
                    {tasks.map(task => (
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
                            <TableCell>
                                <Link href={route('tasks.show', task.id)}>
                                    <Button variant="link" className="p-0 h-auto">View</Button>
                                </Link>
                                <Link href={route('tasks.edit', task.id)} className="ml-2">
                                    <Button variant="link" className="p-0 h-auto">Edit</Button>
                                </Link>
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-red-500 ml-2"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this task?')) {
                                            // Implement delete logic here, e.g., Inertia.delete(route('tasks.destroy', task.id))
                                            console.log('Delete task:', task.id);
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <AppLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Task Management</h2>}
        >
            <Head title="Tasks" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {isAdmin && (
                            <div className="flex justify-end mb-4">
                                <Link href={route('tasks.create')}>
                                    <Button>Create New Task</Button>
                                </Link>
                            </div>
                        )}

                        {isAdmin ? (
                            <AdminTableView tasks={tasks} />
                        ) : (
                            <KanbanBoard tasks={tasks} />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
