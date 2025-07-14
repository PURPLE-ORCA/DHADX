import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import CreateExerciseForm from './CreateExerciseForm';

export default function ExerciseManager({ seance, exercises }) {
    const { translations } = useContext(TranslationContext);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{translations.seances?.show?.exercise_manager?.title || 'Exercise Manager'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{translations.seances?.show?.exercise_manager?.existing_exercises || 'Existing Exercises'}</h3>
                    {exercises && exercises.length > 0 ? (
                        <ul className="space-y-4">
                            {exercises.map((exercise) => (
                                <li key={exercise.id} className="rounded-md border p-4">
                                    <h4 className="font-semibold">{exercise.title}</h4>
                                    <p className="text-sm text-muted-foreground">{exercise.description}</p>
                                    <div className="mt-2 space-y-2">
                                        <h5 className="text-md font-medium">{translations.seances?.show?.exercise_manager?.submissions || 'Submissions'}:</h5>
                                        {exercise.submissions && exercise.submissions.length > 0 ? (
                                            <ul className="space-y-1 pl-4 text-sm">
                                                {exercise.submissions.map((submission) => (
                                                    <li key={submission.id} className="flex items-center justify-between">
                                                        <span>{submission.collaborator?.name}</span>
                                                        {submission.file_path && (
                                                            <Link href={submission.file_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                                {translations.seances?.show?.exercise_manager?.view_submission || 'View Submission'}
                                                            </Link>
                                                        )}
                                                        {submission.text_content && (
                                                            <span className="text-muted-foreground">({translations.seances?.show?.exercise_manager?.text_submission || 'Text Submission'})</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">{translations.seances?.show?.exercise_manager?.no_submissions || 'No submissions yet.'}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">{translations.seances?.show?.exercise_manager?.no_exercises || 'No exercises created yet.'}</p>
                    )}
                </div>

                <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-4">{translations.seances?.show?.exercise_manager?.create_new_exercise || 'Create New Exercise'}</h3>
                    <CreateExerciseForm seanceId={seance.id} />
                </div>
            </CardContent>
        </Card>
    );
}
