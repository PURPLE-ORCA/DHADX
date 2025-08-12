import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { useContext, useState } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function Delete({ user, onDeleted }) {
    const { translations } = useContext(TranslationContext);
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing, reset, clearErrors, recentlySuccessful } = useForm({});

    const deleteCollaborator = (e) => {
        e.preventDefault();

        destroy(route('users.destroy', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                if (onDeleted) onDeleted(user.id);
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
                    <p className="text-sm font-semibold text-white">{translations.user_delete.deleted_successfully}</p>
                </div>
            </Transition>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="link" className="!p-0">
                        <Trash />
                        {translations.collaborator_delete.delete_button}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>{translations.user_delete.dialog_title.replace(':user_name', user.name)}</DialogTitle>
                    <DialogDescription>{translations.user_delete.dialog_description}</DialogDescription>
                    <form onSubmit={deleteCollaborator}>
                        <DialogFooter className="mt-4 gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" onClick={closeModal}>
                                    {translations.user_delete.cancel_button}
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant="destructive" disabled={processing}>
                                {translations.user_delete.delete_button_confirm}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
