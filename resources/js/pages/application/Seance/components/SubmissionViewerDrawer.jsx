import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
// No need for ScrollArea here anymore, we'll use native scrolling.

export default function SubmissionViewerDrawer({ submission, exercise_title, trigger }) {
    const renderContent = () => {
        switch (submission.submission_type) {
            case 'text':
            case 'code':
                // The <pre> tag naturally handles long text with a scrollbar inside a flex container
                return (
                    <pre className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-md">
                        <code>{submission.content}</code>
                    </pre>
                );
            case 'file':
                const imageUrl = `/storage/${submission.content}`;
                // The image will be constrained by the flex container
                return <img src={imageUrl} alt="Submission" className="max-w-full rounded-md object-contain" />;
            case 'url':
                return (
                    <a href={submission.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                        {submission.content}
                    </a>
                );
            default:
                return <p>Unsupported submission type.</p>;
        }
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-4xl flex flex-col h-[85vh]"> 
                    
                    <DrawerHeader className="flex-shrink-0">
                        <DrawerTitle>Submission from: {submission.user.name}</DrawerTitle>
                        <DrawerDescription>
                            Exercise: {exercise_title}
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 flex-grow overflow-y-auto">
                        {renderContent()}
                    </div>
                    
                    <DrawerFooter className="flex-shrink-0 border-t">
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
