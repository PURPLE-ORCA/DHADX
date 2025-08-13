import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog';
import { format } from 'date-fns';

export default function ViewCertificateModal({ certificate, onClose }) {
    if (!certificate) {
        return null;
    }

    return (
        <Dialog open={!!certificate} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Certificate Details</DialogTitle>
                    <DialogDescription>
                        View the details of the selected certificate.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center">
                        {certificate.image && (
                            <img
                                src={`/storage/${certificate.image}`}
                                alt="Certificate"
                                className="max-w-full h-auto rounded-md"
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        <p><strong>Student Name:</strong> {certificate.user.name}</p>
                        <p><strong>Course:</strong> {certificate.course?.title}</p> {/* Add Course Name */}
                        <p><strong>Certificate Code:</strong> {certificate.code}</p>
                        <p><strong>Creation Date:</strong> {format(new Date(certificate.created_at), 'PPP')}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}