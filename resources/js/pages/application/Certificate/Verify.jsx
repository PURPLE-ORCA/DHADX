import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TranslationContext } from '@/context/TranslationProvider';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { useContext } from 'react';

export default function Verify({ certificate, error }) {
    const { translations } = useContext(TranslationContext);
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('certificates.verify.submit'));
    };

    return (
        <>
            <Head title={translations.certificates?.verify_page_title || 'Verify Certificate'} />

            <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
                <div className="bg-background w-full max-w-md rounded-lg p-8 shadow-md">
                    <h2 className="mb-6 text-center text-2xl font-bold">{translations.certificates?.verify_title || 'Verify Certificate'}</h2>

                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <Label htmlFor="code" className="block text-sm font-medium text-white">
                                {translations.certificates?.certificate_code || 'Certificate Code'}
                            </Label>
                            <Input
                                id="code"
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className="mt-1 block w-full"
                                required
                                autoFocus
                            />
                            <InputError message={errors.code} className="mt-2" />
                        </div>

                        <Button className="w-full" disabled={processing}>
                            {translations.certificates?.verify_button || 'Verify'}
                        </Button>
                    </form>

                    {certificate && (
                        <div className="bg-background mt-6 rounded-md p-4 text-green-700">
                            <h3 className="mb-2 text-lg font-semibold">
                                {translations.certificates?.verification_success || 'Certificate Verified!'}
                            </h3>
                            <p>
                                <strong>{translations.certificates?.student_name || 'Student Name'}:</strong> {certificate.user?.name}
                            </p>
                            <p>
                                <strong>{translations.certificates?.certificate_code || 'Certificate Code'}:</strong> {certificate.code}
                            </p>
                            <p>
                                <strong>{translations.certificates?.issue_date || 'Issue Date'}:</strong>{' '}
                                {new Date(certificate.created_at).toLocaleDateString()}
                            </p>
                            {certificate.image && (
                                <div className="mt-4">
                                    <img src={certificate.image} alt="Certificate Image" className="h-auto max-w-full" />
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 rounded-md bg-red-50 p-4 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
