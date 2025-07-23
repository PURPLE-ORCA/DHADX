import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function SubmissionForm({ exerciseId }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, post, processing, reset, errors } = useForm({
        text_content: '',
        file: null,
    });

    const submitSubmission = (e) => {
        e.preventDefault();
        post(route('exercises.submissions.store', exerciseId), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submitSubmission} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="text-submission">
                    {translations.seances?.show?.exercise_list?.text_submission_label || 'Text/Code Submission'}
                </Label>
                <Textarea
                    id="text-submission"
                    value={data.text_content}
                    onChange={(e) => setData('text_content', e.target.value)}
                    placeholder={translations.seances?.show?.exercise_list?.text_submission_placeholder || 'Enter your text or code here'}
                />
                <InputError message={errors.text_content} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="file-upload">
                    {translations.seances?.show?.exercise_list?.file_upload_label || 'File Upload'}
                </Label>
                <Input
                    id="file-upload"
                    type="file"
                    onChange={(e) => setData('file', e.target.files[0])}
                />
                <InputError message={errors.file} />
            </div>
            <div>
                <Button type="submit" disabled={processing}>
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    {translations.seances?.show?.exercise_list?.submit_exercise_button || 'Submit Exercise'}
                </Button>
            </div>
        </form>
    );
}
