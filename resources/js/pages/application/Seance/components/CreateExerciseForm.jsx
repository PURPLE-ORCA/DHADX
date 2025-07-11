import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function CreateExerciseForm({ seanceId }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
    });

    const submitExercise = (e) => {
        e.preventDefault();
        post(route('seances.exercises.store', seanceId), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submitExercise} className="space-y-4">
            <div className="grid gap-2">
                <Label required htmlFor="exercise-title">
                    {translations.seances?.show?.exercise_manager?.title_label || 'Title'}
                </Label>
                <Input
                    id="exercise-title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder={translations.seances?.show?.exercise_manager?.title_placeholder || 'Enter exercise title'}
                />
                <InputError message={errors.title} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="exercise-description">
                    {translations.seances?.show?.exercise_manager?.description_label || 'Description'}
                </Label>
                <Textarea
                    id="exercise-description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder={translations.seances?.show?.exercise_manager?.description_placeholder || 'Enter exercise description'}
                />
                <InputError message={errors.description} />
            </div>
            <div>
                <Button type="submit" disabled={processing}>
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    {translations.seances?.show?.exercise_manager?.create_exercise_button || 'Create Exercise'}
                </Button>
            </div>
        </form>
    );
}
