import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from "sonner";

export default function Edit({ collaborator, specialities }) {
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
                toast.success("Collaborator updated successfully!");
            },
            onError: (errors) => {
                toast.error("Failed to update collaborator. Please check the form.");
                console.error("Update errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: 'Collaborators list',
            href: '/collaborators',
        },
        {
            title: 'Edit collaborator',
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
            <Head title="Collaborators" />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">Edit Collaborator</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="grid gap-2">
                        <Label required htmlFor="name">
                            Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Name"
                            autoComplete="off"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">
                            Email
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
                        <Label htmlFor="speciality_ids">Specialities</Label>
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
                            Cancel
                        </Button>
                        <Button disabled={processing} type="submit">
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Update
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
