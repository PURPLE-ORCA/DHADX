import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useContext, useEffect, useState } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import SeanceHeader from './components/SeanceHeader';
import AttendanceList from './components/AttendanceList';
import ExerciseManager from './components/ExerciseManager';
import ExerciseList from './components/ExerciseList';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function Show({ seance, isMentor, current_user_id }) {
    const { translations } = useContext(TranslationContext);

    // --- ALL STATE DEFINED AT THE TOP ---
    const [showPresenceButton, setShowPresenceButton] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [attendees, setAttendees] = useState(seance.attendees);
    const [exercises, setExercises] = useState(seance.exercises); 

    // --- CONSOLIDATED AND CORRECTED USEEFFECT ---
    useEffect(() => {
        if (!window.Echo) return;

        // Setup listeners for the shared seance channel
        const seanceChannel = window.Echo.private(`seance.${seance.id}`);

        if (!isMentor) {
            // Collaborator-specific listeners on the seance channel
            seanceChannel.listen('.App\\Events\\PresenceCheckStarted', (event) => {
                console.log('Presence check started!', event);
                if (!isCheckedIn) {
                    setShowPresenceButton(true);
                    setTimeout(() => setShowPresenceButton(false), 60000);
                }
            });
        }
        
        if (isMentor) {
            // Mentor-specific listeners on the seance channel
            seanceChannel.listen('.App\\Events\\CollaboratorCheckedIn', (event) => {
                console.log('A collaborator checked in!', event);
                setAttendees(currentAttendees =>
                    currentAttendees.map(attendee => 
                        attendee.id === event.collaborator.id
                            ? { ...attendee, pivot: { ...attendee.pivot, status: 'present' } }
                            : attendee
                    )
                );
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
                window.Echo.leave(`seance.${seance.id}`);
                
                // Only leave the user channel if we subscribed to it
                if (userChannel) {
                    window.Echo.leave(`App.Models.User.${current_user_id}`);
                }
            }
        };

    }, [seance.id, isMentor, current_user_id, isCheckedIn]);


    // --- All your handler functions (handleCheckIn, handleStartCheck) are correct and can stay as they are ---
    const handleCheckIn = () => {
        // Disable the button immediately to prevent multiple clicks
        setShowPresenceButton(false);
        setIsCheckedIn(true);

        axios.post(route('seances.presence.checkin', seance.id))
            .then(response => {
                console.log("Successfully checked in!");
                // You could show a success message
            })
            .catch(error => {
                console.error("Check-in failed:", error);
                // Optionally re-enable the button or show an error
                setIsCheckedIn(false); // Allow them to try again if it failed
            });
    };

    // Create the handler function for mentor
    const handleStartCheck = () => {
        // Optional: Add a loading state to disable the button while the request is in flight
        axios.post(route('seances.presence.start', seance.id))
            .then(response => {
                // Give the mentor feedback that it worked
                console.log("Presence check initiated!");
                // You could use a toast notification here later on
            })
            .catch(error => {
                console.error("Failed to start presence check:", error);
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

    // In your return JSX, make sure to pass the state, not the prop
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={seance.topic} />

            <div className="p-4">
                <SeanceHeader seance={seance} />

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isMentor ? (
                        <>
                            <AttendanceList attendees={attendees} />
                            <ExerciseManager seance={seance} exercises={exercises} /> {/* <-- PASS STATE */}
                            <Button onClick={handleStartCheck} className="mb-4">Start Presence Check</Button>
                        </>
                    ) : (
                        <div className="md:col-span-2">
                            <ExerciseList seance={seance} />
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
