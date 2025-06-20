import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { useContext, useState } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function Delete({ formation, onDeleted }) {
    const { translations } = useContext(TranslationContext);
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing, reset, clearErrors, recentlySuccessful } = useForm({});

    const deleteFormation = (e) => {
        e.preventDefault();

        destroy(route('formations.destroy', formation.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                onDeleted?.(formation.id); // notify parent
            },
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
        setOpen(false);
    };

    return (
        <div>
            <Transition
                show={recentlySuccessful}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed top-12 right-3 rounded bg-green-500 p-2 whitespace-nowrap">
                    <p className="text-sm font-semibold text-white">{translations.formations.delete.deleted_successfully}</p>
                </div>
            </Transition>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="link" className="!p-0">
                        <Trash />
                        {translations.formations.delete.delete_button}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>{translations.formations.delete.dialog_title.replace(':formation_name', formation.name)}</DialogTitle>
                    <DialogDescription>{translations.formations.delete.dialog_description}</DialogDescription>
                    <form onSubmit={deleteFormation}>
                        <DialogFooter className="mt-4 gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" onClick={closeModal}>
                                    {translations.formations.delete.cancel_button}
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant="destructive" disabled={processing}>
                                {translations.formations.delete.delete_button_confirm}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
