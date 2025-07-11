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

export default function Create({ courses, mentors }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, post, processing, reset, errors, clearErrors, recentlySuccessful } = useForm({
        topic: '',
        agenda: '',
        course_id: '',
        mentor_id: '',
        meeting_link: '',
        scheduled_at: null,
    });

    const submitForm = (e) => {
        e.preventDefault();

        post(route('seances.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                router.reload({ only: ['seances'] });
            },
        });
    };

    const breadcrumbs = [
        {
            title: translations.seances?.list_title || 'Seances list',
            href: '/seances',
        },
        {
            title: translations.seances?.create?.add_new_seance || 'Add New Seance',
            href: '/seances/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translations.seances?.create?.page_title || 'Create Seance'} />

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
                        <p className="text-sm font-semibold text-white">{translations.seances?.create?.saved_successfully || 'Seance saved successfully!'}</p>
                    </div>
                </Transition>

                <h1 className="mb-6 text-2xl font-bold">{translations.seances?.create?.add_new_seance_heading || 'Add New Seance'}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="topic">
                            {translations.seances?.create?.topic_label || 'Topic'}
                        </Label>
                        <Input
                            id="topic"
                            name="topic"
                            value={data.topic}
                            onChange={(e) => setData('topic', e.target.value)}
                            placeholder={translations.seances?.create?.topic_placeholder || 'Enter seance topic'}
                            autoComplete="off"
                        />
                        <InputError message={errors.topic} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="agenda">
                            {translations.seances?.create?.agenda_label || 'Agenda'}
                        </Label>
                        <Textarea
                            id="agenda"
                            name="agenda"
                            value={data.agenda}
                            onChange={(e) => setData('agenda', e.target.value)}
                            placeholder={translations.seances?.create?.agenda_placeholder || 'Enter seance agenda'}
                            autoComplete="off"
                        />
                        <InputError message={errors.agenda} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="meeting_link">
                            {translations.seances?.create?.meeting_link_label || 'Meeting Link'}
                        </Label>
                        <Input
                            id="meeting_link"
                            name="meeting_link"
                            type="url"
                            value={data.meeting_link}
                            onChange={(e) => setData('meeting_link', e.target.value)}
                            placeholder={translations.seances?.create?.meeting_link_placeholder || 'Enter meeting link (e.g., Google Meet, Zoom)'}
                            autoComplete="off"
                        />
                        <InputError message={errors.meeting_link} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="course_id">
                            {translations.seances?.create?.course_label || 'Course'}
                        </Label>
                        <Select
                            onValueChange={(value) => setData('course_id', value)}
                            value={data.course_id}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={translations.seances?.create?.select_course_placeholder || 'Select a course'} />
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
                            {translations.seances?.create?.mentor_label || 'Mentor'}
                        </Label>
                        <Select
                            onValueChange={(value) => setData('mentor_id', value)}
                            value={data.mentor_id}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={translations.seances?.create?.select_mentor_placeholder || 'Select a mentor'} />
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
                            {translations.seances?.create?.scheduled_at_label || 'Scheduled At'}
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
                                    {data.scheduled_at ? format(new Date(data.scheduled_at), 'PPP p') : <span>{translations.seances?.create?.pick_date_time || 'Pick a date and time'}</span>}
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
                            {translations.seances?.create?.add_button || 'Create Seance'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
