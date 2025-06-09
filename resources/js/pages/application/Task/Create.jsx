import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import InputError from '@/components/input-error';

export default function Create({ collaborators }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        assignee_id: '',
        due_date: undefined,
        priority: 'medium',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tasks.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create New Task</h2>}
        >
            <Head title="Create Task" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-black overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        autoComplete="title"
                                        isFocused={true}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="assignee_id">Assignee</Label>
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
                                    <InputError message={errors.assignee_id} className="mt-2" />
                                </div>

                                <div>
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
                                    <InputError message={errors.due_date} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="priority">Priority</Label>
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
                                    <InputError message={errors.priority} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <Button className="ms-4" disabled={processing}>
                                        Create Task
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
