import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Transition } from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { toast } from "sonner";
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function Edit({ speciality }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, put, processing, reset, errors, clearErrors } = useForm({
        name: speciality.name,
    });

    useEffect(() => {
        setData({
            name: speciality.name,
        });
    }, [speciality, setData]);

    const submitForm = (e) => {
        e.preventDefault();

        put(route('specialities.update', speciality.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(translations.specialities.edit.success_toast);
            },
            onError: (errors) => {
                toast.error(translations.specialities.edit.error_toast);
                console.error("Update errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: translations.specialities.list_title,
            href: '/specialities',
        },
        {
            title: translations.specialities.edit.edit_speciality,
            href: '/specialities/edit',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translations.specialities.edit.page_title} />
            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">{translations.specialities.edit.edit_speciality_heading}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="name">
                            {translations.specialities.edit.name_label}
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={translations.specialities.edit.name_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                clearErrors();
                                reset();
                                router.visit(route('specialities.index'));
                            }}
                        >
                            {translations.specialities.edit.cancel_button}
                        </Button>
                        <Button disabled={processing} type="submit">
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {translations.specialities.edit.update_button}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
