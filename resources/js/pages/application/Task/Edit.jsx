import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

export default function Edit({ task, collaborators }) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title,
        description: task.description,
        assignee_id: task.assignee_id.toString(),
        due_date: task.due_date ? new Date(task.due_date) : undefined,
        priority: task.priority,
        status: task.status,
    });

    const submitForm = (e) => {
        e.preventDefault();
        put(route('tasks.update', task.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Task updated successfully!");
            },
            onError: (errors) => {
                toast.error("Failed to update task. Please check the form.");
                console.error("Update errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: 'Tasks list',
            href: '/tasks',
        },
        {
            title: `Edit task: ${task.title}`,
            href: `/tasks/${task.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Task: ${task.title}`} />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">Edit Task: {task.title}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="title">
                            Title
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Task Title"
                            autoComplete="off"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Task Description"
                            autoComplete="off"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="assignee_id">Assignee</Label>
                        <Select
                            onValueChange={(value) => setData('assignee_id', value)}
                            value={data.assignee_id}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                {collaborators.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.assignee_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="due_date">Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !data.due_date && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.due_date ? format(new Date(data.due_date), 'PPP') : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.due_date ? new Date(data.due_date) : undefined}
                                    onSelect={(date) => setData('due_date', date ? format(date, 'yyyy-MM-dd') : undefined)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors.due_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="priority">Priority</Label>
                        <Select
                            onValueChange={(value) => setData('priority', value)}
                            value={data.priority}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.priority} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="status">Status</Label>
                        <Select
                            onValueChange={(value) => setData('status', value)}
                            value={data.status}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="submitted">Submitted</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="needs_revision">Needs Revision</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Update Task
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
