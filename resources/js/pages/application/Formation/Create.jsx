import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from "sonner";

export default function Create({ cours }) {
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        cour_ids: [],
    });

    const submitForm = (e) => {
        e.preventDefault();

        post(route('formations.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success("Formation saved successfully!");
            },
            onError: (errors) => {
                toast.error("Failed to save formation. Please check the form.");
                console.error("Save errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: 'Formations list',
            href: '/formations',
        },
        {
            title: 'Add new formation',
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
            <Head title="Formations" />

            <div className="p-4">
                <h1 className="mb-6 text-2xl font-bold">Add New Formation</h1>

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
                        <Label htmlFor="cours">Cours</Label>
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
                            Add
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
