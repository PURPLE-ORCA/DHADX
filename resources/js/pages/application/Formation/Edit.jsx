import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from "sonner";

export default function Edit({ formation, cours }) {
    const { data, setData, put, processing, reset, errors, clearErrors } = useForm({
        name: formation.name,
        icon_name: formation.icon_name || '', // Add icon_name to the form data
        cour_ids: formation.cours.map((s) => s.id),
    });

    useEffect(() => {
        setData({
            name: formation.name,
            icon_name: formation.icon_name || '', // Pre-populate icon_name
            cour_ids: formation.cours.map((s) => s.id),
        });
    }, [formation, setData]);

    const submitForm = (e) => {
        e.preventDefault();

        put(route('formations.update', formation.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Formation updated successfully!");
            },
            onError: (errors) => {
                toast.error("Failed to update formation. Please check the form.");
                console.error("Update errors:", errors);
            }
        });
    };

    const breadcrumbs = [
        {
            title: 'Formations list',
            href: '/formations',
        },
        {
            title: 'Edit formation',
            href: '/formations/edit',
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
                <h1 className="mb-6 text-2xl font-bold">Edit Formation</h1>

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
                        <Label htmlFor="icon_name">
                            Icon Name (from Iconify)
                        </Label>
                        <Input
                            id="icon_name"
                            name="icon_name"
                            value={data.icon_name}
                            onChange={(e) => setData('icon_name', e.target.value)}
                            placeholder="e.g., mdi:home, ph:book-fill"
                            autoComplete="off"
                        />
                        <InputError message={errors.icon_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="cour_ids">Cours</Label>
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

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                clearErrors();
                                reset();
                                router.visit(route('formations.index'));
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
