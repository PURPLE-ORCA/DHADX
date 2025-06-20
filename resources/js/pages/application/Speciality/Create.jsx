import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Transition } from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from "sonner";
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function Create() {
    const { translations } = useContext(TranslationContext);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
    });

    const submitForm = (e) => {
        e.preventDefault();

        post(route('specialities.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                router.reload({ only: ['specialities'] });
                toast.success(translations.specialities.create.success_toast);
            },
            onError: (errors) => {
                toast.error(translations.specialities.create.error_toast);
                console.error("Save errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: translations.specialities.list_title,
            href: '/specialities',
        },
        {
            title: translations.specialities.create.add_new_speciality,
            href: '/specialities/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translations.specialities.create.page_title} />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">{translations.specialities.create.add_new_speciality_heading}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="name">
                            {translations.specialities.create.name_label}
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={translations.specialities.create.name_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {translations.specialities.create.add_button}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
