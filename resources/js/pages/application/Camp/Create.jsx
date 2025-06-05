import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from "sonner";

export default function Create({ collaborators, cours }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        collaborator_id: '',
        cour_id: '',
    });

    const submitForm = (e) => {
        e.preventDefault();
        post(route('camps.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success("Camp created successfully!");
            },
            onError: (errors) => {
                toast.error("Failed to create camp. Please check selections.");
                console.error("Save errors:", errors);
            }
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
                <h1 className="mb-6 text-2xl font-bold">Add New Camp</h1>

                <form className="space-y-6" onSubmit={submitForm}>
                    {/* Collaborator Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="collaborator_id">
                            Collaborator
                        </Label>
                        <Select
                            value={data.collaborator_id}
                            onValueChange={(value) => setData('collaborator_id', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select collaborator" />
                            </SelectTrigger>
                            <SelectContent>
                                {collaborators.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.collaborator_id} />
                    </div>

                    {/* Cour Select */}
                    <div className="grid gap-2">
                        <Label htmlFor="cour_id">
                            Course
                        </Label>
                        <Select
                            value={data.cour_id}
                            onValueChange={(value) => setData('cour_id', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent>
                                {cours.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
