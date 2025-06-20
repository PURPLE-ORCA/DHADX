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
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function Edit({ task, collaborators }) {
    const { translations } = useContext(TranslationContext);
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
                toast.success(translations.tasks.edit.updated_successfully);
            },
            onError: (errors) => {
                toast.error(translations.tasks.edit.failed_to_update);
                console.error("Update errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: translations.tasks.list_title,
            href: '/tasks',
        },
        {
            title: translations.tasks.edit.edit_task_title.replace(':task_title', task.title),
            href: `/tasks/${task.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translations.tasks.edit.page_title.replace(':task_title', task.title)} />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">{translations.tasks.edit.edit_task_heading.replace(':task_title', task.title)}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="title">
                            {translations.tasks.edit.title_label}
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder={translations.tasks.edit.title_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">{translations.tasks.edit.description_label}</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder={translations.tasks.edit.description_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="assignee_id">{translations.tasks.edit.assignee_label}</Label>
                        <Select
                            onValueChange={(value) => setData('assignee_id', value)}
                            value={data.assignee_id}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={translations.tasks.edit.select_assignee_placeholder} />
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
                        <Label htmlFor="due_date">{translations.tasks.edit.due_date_label}</Label>
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
                                    {data.due_date ? format(new Date(data.due_date), 'PPP') : <span>{translations.tasks.edit.pick_a_date}</span>}
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
                        <Label required htmlFor="priority">{translations.tasks.edit.priority_label}</Label>
                        <Select
                            onValueChange={(value) => setData('priority', value)}
                            value={data.priority}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={translations.tasks.edit.select_priority_placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">{translations.tasks.edit.priority_low}</SelectItem>
                                <SelectItem value="medium">{translations.tasks.edit.priority_medium}</SelectItem>
                                <SelectItem value="high">{translations.tasks.edit.priority_high}</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.priority} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="status">{translations.tasks.edit.status_label}</Label>
                        <Select
                            onValueChange={(value) => setData('status', value)}
                            value={data.status}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={translations.tasks.edit.select_status_placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">{translations.tasks.edit.status_pending}</SelectItem>
                                <SelectItem value="in_progress">{translations.tasks.edit.status_in_progress}</SelectItem>
                                <SelectItem value="submitted">{translations.tasks.edit.status_submitted}</SelectItem>
                                <SelectItem value="completed">{translations.tasks.edit.status_completed}</SelectItem>
                                <SelectItem value="needs_revision">{translations.tasks.edit.status_needs_revision}</SelectItem>
                                <SelectItem value="overdue">{translations.tasks.edit.status_overdue}</SelectItem>
                                <SelectItem value="cancelled">{translations.tasks.edit.status_cancelled}</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {translations.tasks.edit.update_button}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
