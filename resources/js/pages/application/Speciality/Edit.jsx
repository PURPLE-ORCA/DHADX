import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Transition } from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Edit({ speciality }) {
    const { data, setData, put, processing, reset, errors, clearErrors, recentlySuccessful } = useForm({
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
                router.reload({ only: ['specialities'] });
            },
        });
    };

    const breadcrumbs = [
        {
            title: 'Specialities list',
            href: '/specialities',
        },
        {
            title: 'Edit speciality',
            href: '/specialities/edit',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Specialities" />
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
                        <p className="text-sm font-semibold text-white">Updated successfully!</p>
                    </div>
                </Transition>

                <h1 className="mb-6 text-2xl font-bold">Edit Speciality</h1>

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

                    <div className="flex justify-end gap-2">
                        <Button disabled={processing} type="submit">
                            {processing && <span className="mr-2 animate-spin">⏳</span>}
                            Update
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
