import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";

export default function Delete({ collaborator, onDeleted }) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing, reset, clearErrors } = useForm({});

    const deleteCollaborator = (e) => {
        e.preventDefault();

        destroy(route('collaborators.destroy', collaborator.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                toast.success(`${collaborator.name} has been deleted.`);
                if (onDeleted) {
                    onDeleted(collaborator.id);
                }
            },
            onError: () => {
                toast.error(`Failed to delete ${collaborator.name}.`);
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
                        Delete
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Are you sure you want to delete {collaborator.name}?</DialogTitle>
                    <DialogDescription>This action cannot be undone. All data will be lost.</DialogDescription>
                    <form onSubmit={deleteCollaborator}>
                        <DialogFooter className="mt-4 gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" onClick={closeModal}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant="destructive" disabled={processing}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
