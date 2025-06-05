import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Input as ShadcnInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Delete from './Delete';

const getProgressColorClass = (progress) => {
    if (progress === 0) return 'bg-neutral-600';
    if (progress < 26) return 'bg-red-600';
    if (progress < 51) return 'bg-orange-500';
    if (progress < 76) return 'bg-sky-500';
    if (progress < 100) return 'bg-teal-500';
    if (progress === 100) return 'bg-green-600';
    return 'bg-neutral-500';
};

export default function CampCard({ camp, courseColor, onCampUpdated, onCampDeleted }) {
    const [currentProgress, setCurrentProgress] = useState(camp.progress);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleSaveProgress = () => {
        router.patch(route('camps.update', camp.id), {
            progress: currentProgress
        }, {
            onSuccess: () => {
                setIsPopoverOpen(false);
                if (onCampUpdated) onCampUpdated();
            },
            onError: (errors) => {
                console.error("Failed to update progress:", errors);
            }
        });
    };

    useEffect(() => {
        setCurrentProgress(camp.progress);
    }, [camp.progress]);


    return (
        <Card className="relative gap-0 border-l-2 p-4" style={{ borderLeftColor: courseColor }}>
            <div className="flex items-center gap-2">
                <span className="font-bold">{camp.formation.name}</span>
            </div>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <div className="cursor-pointer" onClick={() => {
                        setCurrentProgress(camp.progress);
                    }}>
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
                            value={[currentProgress]}
                            max={100}
                            step={1}
                            onValueChange={(value) => setCurrentProgress(value[0])}
                            className="my-2"
                        />
                        <ShadcnInput
                            type="number"
                            min="0"
                            max="100"
                            value={currentProgress}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val)) {
                                    setCurrentProgress(Math.max(0, Math.min(100, val)));
                                } else if (e.target.value === '') {
                                    setCurrentProgress(0);
                                }
                            }}
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
                <Delete camp={camp} onDeleted={() => onCampDeleted(camp.id)} />
            </div>
        </Card>
    );
}
