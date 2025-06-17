import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from "sonner";
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function Create({ collaborators, cours }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, post, processing, reset, errors } = useForm({
        collaborator_id: '',
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
                console.error("Save errors:", errors);
            }
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
                        <Label htmlFor="collaborator_id">
                            {translations.camps.collaborator_label}
                        </Label>
<Select
    value={String(data.collaborator_id)}
    onValueChange={(value) => setData('collaborator_id', value)}
>
    <SelectTrigger className="w-full">
        <SelectValue placeholder={translations.camps.select_collaborator_placeholder} />
    </SelectTrigger>
    <SelectContent>
        {collaborators.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
            </SelectItem>
        ))}
    </SelectContent>
</Select>
                        <InputError message={errors.collaborator_id} />
                    </div>

                    {/* Cour Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="cour_id">
                            {translations.camps.course_label}
                        </Label>
<Select
    value={String(data.cour_id)}
    onValueChange={(value) => setData('cour_id', value)}
>
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
