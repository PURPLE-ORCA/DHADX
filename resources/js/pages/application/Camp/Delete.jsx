import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from "sonner";
import { TranslationContext } from '@/context/TranslationProvider';

function Delete({ camp, onDeleted }) {
    const { translations } = useContext(TranslationContext);
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing, reset, clearErrors } = useForm({});

    const deleteCamp = (e) => {
        e.preventDefault();

        destroy(route('camps.destroy', camp.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                toast.success(translations.camp_delete.delete_success_toast.replace(':formation_name', camp.formation?.name || translations.camp_delete.selected_formation));
                if (onDeleted) {
                    onDeleted(camp.id);
                }
            },
            onError: () => {
                toast.error(translations.camp_delete.delete_error_toast);
            }
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
        setOpen(false);
    };

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="link" className="!p-0">
                        <Trash />
                        {translations.camp_delete.delete_button}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>{translations.camp_delete.dialog_title.replace(':camp_name', camp.name)}</DialogTitle>
                    <DialogDescription>{translations.camp_delete.dialog_description}</DialogDescription>
                    <form onSubmit={deleteCamp}>
                        <DialogFooter className="mt-4 gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" onClick={closeModal}>
                                    {translations.camp_delete.cancel_button}
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant="destructive" disabled={processing}>
                                {translations.camp_delete.delete_button_confirm}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Delete;
