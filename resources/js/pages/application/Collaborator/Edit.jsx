import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useContext, useEffect } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import { toast } from "sonner";
import { LoaderCircle } from 'lucide-react';

export default function Edit({ collaborator, specialities }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, put, processing, reset, errors, clearErrors } = useForm({
        name: collaborator.name,
        speciality_ids: collaborator.specialities.map((s) => s.id),
    });

    useEffect(() => {
        setData({
            name: collaborator.name,
            speciality_ids: collaborator.specialities.map((s) => s.id),
        });
    }, [collaborator, setData]);

    const submitForm = (e) => {
        e.preventDefault();

        put(route('collaborators.update', collaborator.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(translations.collaborators.edit.updated_successfully);
            },
            onError: (errors) => {
                toast.error(translations.collaborators.edit.failed_to_update);
                console.error("Update errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: translations.collaborators.list_title,
            href: '/collaborators',
        },
        {
            title: translations.collaborators.edit.edit_collaborator,
            href: '/collaborators/edit',
        },
    ];

    const handleSpecialityChange = (id, checked) => {
        setData('speciality_ids', checked
            ? [...data.speciality_ids, id]
            : data.speciality_ids.filter((specId) => specId !== id)
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translations.collaborators.edit.page_title} />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">{translations.collaborators.edit.edit_collaborator_heading}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="name">
                            {translations.collaborators.edit.name_label}
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={translations.collaborators.edit.name_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">
                            {translations.collaborators.edit.email_label}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={collaborator.email || ''} // Display collaborator's email, read-only
                            readOnly
                            className="bg-gray-100 dark:bg-gray-800" // Optional: style to indicate read-only
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="speciality_ids">{translations.collaborators.edit.specialities_label}</Label>
                        <div className="flex flex-wrap gap-4">
                            {specialities.map((spec) => (
                                <div key={spec.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`spec-${spec.id}`}
                                        checked={data.speciality_ids.includes(spec.id)}
                                        onCheckedChange={(checked) => handleSpecialityChange(spec.id, checked)}
                                    />
                                    <Label htmlFor={`spec-${spec.id}`}>{spec.name}</Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.speciality_ids} />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                clearErrors();
                                reset();
                                router.visit(route('collaborators.index'));
                            }}
                        >
                            {translations.collaborators.edit.cancel_button}
                        </Button>
                        <Button disabled={processing} type="submit">
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {translations.collaborators.edit.update_button}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
