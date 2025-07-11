import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { Transition } from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Edit({ seance, courses, mentors }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, put, processing, reset, errors, clearErrors, recentlySuccessful } = useForm({
        topic: seance.topic || '',
        agenda: seance.agenda || '',
        course_id: seance.course_id || '',
        mentor_id: seance.mentor_id || '',
        meeting_link: seance.meeting_link || '',
        scheduled_at: seance.scheduled_at ? new Date(seance.scheduled_at) : null,
    });

    const submitForm = (e) => {
        e.preventDefault();

        put(route('seances.update', seance.id), {
            preserveScroll: true,
            onSuccess: () => {
                // No reset needed for edit, just show success
                // router.reload({ only: ['seance'] }); // Reload specific prop if needed
            },
        });
    };

    const breadcrumbs = [
        {
            title: translations.seances?.list_title || 'Seances list',
            href: '/seances',
        },
        {
            title: translations.seances?.edit?.edit_seance || 'Edit Seance',
            href: route('seances.edit', seance.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translations.seances?.edit?.page_title || 'Edit Seance'} />

            <div className="p-4">
                <Transition
                    show={recentlySuccessful}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="mb-4 rounded bg-green-500 p-2 text-center">
                        <p className="text-sm font-semibold text-white">{translations.seances?.edit?.saved_successfully || 'Seance updated successfully!'}</p>
                    </div>
                </Transition>

                <h1 className="mb-6 text-2xl font-bold">{translations.seances?.edit?.edit_seance_heading || `Edit Seance: ${seance.topic}`}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="topic">
                            {translations.seances?.edit?.topic_label || 'Topic'}
                        </Label>
                        <Input
                            id="topic"
                            name="topic"
                            value={data.topic}
                            onChange={(e) => setData('topic', e.target.value)}
                            placeholder={translations.seances?.edit?.topic_placeholder || 'Enter seance topic'}
                            autoComplete="off"
                        />
                        <InputError message={errors.topic} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="agenda">
                            {translations.seances?.edit?.agenda_label || 'Agenda'}
                        </Label>
                        <Textarea
                            id="agenda"
                            name="agenda"
                            value={data.agenda}
                            onChange={(e) => setData('agenda', e.target.value)}
                            placeholder={translations.seances?.edit?.agenda_placeholder || 'Enter seance agenda'}
                            autoComplete="off"
                        />
                        <InputError message={errors.agenda} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="meeting_link">
                            {translations.seances?.edit?.meeting_link_label || 'Meeting Link'}
                        </Label>
                        <Input
                            id="meeting_link"
                            name="meeting_link"
                            type="url"
                            value={data.meeting_link}
                            onChange={(e) => setData('meeting_link', e.target.value)}
                            placeholder={translations.seances?.edit?.meeting_link_placeholder || 'Enter meeting link (e.g., Google Meet, Zoom)'}
                            autoComplete="off"
                        />
                        <InputError message={errors.meeting_link} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="course_id">
                            {translations.seances?.edit?.course_label || 'Course'}
                        </Label>
                        <Select
                            onValueChange={(value) => setData('course_id', value)}
                            value={data.course_id}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={translations.seances?.edit?.select_course_placeholder || 'Select a course'} />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((course) => (
                                    <SelectItem key={course.id} value={course.id}>
                                        {course.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.course_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="mentor_id">
                            {translations.seances?.edit?.mentor_label || 'Mentor'}
                        </Label>
                        <Select
                            onValueChange={(value) => setData('mentor_id', value)}
                            value={data.mentor_id}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={translations.seances?.edit?.select_mentor_placeholder || 'Select a mentor'} />
                            </SelectTrigger>
                            <SelectContent>
                                {mentors.map((mentor) => (
                                    <SelectItem key={mentor.id} value={mentor.id}>
                                        {mentor.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.mentor_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="scheduled_at">
                            {translations.seances?.edit?.scheduled_at_label || 'Scheduled At'}
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={cn(
                                        'w-[280px] justify-start text-left font-normal',
                                        !data.scheduled_at && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.scheduled_at ? format(new Date(data.scheduled_at), 'PPP p') : <span>{translations.seances?.edit?.pick_date_time || 'Pick a date and time'}</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.scheduled_at ? new Date(data.scheduled_at) : undefined}
                                    onSelect={(date) => setData('scheduled_at', date)}
                                    initialFocus
                                />
                                {/* Time picker can be added here if needed, e.g., using another input or custom component */}
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors.scheduled_at} />
                    </div>

                    <div>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {translations.seances?.edit?.update_button || 'Update Seance'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
