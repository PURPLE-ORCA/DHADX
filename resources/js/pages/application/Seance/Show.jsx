import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useContext, useEffect, useState } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';
import SeanceHeader from './components/SeanceHeader';
import AttendanceList from './components/AttendanceList';
import ExerciseManager from './components/ExerciseManager';
import ExerciseList from './components/ExerciseList';
import { Button } from '@/components/ui/button'; // Import Button component
import axios from 'axios'; // Import axios

export default function Show({ seance, isMentor }) {
    const { translations } = useContext(TranslationContext);

    // --- NEW STATE FOR COLLABORATOR VIEW ---
    const [showPresenceButton, setShowPresenceButton] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false); // To prevent double-clicking

    // --- LIFT ATTENDEES INTO STATE ---
    const [attendees, setAttendees] = useState(seance.attendees);

    // --- MENTOR'S REAL-TIME LISTENER ---
    useEffect(() => {
        // Only listen if the user is the mentor
        if (isMentor && window.Echo) {
            const channel = window.Echo.private(`seance.${seance.id}`);

            channel.listen('.App\\Events\\CollaboratorCheckedIn', (event) => {
                console.log('A collaborator checked in!', event);

                // Update the local state to reflect the change
                setAttendees(currentAttendees => 
                    currentAttendees.map(attendee => {
                        if (attendee.id === event.collaborator.id) {
                            // Update the pivot data for the specific attendee
                            return { ...attendee, pivot: { ...attendee.pivot, status: 'present' } };
                        }
                        return attendee;
                    })
                );
            });

            return () => {
                if (window.Echo) {
                    window.Echo.leave(`seance.${seance.id}`);
                }
            };
        }
    }, [seance.id, isMentor]); // This effect depends on seance.id and isMentor

    // --- REAL-TIME LISTENER ---
    useEffect(() => {
        if (!isMentor && window.Echo) {
            const channel = window.Echo.private(`seance.${seance.id}`);

            channel.listen('.App\\Events\\PresenceCheckStarted', (event) => {
                console.log('EVENT RECEIVED! The system works!', event);

                if (!isCheckedIn) {
                    setShowPresenceButton(true);
                    setTimeout(() => {
                        setShowPresenceButton(false);
                    }, 60000);
                }
            });

            return () => {
                if (window.Echo) {
                    window.Echo.leave(`seance.${seance.id}`);
                }
            };
        }
    }, [seance.id, isMentor, isCheckedIn]);
    
    // --- HANDLER FOR THE "I'M HERE!" BUTTON ---
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={seance.topic} />

            <div className="p-4">
                <SeanceHeader seance={seance} />

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isMentor ? (
                        <>
                            <Button onClick={handleStartCheck} className="mb-4">Start Presence Check</Button> {/* Mentor's button */}
                            <AttendanceList attendees={attendees} /> {/* <-- Use the state variable */}
                            <ExerciseManager seance={seance} />
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
