import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from "sonner";
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function Create({ specialities }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        email: '', // Add email
        speciality_ids: [],
    });

    const submitForm = (e) => {
        e.preventDefault();

        post(route('collaborators.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success(translations.collaborators.create_success_toast);
            },
            onError: (errors) => {
                toast.error(translations.collaborators.create_error_toast);
                console.error("Save errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: translations.collaborators.collaborators_list,
            href: '/collaborators',
        },
        {
            title: translations.collaborators.add_new_collaborator,
            href: '/collaborators/create',
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
            <Head title={translations.collaborators.title} />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">{translations.collaborators.add_new_collaborator}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="name">
                            {translations.collaborators.name_label}
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={translations.collaborators.name_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="email">
                            {translations.collaborators.email_label}
                        </Label>
                        <Input
                            id="email"
                            type="email" // Use type="email"
                            name="email"
                            value={data.email} // Add email to useForm data
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={translations.collaborators.email_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.email} /> {/* Add InputError for email */}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="specialities">{translations.collaborators.specialities_label}</Label>
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

                    <div>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {translations.collaborators.add_button}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
