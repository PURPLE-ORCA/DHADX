import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TranslationContext } from '@/context/TranslationProvider';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useContext } from 'react';
import { toast } from 'sonner';

export default function Create({ users, cours }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, post, processing, reset, errors } = useForm({
        user_id: '',
        cour_id: '',
    });

    const submitForm = (e) => {
        e.preventDefault();
        post(route('camps.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success(translations.camps.create_success_toast);
            },
            onError: (errors) => {
                toast.error(translations.camps.create_error_toast);
                console.error('Save errors:', errors);
            },
        });
    };

    const breadcrumbs = [
        {
            title: translations.camps.camps_list,
            href: '/camps',
        },
        {
            title: translations.camps.add_new_camp,
            href: '/camps/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translations.camps.title} />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">{translations.camps.add_new_camp}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    {/* Collaborator Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="user_id">{translations.camps.user_label}</Label>
                        <Select value={String(data.user_id)} onValueChange={(value) => setData('user_id', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={translations.camps.select_user_placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                        {u.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.user_id} />
                    </div>

                    {/* Cour Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="cour_id">{translations.camps.course_label}</Label>
                        <Select value={String(data.cour_id)} onValueChange={(value) => setData('cour_id', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={translations.camps.select_course_placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {cours.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.cour_id} />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {translations.camps.add_button}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
