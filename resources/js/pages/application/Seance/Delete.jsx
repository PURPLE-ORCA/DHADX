import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { useContext, useState } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function Delete({ seance, onDeleted }) {
    const { translations } = useContext(TranslationContext);
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing, reset, clearErrors, recentlySuccessful } = useForm({});

    const deleteSeance = (e) => {
        e.preventDefault();

        destroy(route('seances.destroy', seance.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                if (onDeleted) onDeleted(seance.id); // notify parent
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
                    <p className="text-sm font-semibold text-white">{translations.seances?.delete?.deleted_successfully || 'Seance deleted successfully.'}</p>
                </div>
            </Transition>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="link" className="!p-0">
                        <Trash />
                        {translations.seances?.delete?.delete_button || 'Delete'}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>{translations.seances?.delete?.dialog_title?.replace(':seance_topic', seance.topic) || `Delete seance "${seance.topic}"?`}</DialogTitle>
                    <DialogDescription>{translations.seances?.delete?.dialog_description || 'This action cannot be undone. This will permanently delete the seance.'}</DialogDescription>
                    <form onSubmit={deleteSeance}>
                        <DialogFooter className="mt-4 gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" onClick={closeModal}>
                                    {translations.seances?.delete?.cancel_button || 'Cancel'}
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant="destructive" disabled={processing}>
                                {translations.seances?.delete?.delete_button_confirm || 'Delete'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
