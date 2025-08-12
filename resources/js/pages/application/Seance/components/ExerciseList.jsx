import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import SubmissionForm from './SubmissionForm';

export default function ExerciseList({ seance }) {
    const { translations } = useContext(TranslationContext);

    // Assuming current user ID is available globally or passed as a prop
    // For now, let's mock it or assume it's available via Inertia's props.auth.user.id
    const currentUserId = seance.current_user_id; // This needs to be passed from the controller

    return (
        <Card>
            <CardHeader>
                <CardTitle>{translations.seances?.show?.exercise_list?.title || 'Exercises'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {seance.exercises && seance.exercises.length > 0 ? (
                    <ul className="space-y-4">
                        {seance.exercises.map((exercise) => {
                            const hasSubmitted = exercise.submissions?.some(
                                (submission) => submission.user_id === currentUserId
                            );

                            return (
                                <li key={exercise.id} className="rounded-md border p-4">
                                    <h4 className="font-semibold">{exercise.title}</h4>
                                    <p className="text-sm text-muted-foreground">{exercise.description}</p>

                                    <div className="mt-4">
                                        {hasSubmitted ? (
                                            <div className="rounded-md bg-green-100 p-3 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                <p className="font-medium">{translations.seances?.show?.exercise_list?.submitted_message || 'You have submitted this exercise.'}</p>
                                                {/* Display submission details here if needed */}
                                                {exercise.submissions.map((submission) => (
                                                    submission.user_id === currentUserId && (
                                                        <div key={submission.id} className="mt-2 text-sm">
                                                            {submission.text_content && <p><strong>{translations.seances?.show?.exercise_list?.your_text_submission || 'Your Text Submission'}:</strong> {submission.text_content}</p>}
                                                            {submission.file_path && <p><strong>{translations.seances?.show?.exercise_list?.your_file_submission || 'Your File Submission'}:</strong> <a href={submission.file_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{translations.seances?.show?.exercise_list?.view_file || 'View File'}</a></p>}
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        ) : (
                                            <SubmissionForm exerciseId={exercise.id} />
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">{translations.seances?.show?.exercise_list?.no_exercises || 'No exercises available for this seance yet.'}</p>
                )}
            </CardContent>
        </Card>
    );
}
