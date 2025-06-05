import { Card } from '@/components/ui/card';
import Delete from './Delete';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { router } from '@inertiajs/react';

// Helper: Group by collaborator and course
function groupCamps(camps) {
    const groups = {};

    camps.forEach((camp) => {
        const collabName = camp.collaborator.name;
        const courName = camp.cour.name;

        if (!groups[collabName]) {
            groups[collabName] = {};
        }

        if (!groups[collabName][courName]) {
            groups[collabName][courName] = {
                label: camp.cour.label,
                color: camp.cour.color,
                items: [],
            };
        }

        groups[collabName][courName].items.push(camp);
    });

    return groups;
}

const getProgressColorClass = (progress) => {
    if (progress === 0) return 'bg-neutral-600';
    if (progress < 26) return 'bg-red-600';
    if (progress < 51) return 'bg-orange-500';
    if (progress < 76) return 'bg-sky-500';
    if (progress < 100) return 'bg-teal-500';
    if (progress === 100) return 'bg-green-600';
    return 'bg-neutral-500';
};

function Data({ camps, onDeleted }) {
    const grouped = groupCamps(camps);

    return (
        <div className="space-y-8">
            {Object.entries(grouped).map(([collaboratorName, courses]) => (
                <div key={collaboratorName}>
                    <h2 className="mb-2 text-xl font-bold">{collaboratorName}</h2>

                    {Object.entries(courses).map(([courseName, courseData]) => (
                        <div key={courseName} className="mb-4 last:mb-0">
                            <h3 className="text-md mb-1 font-semibold text-neutral-700 dark:text-neutral-200">{courseName}</h3>
                            <small className="mb-2 block text-neutral-500 dark:text-neutral-400">{courseData.label}</small>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {courseData.items.map((camp) => {
                                    const [currentProgress, setCurrentProgress] = useState(camp.progress);
                                    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

                                    const handleSaveProgress = () => {
                                        router.patch(route('camps.update', camp.id), {
                                            progress: currentProgress
                                        }, {
                                            onSuccess: () => {
                                                setIsPopoverOpen(false);
                                                if (onDeleted) onDeleted();
                                            },
                                            onError: (errors) => {
                                                console.error("Failed to update progress:", errors);
                                            }
                                        });
                                    };

                                    return (
                                        <Card key={camp.id} className="relative gap-0 border-l-2 p-4" style={{ borderLeftColor: courseData.color }}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{camp.formation.name}</span>
                                            </div>

                                            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                                <PopoverTrigger asChild>
                                                    <div className="cursor-pointer" onClick={() => setCurrentProgress(camp.progress)}>
                                                        <div className="mt-4 h-fit overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                            <div
                                                                className={`h-full rounded-full ${getProgressColorClass(camp.progress)} text-center text-xs font-bold text-white transition-all duration-500`}
                                                                style={{ width: `${camp.progress}%` }}
                                                            >
                                                                <small>{camp.progress}%</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-56 p-4">
                                                    <div className="space-y-4">
                                                        <label htmlFor={`progress-slider-${camp.id}`} className="text-sm font-medium">
                                                            Set Progress: {currentProgress}%
                                                        </label>
                                                        <Slider
                                                            id={`progress-slider-${camp.id}`}
                                                            defaultValue={[camp.progress]}
                                                            value={[currentProgress]}
                                                            max={100}
                                                            step={1}
                                                            onValueChange={(value) => setCurrentProgress(value[0])}
                                                            className="my-2"
                                                        />
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={currentProgress}
                                                            onChange={(e) => setCurrentProgress(parseInt(e.target.value, 10))}
                                                            className="my-2"
                                                        />
                                                        <div className="flex justify-end space-x-2">
                                                            <Button variant="outline" size="sm" onClick={() => setIsPopoverOpen(false)}>Cancel</Button>
                                                            <Button size="sm" onClick={handleSaveProgress}>Save</Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>

                                            <div className="mt-4 flex justify-end">
                                                <Delete camp={camp} onDeleted={onDeleted} />
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Data;
