import { useContext, useState } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function DeleteTask({ task, onDeleted }) {
    const { translations } = useContext(TranslationContext);
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route('tasks.destroy', task.id), {
            onSuccess: () => {
                onDeleted(task.id);
                setOpen(false);
            },
            onError: (errors) => {
                console.error('Error deleting task:', errors);
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/80"
                >
                    <Trash2 className="w-4" /> {translations.tasks.delete.delete_button}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{translations.tasks.delete.dialog_title.replace(':task_title', task.title)}</DialogTitle>
                    <DialogDescription>
                        {translations.tasks.delete.dialog_description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        {translations.tasks.delete.cancel_button}
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        {translations.tasks.delete.delete_button_confirm}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
