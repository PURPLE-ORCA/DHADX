import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TranslationContext } from '@/context/TranslationProvider';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { useContext } from 'react';
import { toast } from 'sonner';

export default function Create({ collaborators }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        due_date: undefined,
        priority: 'medium',
        sub_tasks: [
            // Start with one blank sub-task
            { assignee_id: '', title: '', description: '' },
        ],
    });

    const handleSubTaskChange = (index, field, value) => {
        const updatedSubTasks = [...data.sub_tasks];
        updatedSubTasks[index][field] = value;
        setData('sub_tasks', updatedSubTasks);
    };

    const addSubTask = () => {
        setData('sub_tasks', [...data.sub_tasks, { assignee_id: '', title: '', description: '' }]);
    };

    const removeSubTask = (index) => {
        const updatedSubTasks = data.sub_tasks.filter((_, i) => i !== index);
        setData('sub_tasks', updatedSubTasks);
    };

    const submitForm = (e) => {
        e.preventDefault();
        post(route('tasks.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success(translations.tasks.create.saved_successfully);
            },
            onError: (errors) => {
                toast.error(translations.tasks.create.failed_to_create);
                console.error('Save errors:', errors);
            },
        });
    };

    const breadcrumbs = [
        {
            title: translations.tasks.list_title,
            href: '/tasks',
        },
        {
            title: translations.tasks.create.create_new_task,
            href: '/tasks/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translations.tasks.create.page_title} />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">{translations.tasks.create.create_new_task_heading}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="title">
                            {translations.tasks.create.title_label}
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder={translations.tasks.create.title_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">{translations.tasks.create.description_label}</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder={translations.tasks.create.description_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">{translations.tasks.create.sub_tasks_heading}</h2>
                        {data.sub_tasks.map((subTask, index) => (
                            <div key={index} className="grid grid-cols-1 items-end gap-4 rounded-md border p-4 md:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label required htmlFor={`sub_task_assignee_${index}`}>
                                        {translations.tasks.create.assignee_label}
                                    </Label>
                                    <Select onValueChange={(value) => handleSubTaskChange(index, 'assignee_id', value)} value={subTask.assignee_id}>
                                        <SelectTrigger id={`sub_task_assignee_${index}`} className="w-full">
                                            <SelectValue placeholder={translations.tasks.create.select_assignee_placeholder} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {collaborators.map((collaborator) => (
                                                <SelectItem key={collaborator.id} value={String(collaborator.id)}>
                                                    {collaborator.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors[`sub_tasks.${index}.assignee_id`]} />
                                </div>
                                <div className="grid gap-2">
                                    <Label required htmlFor={`sub_task_title_${index}`}>
                                        {translations.tasks.create.sub_task_title_label}
                                    </Label>
                                    <Input
                                        id={`sub_task_title_${index}`}
                                        type="text"
                                        value={subTask.title}
                                        onChange={(e) => handleSubTaskChange(index, 'title', e.target.value)}
                                        placeholder={translations.tasks.create.sub_task_title_placeholder}
                                        autoComplete="off"
                                    />
                                    <InputError message={errors[`sub_tasks.${index}.title`]} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor={`sub_task_description_${index}`}>{translations.tasks.create.sub_task_description_label}</Label>
                                    <Input
                                        id={`sub_task_description_${index}`}
                                        type="text"
                                        value={subTask.description}
                                        onChange={(e) => handleSubTaskChange(index, 'description', e.target.value)}
                                        placeholder={translations.tasks.create.sub_task_description_placeholder}
                                        autoComplete="off"
                                    />
                                    <InputError message={errors[`sub_tasks.${index}.description`]} />
                                </div>
                                {data.sub_tasks.length > 1 && (
                                    <Button type="button" variant="destructive" onClick={() => removeSubTask(index)} className="col-span-full">
                                        {translations.tasks.create.remove_sub_task_button}
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button type="button" onClick={addSubTask}>
                            {translations.tasks.create.add_sub_task_button}
                        </Button>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="due_date">{translations.tasks.create.due_date_label}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={cn('w-full justify-start text-left font-normal', !data.due_date && 'text-muted-foreground')}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.due_date ? format(new Date(data.due_date), 'PPP') : <span>{translations.tasks.create.pick_a_date}</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.due_date ? new Date(data.due_date) : undefined}
                                    onSelect={(date) => setData('due_date', date ? format(date, 'yyyy-MM-dd') : undefined)}
                                    initialFocus
                                    // ADD THIS PROP:
                                    disabled={{ before: new Date() }}
                                />
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors.due_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="priority">
                            {translations.tasks.create.priority_label}
                        </Label>
                        <Select onValueChange={(value) => setData('priority', value)} value={data.priority}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={translations.tasks.create.select_priority_placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">{translations.tasks.create.priority_low}</SelectItem>
                                <SelectItem value="medium">{translations.tasks.create.priority_medium}</SelectItem>
                                <SelectItem value="high">{translations.tasks.create.priority_high}</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.priority} />
                    </div>

                    <div>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {translations.tasks.create.create_button}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
