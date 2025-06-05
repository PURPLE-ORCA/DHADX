import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Transition } from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from "sonner";

export default function Create() {
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
                toast.success("Speciality created successfully!");
            },
            onError: (errors) => {
                toast.error("Failed to create speciality. Please check the form.");
                console.error("Save errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: 'Specialities list',
            href: '/specialities',
        },
        {
            title: 'Add new speciality',
            href: '/specialities/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Specialities" />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">Add New Speciality</h1>

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
