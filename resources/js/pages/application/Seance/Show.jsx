import { Button } from '@/components/ui/button';
import { TranslationContext } from '@/context/TranslationProvider';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react'; // Import Link
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import AttendanceList from './components/AttendanceList';
import ExerciseList from './components/ExerciseList';
import ExerciseManager from './components/ExerciseManager';
import SeanceHeader from './components/SeanceHeader';

export default function Show({ seance, isMentor, current_user_id }) {
    const { translations } = useContext(TranslationContext);

    // --- ALL STATE DEFINED AT THE TOP ---

    const [seanceData, setSeanceData] = useState(seance);
    const [showPresenceButton, setShowPresenceButton] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [attendees, setAttendees] = useState(seance.attendees);
    const [exercises, setExercises] = useState(seance.exercises);

    // --- CONSOLIDATED AND CORRECTED USEEFFECT ---
    useEffect(() => {
        if (!window.Echo) return;

        // Setup listeners for the shared seance channel
        const seanceChannel = window.Echo.private(`seance.${seanceData.id}`); // Use seanceData.id

        // Listener for SeanceStatusUpdated event (for everyone)
        seanceChannel.listen('.App\\Events\\SeanceStatusUpdated', (event) => {
            console.log('Seance status updated!', event.seance.status);
            // Merge the new data with the old, preserving loaded relationships
            setSeanceData((prevSeanceData) => ({
                ...prevSeanceData, // Keep the old data (like .course and .mentor)
                ...event.seance, // Overwrite with new data (like .status)
            }));
        });

        if (!isMentor) {
            // Collaborator-specific listeners on the seance channel
            seanceChannel.listen('.App\\Events\\PresenceCheckStarted', (event) => {
                console.log('A new presence check has started!', event);
                
                // --- THE LOGIC CHANGE ---
                // Reset the local "checked in" status to allow for a new check-in.
                setIsCheckedIn(false); 
                
                // Now, show the button.
                setShowPresenceButton(true);
                setTimeout(() => setShowPresenceButton(false), 60000);
            });
        }

        if (isMentor) {
            // Mentor-specific listeners on the seance channel
            seanceChannel.listen('.App\\Events\\CollaboratorCheckedIn', (event) => {
                console.log('A collaborator checked in!', event);
                setAttendees((currentAttendees) =>
                    currentAttendees.map((attendee) =>
                        attendee.id === event.collaborator.id ? { ...attendee, pivot: { ...attendee.pivot, status: 'present' } } : attendee,
                    ),
                );
            });

            // Add a listener for our new AttendanceStateReset event.
            seanceChannel.listen('.App\\Events\\AttendanceStateReset', (event) => {
                console.log('Attendance state has been reset!', event);
                // Replace the entire attendees list with the fresh one from the server
                setAttendees(event.attendees);
            });
        }

        // Setup listener for the mentor's private channel (only if they are the mentor)
        let userChannel;
        if (isMentor) {
            userChannel = window.Echo.private(`App.Models.User.${current_user_id}`);
            userChannel.listen('.App\\Events\\ExerciseSubmitted', (event) => {
                console.log('New exercise submission received!', event);
                setExercises(currentExercises =>
                    currentExercises.map(exercise => {
                        if (exercise.id === event.submission.seance_exercise_id) {
                            const submissions = exercise.submissions || [];
                            return {
                                ...exercise,
                                submissions: [...submissions, event.submission]
                            };
                        }
                        return exercise;
                    })
                );
            });
        }

        // The master cleanup function
        return () => {
            if (window.Echo) {
                // Always leave the main seance channel
                window.Echo.leave(`seance.${seanceData.id}`); // Use seanceData.id

                // Only leave the user channel if we subscribed to it
                if (userChannel) {
                    window.Echo.leave(`App.Models.User.${current_user_id}`);
                }
            }
        };
    }, [seanceData.id, isMentor, current_user_id, isCheckedIn]); // Use seanceData.id in dependency array

    // --- All your handler functions (handleCheckIn, handleStartCheck) are correct and can stay as they are ---
    const handleCheckIn = () => {
        // Disable the button immediately to prevent multiple clicks
        setShowPresenceButton(false);
        setIsCheckedIn(true);

        axios
            .post(route('seances.presence.checkin', seance.id))
            .then((response) => {
                console.log('Successfully checked in!');
                // You could show a success message
            })
            .catch((error) => {
                console.error('Check-in failed:', error);
                // Optionally re-enable the button or show an error
                setIsCheckedIn(false); // Allow them to try again if it failed
            });
    };

    // Create the handler function for mentor
    const handleStartCheck = () => {
        // Optional: Add a loading state to disable the button while the request is in flight
        axios
            .post(route('seances.presence.start', seance.id))
            .then((response) => {
                // Give the mentor feedback that it worked
                console.log('Presence check initiated!');
                // You could use a toast notification here later on
            })
            .catch((error) => {
                console.error('Failed to start presence check:', error);
                // Show an error to the mentor
            });
    };

    const breadcrumbs = [
        {
            title: translations.seances?.list_title || 'Seances list',
            href: '/seances',
        },
        {
            title: seance.topic,
            href: route('seances.show', seance.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={seance.topic} />

            <div className="p-4">
                <SeanceHeader seance={seanceData} /> {/* Use seanceData */}
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {isMentor ? (
                        <>
                            {/* Mentor Control Buttons */}
                            <div className="seance-controls bg-card-dark rounded-lg p-4">
                                {seanceData.status === 'scheduled' && (
                                    <Link as="button" method="post" href={route('seances.start', seanceData.id)} className="w-full">
                                        Start Seance
                                    </Link>
                                )}

                                {seanceData.status === 'live' && (
                                    <Link as="button" method="post" href={route('seances.finish', seanceData.id)} className="w-full">
                                        End Seance
                                    </Link>
                                )}

                                {(seanceData.status === 'scheduled' || seanceData.status === 'live') && (
                                    <Link
                                        as="button"
                                        method="post"
                                        href={route('seances.cancel', seanceData.id)}
                                        className="mt-2 w-full text-red-500"
                                    >
                                        Cancel Seance
                                    </Link>
                                )}

                                {seanceData.status === 'finished' && <p>This seance has finished.</p>}
                                {seanceData.status === 'cancelled' && <p>This seance was cancelled.</p>}
                            </div>
                            <AttendanceList attendees={attendees} />
                            <ExerciseManager seance={seanceData} exercises={exercises} />
                            <Button onClick={handleStartCheck} className="mb-4" disabled={seanceData.status !== 'live'}>
                                Start Presence Check
                            </Button>{' '}
                            {/* Status-aware */}
                        </>
                    ) : (
                        <div className="md:col-span-2">
                            <ExerciseList seance={seanceData} />
                        </div>
                    )}
                </div>
            </div>

            {/* --- CONDITIONAL UI FOR THE CHECK-IN BUTTON --- */}
            {!isMentor && showPresenceButton && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-2xl font-bold text-white">Presence Check!</p>
                        <Button size="lg" onClick={handleCheckIn} className="animate-pulse">
                            I'm Here!
                        </Button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
