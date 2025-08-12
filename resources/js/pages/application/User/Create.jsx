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

export default function CreateUser({ specialities }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        email: '', // Add email
        speciality_ids: [],
    });

    const submitForm = (e) => {
        e.preventDefault();

        post(route('users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success(translations.users.create_success_toast);
            },
            onError: (errors) => {
                toast.error(translations.users.create_error_toast);
                console.error("Save errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: translations.users.users_list,
            href: '/users',
        },
        {
            title: translations.users.add_new_user,
            href: '/users/create',
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
            <Head title={translations.users.title} />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">{translations.users.add_new_user}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="name">
                            {translations.users.name_label}
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={translations.users.name_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="email">
                            {translations.users.email_label}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={translations.users.email_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="birth_date">
                            {translations.users.birth_date_label}
                        </Label>
                        <Input
                            id="birth_date"
                            type="date"
                            name="birth_date"
                            value={data.birth_date}
                            onChange={(e) => setData('birth_date', e.target.value)}
                        />
                        <InputError message={errors.birth_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="cin">
                            {translations.users.cin_label}
                        </Label>
                        <Input
                            id="cin"
                            type="text"
                            name="cin"
                            value={data.cin}
                            onChange={(e) => setData('cin', e.target.value)}
                            placeholder={translations.users.cin_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.cin} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="gender">
                            {translations.users.gender_label}
                        </Label>
                        <select
                            id="gender"
                            name="gender"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                            <option value="">{translations.users.select_gender_placeholder}</option>
                            <option value="male">{translations.users.gender_male}</option>
                            <option value="female">{translations.users.gender_female}</option>
                            <option value="other">{translations.users.gender_other}</option>
                        </select>
                        <InputError message={errors.gender} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">
                            {translations.users.image_label}
                        </Label>
                        <Input
                            id="image"
                            type="file"
                            name="image"
                            onChange={(e) => setData('image', e.target.files[0])}
                        />
                        <InputError message={errors.image} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="specialities">{translations.users.specialities_label}</Label>
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
                            {translations.users.add_button}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
