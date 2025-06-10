import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Eye, Pencil } from 'lucide-react';
import DeleteTask from '../DeleteTask';
import TaskPriorityBadge from './TaskPriorityBadge';
import TaskStatusBadge from './TaskStatusBadge';

export default function AdminTableView({ tasks, onDeleted }) {
    return (
        <div className="overflow-x-hidden ">
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
                        <TableCell className="font-medium">{task.assignee?.name || 'N/A'}</TableCell>
                        <TableCell className="font-medium">{task.assigner?.name || 'N/A'}</TableCell>
                        <TableCell className="font-medium">
                            {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>
                            <TaskStatusBadge status={task.status} />
                        </TableCell>
                        <TableCell>
                            <TaskPriorityBadge priority={task.priority} />
                        </TableCell>
                        <TableCell className="font-medium">
                            <div className="flex items-center justify-end gap-6">
                                <Link className="flex items-center gap-1" href={route('tasks.show', task.id)}>
                                    <Eye className="w-4" /> View
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
}
