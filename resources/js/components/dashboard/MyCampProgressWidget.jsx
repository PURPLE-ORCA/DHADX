import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { BookMarked } from "lucide-react"; // Or any relevant icon
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationProvider';

export default function MyCampProgressWidget({ camps }) {
    const { translations } = useContext(TranslationContext);

    if (!camps || camps.length === 0) {
        return (
            <Card className="md:col-span-2 lg:col-span-1 bg-[var(--card-back)]"> 
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookMarked className="h-5 w-5" />
                        {translations.my_camp_progress_widget.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {translations.my_camp_progress_widget.no_camps_assigned}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="md:col-span-2 lg:col-span-1 bg-[var(--card-back)]"> 
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookMarked className="h-5 w-5" />
                    {translations.my_camp_progress_widget.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px] w-full pr-4"> 
                    <div className="space-y-4">
                        {camps.map((camp) => (
                            <div key={camp.id} className="space-y-1.5">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm font-medium truncate" title={`${camp.cour?.name} - ${camp.formation?.name}`}>
                                        {camp.formation?.name || translations.my_camp_progress_widget.unnamed_formation}
                                    </span>
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {camp.progress}%
                                    </span>
                                </div>
                                {camp.cour?.name && (
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate -mt-1">
                                        {camp.cour.label}
                                    </p>
                                )}
                                <Progress value={camp.progress} className="h-2" />
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
