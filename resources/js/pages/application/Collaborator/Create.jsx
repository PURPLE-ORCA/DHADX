import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Transition } from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function Create({ specialities }) {
    const { data, setData, post, processing, reset, errors, clearErrors, recentlySuccessful } = useForm({
        name: '',
        speciality_ids: [],
    });

    const submitForm = (e) => {
        e.preventDefault();

        post(route('collaborators.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                router.reload({ only: ['collaborators'] });
            },
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collaborators" />

            <div className="p-4">
                <Transition
                    show={recentlySuccessful}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="mb-4 rounded bg-green-500 p-2 text-center">
                        <p className="text-sm font-semibold text-white">Saved successfully!</p>
                    </div>
                </Transition>

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
                        <Label htmlFor="specialities">Specialities</Label>
                        <select
                            multiple
                            id="specialities"
                            name="speciality_ids"
                            value={data.speciality_ids}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                                setData('speciality_ids', selected);
                            }}
                            className="w-full rounded border px-2 py-1"
                        >
                            {specialities.map((spec) => (
                                <option key={spec.id} value={spec.id}>
                                    {spec.name}
                                </option>
                            ))}
                        </select>
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
