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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import HandRaiseQueue from './components/HandRaiseQueue';
import { Hand } from 'lucide-react';

export default function Show({ seance, isMentor, current_user_id }) {
    const { translations } = useContext(TranslationContext);
    const [seanceData, setSeanceData] = useState(seance);
    const [showPresenceButton, setShowPresenceButton] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [attendees, setAttendees] = useState(seance.attendees);
    const [exercises, setExercises] = useState(seance.exercises);
    const [isHandRaised, setIsHandRaised] = useState(false); // New state for collaborator's hand
    const [handRaiseQueue, setHandRaiseQueue] = useState([]); // New state for mentor's queue

    // --- CONSOLIDATED AND CORRECTED USEEFFECT ---
    useEffect(() => {
        if (!window.Echo) return;

        // Setup listeners for the shared seance channel
        const seanceChannel = window.Echo.private(`seance.${seanceData.id}`); // Use seanceData.id

        // Declare userChannel and mentorUserChannel outside the if blocks
        let userChannel = null;
        let mentorUserChannel = null;

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

            // Listener for HandDismissedByMentor event (whispered to collaborator)
            userChannel = window.Echo.private(`App.Models.User.${current_user_id}`);
            userChannel.listen('.App\\Events\\HandDismissedByMentor', (event) => {
                console.log('Mentor dismissed my hand.');
                setIsHandRaised(false);
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

            // Listener for CollaboratorHandStateChanged event (for mentor's queue)
            seanceChannel.listen('.App\\Events\\CollaboratorHandStateChanged', (event) => {
                setHandRaiseQueue(currentQueue => {
                    // Remove the collaborator first to handle both raise/lower cases
                    const filteredQueue = currentQueue.filter(c => c.id !== event.collaborator.id);
                    
                    // If their hand is raised, add them to the end of the new queue
                    if (event.isRaised) {
                        return [...filteredQueue, event.collaborator];
                    }
                    
                    // Otherwise, just return the filtered queue (hand is lowered)
                    return filteredQueue;
                });
            });

            // Add a listener for our new AttendanceStateReset event.
            seanceChannel.listen('.App\\Events\\AttendanceStateReset', (event) => {
                console.log('Attendance state has been reset!', event);
                // Replace the entire attendees list with the fresh one from the server
                setAttendees(event.attendees);
            });
        }

        // Setup listener for the mentor's private channel (only if they are the mentor)
        if (isMentor) {
            mentorUserChannel = window.Echo.private(`App.Models.User.${current_user_id}`);
            mentorUserChannel.listen('.App\\Events\\ExerciseSubmitted', (event) => {
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
                if (!isMentor && userChannel) { // Collaborator's private channel
                    window.Echo.leave(`App.Models.User.${current_user_id}`);
                }
                if (isMentor && mentorUserChannel) { // Mentor's private channel
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

    // Create the handler function for collaborator's hand raise/lower
    const handleToggleHand = () => {
        const newHandState = !isHandRaised;
        setIsHandRaised(newHandState);
        axios.post(route('seances.hand.toggle', seance.id), { isRaised: newHandState });
    };

    const breadcrumbs = [];

    if (isMentor) {
        breadcrumbs.push({
            title: translations.seances?.list_title || 'Seances list',
            href: '/seances',
        });
    }

    breadcrumbs.push({
        title: seance.topic,
        href: route('seances.show', seance.id),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={seance.topic} />

            <div className="p-4 flex flex-col h-full"> {/* Make the main container a flex column */}
                
                {/* Pass all necessary data and handlers to the header */}
                <SeanceHeader 
                    seance={seanceData} 
                    isMentor={isMentor}
                    onStartCheck={handleStartCheck} 
                /> 

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
                    {isMentor ? (
                        <>
                            {/* Column 1: Attendance List and Hand Raise Queue */}
                            <div className="lg:col-span-1 space-y-6">
                                <AttendanceList attendees={attendees} handRaiseQueue={handRaiseQueue} />
                                <HandRaiseQueue queue={handRaiseQueue} seanceId={seanceData.id} />
                            </div>

                            {/* Column 2: Exercise Manager (takes up more space) */}
                            <div className="lg:col-span-2">
                                <ExerciseManager seance={seanceData} exercises={exercises} />
                            </div>
                        </>
                    ) : (
                        <div className="lg:col-span-3"> {/* Collaborator view takes full width */}
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

            {/* --- COLLABORATOR'S HAND RAISE BUTTON --- */}
            {!isMentor && (
                <div className="fixed bottom-4 right-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={handleToggleHand} size="icon" className={`rounded-full h-14 w-14 ${isHandRaised ? 'bg-blue-600 hover:bg-blue-700' : 'bg-secondary'}`}>
                                    <Hand className="h-7 w-7" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>{isHandRaised ? 'Lower Hand' : 'Raise Hand'}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}
        </AppLayout>
    );
}
