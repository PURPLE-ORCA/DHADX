import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useContext, useEffect } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import { toast } from "sonner";
import { LoaderCircle } from 'lucide-react';

export default function Edit({ user, specialities }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, put, processing, reset, errors, clearErrors } = useForm({
        name: user.name,
        email: user.email,
        birth_date: user.birth_date || '',
        cin: user.cin || '',
        gender: user.gender || '',
        image: null,
        speciality_ids: user.specialities.map((s) => s.id),
    });

    useEffect(() => {
        setData({
            name: user.name,
            email: user.email,
            birth_date: user.birth_date || '',
            cin: user.cin || '',
            gender: user.gender || '',
            image: null,
            speciality_ids: user.specialities.map((s) => s.id),
        });
    }, [user, setData]);

    const submitForm = (e) => {
        e.preventDefault();

        put(route('users.update', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(translations.users.edit.updated_successfully);
            },
            onError: (errors) => {
                toast.error(translations.users.edit.failed_to_update);
                console.error("Update errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: translations.users.list_title,
            href: '/users',
        },
        {
            title: translations.users.edit.edit_user,
            href: '/users/edit',
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
            <Head title={translations.users.edit.page_title} />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">{translations.users.edit.edit_user_heading}</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="name">
                            {translations.users.edit.name_label}
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={translations.users.edit.name_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">
                            {translations.users.edit.email_label}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={translations.users.edit.email_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="birth_date">
                            {translations.users.edit.birth_date_label}
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
                            {translations.users.edit.cin_label}
                        </Label>
                        <Input
                            id="cin"
                            type="text"
                            name="cin"
                            value={data.cin}
                            onChange={(e) => setData('cin', e.target.value)}
                            placeholder={translations.users.edit.cin_placeholder}
                            autoComplete="off"
                        />
                        <InputError message={errors.cin} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="gender">
                            {translations.users.edit.gender_label}
                        </Label>
                        <Select
                            name="gender"
                            value={data.gender}
                            onValueChange={(value) => setData('gender', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={translations.users.edit.select_gender_placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">{translations.users.edit.gender_male}</SelectItem>
                                <SelectItem value="female">{translations.users.edit.gender_female}</SelectItem>
                                <SelectItem value="other">{translations.users.edit.gender_other}</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.gender} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">
                            {translations.users.edit.image_label}
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
                        <Label htmlFor="speciality_ids">{translations.users.edit.specialities_label}</Label>
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
                                router.visit(route('users.index'));
                            }}
                        >
                            {translations.users.edit.cancel_button}
                        </Button>
                        <Button disabled={processing} type="submit">
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {translations.users.edit.update_button}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
