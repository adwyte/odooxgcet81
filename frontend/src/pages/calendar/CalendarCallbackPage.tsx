import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { calendarApi } from '../../api/calendar';
import { Loader2, Check, AlertCircle } from 'lucide-react';

export default function CalendarCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState('Connecting to Google Calendar...');

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            setStatus('error');
            setMessage('Authorization failed or cancelled.');
            return;
        }

        if (code) {
            calendarApi.callback(code)
                .then(() => {
                    setStatus('success');
                    setMessage('Successfully connected Google Calendar!');
                    setTimeout(() => navigate('/profile'), 2000);
                })
                .catch((err) => {
                    console.error(err);
                    setStatus('error');
                    setMessage(err.message || 'Failed to connect calendar');
                });
        } else {
            setStatus('error');
            setMessage('No authorization code found.');
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            {status === 'processing' && (
                <>
                    <Loader2 className="w-12 h-12 animate-spin text-primary-600 mb-4" />
                    <h2 className="text-xl font-semibold text-primary-900">{message}</h2>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-green-900">{message}</h2>
                    <p className="text-gray-500 mt-2">Redirecting to profile...</p>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-red-900">Connection Failed</h2>
                    <p className="text-red-600 mt-2">{message}</p>
                    <button
                        onClick={() => navigate('/profile')}
                        className="btn btn-primary mt-6"
                    >
                        Back to Profile
                    </button>
                </>
            )}
        </div>
    );
}
