import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Transition } from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function Create({ collaborators, cours }) {
    const { data, setData, post, processing, reset, errors, recentlySuccessful } = useForm({
        collaborator_id: '',
        cour_id: '',
    });

    const submitForm = (e) => {
        e.preventDefault();
        post(route('camps.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                router.reload({ only: ['camps'] });
            },
        });
    };

    const breadcrumbs = [
        {
            title: 'Camps list',
            href: '/camps',
        },
        {
            title: 'Add new camp',
            href: '/camps/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Camps" />

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

                <h1 className="mb-6 text-2xl font-bold">Add New Camp</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    {/* Collaborator Select */}
                    <div className="grid gap-2">
                        <label htmlFor="collaborator_id" className="font-medium">
                            Collaborator
                        </label>
                        <select
                            id="collaborator_id"
                            name="collaborator_id"
                            value={data.collaborator_id}
                            onChange={(e) => setData('collaborator_id', e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            <option value="">Select collaborator</option>
                            {collaborators.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.collaborator_id} />
                    </div>

                    {/* Cour Select */}
                    <div className="grid gap-2">
                        <label htmlFor="cour_id" className="font-medium">
                            Course
                        </label>
                        <select
                            id="cour_id"
                            name="cour_id"
                            value={data.cour_id}
                            onChange={(e) => setData('cour_id', e.target.value)}
                            className="w-full rounded border p-2"
                        >
                            <option value="">Select course</option>
                            {cours.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.cour_id} />
                    </div>

                    {/* Submit Button */}
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
