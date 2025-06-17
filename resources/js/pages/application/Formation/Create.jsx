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

export default function Create({ cours }) {
    const { translations } = useContext(TranslationContext);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        icon_name: '', // Add icon_name to the form data
        cour_ids: [],
    });

    const submitForm = (e) => {
        e.preventDefault();

        post(route('formations.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success(translations.formations.create.success_toast);
            },
            onError: (errors) => {
                toast.error(translations.formations.create.error_toast);
                console.error("Save errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: translations.formations.list_title,
            href: '/formations',
        },
        {
            title: translations.formations.create.add_new_formation,
            href: '/formations/create',
        },
    ];

    const handleCourChange = (id, checked) => {
        setData('cour_ids', checked
            ? [...data.cour_ids, id]
            : data.cour_ids.filter((courId) => courId !== id)
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={translations.formations.create.page_title} />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">{translations.formations.create.add_new_formation_heading}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="name">
                            {translations.formations.create.name_label}
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={translations.formations.create.name_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="icon_name">
                            {translations.formations.create.icon_name_label}
                        </Label>
                        <Input
                            id="icon_name"
                            name="icon_name"
                            value={data.icon_name}
                            onChange={(e) => setData('icon_name', e.target.value)}
                            placeholder={translations.formations.create.icon_name_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.icon_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="cours">{translations.formations.create.cours_label}</Label>
                        <div className="flex flex-wrap gap-4">
                            {cours.map((cour) => (
                                <div key={cour.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`cour-${cour.id}`}
                                        checked={data.cour_ids.includes(cour.id)}
                                        onCheckedChange={(checked) => handleCourChange(cour.id, checked)}
                                    />
                                    <Label htmlFor={`cour-${cour.id}`}>{cour.name}</Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.cour_ids} />
                    </div>

                    <div>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {translations.formations.create.add_button}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
