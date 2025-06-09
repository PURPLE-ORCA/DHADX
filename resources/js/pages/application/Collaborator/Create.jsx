import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from "sonner";

export default function Create({ specialities }) {
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
                toast.success("Collaborator saved successfully!");
            },
            onError: (errors) => {
                toast.error("Failed to save collaborator. Please check the form.");
                console.error("Save errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: 'Collaborators list',
            href: '/collaborators',
        },
        {
            title: 'Add new collaborator',
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
            <Head title="Collaborators" />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">Add New Collaborator</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="name">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Name"
                            autoComplete="off"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label required htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email" // Use type="email"
                            name="email"
                            value={data.email} // Add email to useForm data
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="collaborator@example.com"
                            autoComplete="off"
                        />
                        <InputError message={errors.email} /> {/* Add InputError for email */}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="specialities">Specialities</Label>
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
                            Add
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
