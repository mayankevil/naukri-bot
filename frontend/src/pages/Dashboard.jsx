import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
    ArrowDownTrayIcon, 
    EnvelopeIcon, 
    PlayCircleIcon, 
    BriefcaseIcon,
    ClockIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
    // State for storing the list of applied jobs
    const [appliedJobs, setAppliedJobs] = useState([]);
    // State to handle loading indicators
    const [loading, setLoading] = useState(true);
    // State for the bot's current status
    const [botStatus, setBotStatus] = useState('Idle');

    // Function to fetch the list of applied jobs from the backend
    const fetchAppliedJobs = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/bot/applied-jobs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Session expired. Please log in again.');
                    // You could add a redirect to the login page here
                } else {
                   throw new Error('Failed to fetch your applied jobs.');
                }
                return; // Stop execution if response is not ok
            }

            const data = await response.json();
            setAppliedJobs(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // useEffect hook to run fetchAppliedJobs when the component mounts
    useEffect(() => {
        fetchAppliedJobs();
    }, [fetchAppliedJobs]);

    // Generic function to handle API calls for various actions (run bot, download, etc.)
    const handleAction = async (endpoint, successMessage, errorMessage, isDownload = false) => {
        const toastId = toast.loading('Processing your request...');
        try {
            const token = localStorage.getItem('token');
            
            // Handle file downloads separately
            if (isDownload) {
                // For downloads, we construct a URL and set the window location
                // This is simpler than handling blob responses via fetch for this use case
                window.location.href = `${endpoint}?token=${token}`;
                toast.success(successMessage, { id: toastId });
                return;
            }

            // For standard POST requests
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || errorMessage);
            }
            
            toast.success(data.message || successMessage, { id: toastId });

            // Special handling for the 'run bot' action
            if (endpoint.includes('/run')) {
                setBotStatus('Running...');
                // In a real-world app, you might use WebSockets or polling to get real-time status updates
            }

        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
    };
    
    return (
        <div className="bg-neutral-100 min-h-screen p-4 sm:p-8 font-sans">
            <div className="container mx-auto">
                {/* Header Section */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">Dashboard</h1>
                    <p className="text-secondary mt-1">Welcome back! Here's your job application summary.</p>
                </header>

                {/* Statistic Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <BriefcaseIcon className="h-10 w-10 text-primary mr-4" />
                        <div>
                            <p className="text-sm text-secondary">Total Jobs Applied</p>
                            <p className="text-3xl font-bold">{loading ? '...' : appliedJobs.length}</p>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <ClockIcon className="h-10 w-10 text-green-500 mr-4" />
                        <div>
                            <p className="text-sm text-secondary">Bot Status</p>
                            <p className="text-3xl font-bold">{botStatus}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                    {/* Action Panel */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-neutral-800 mb-4 md:mb-0">Your Applied Jobs</h2>
                        <div className="flex items-center flex-wrap gap-2">
                             <button 
                                onClick={() => handleAction('/api/bot/run', 'Bot started successfully!', 'Failed to start bot.')} 
                                className="btn-primary flex items-center gap-2"
                             >
                                <PlayCircleIcon className="h-5 w-5"/> Run Bot
                            </button>
                            <button 
                                onClick={() => handleAction('/api/bot/download-excel', 'Downloading Excel...', 'Download failed.', true)} 
                                className="btn-secondary flex items-center gap-2"
                            >
                                <ArrowDownTrayIcon className="h-5 w-5"/> Excel
                            </button>
                             <button 
                                onClick={() => handleAction('/api/bot/download-pdf', 'Downloading PDF...', 'Download failed.', true)} 
                                className="btn-secondary flex items-center gap-2"
                             >
                                <ArrowDownTrayIcon className="h-5 w-5"/> PDF
                            </button>
                             <button 
                                onClick={() => handleAction('/api/bot/send-email', 'Email report sent!', 'Failed to send email.')} 
                                className="btn-secondary flex items-center gap-2"
                             >
                                <EnvelopeIcon className="h-5 w-5"/> Email Report
                            </button>
                        </div>
                    </div>
                    
                    {/* Applied Jobs Table */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <p className="text-center text-secondary py-8">Loading your jobs...</p>
                        ) : appliedJobs.length > 0 ? (
                            <table className="min-w-full text-left">
                                <thead className="border-b-2 border-gray-200">
                                    <tr>
                                        <th scope="col" className="text-sm font-semibold text-neutral-800 px-6 py-4">Job Title</th>
                                        <th scope="col" className="text-sm font-semibold text-neutral-800 px-6 py-4">Company</th>
                                        <th scope="col" className="text-sm font-semibold text-neutral-800 px-6 py-4">Date Applied</th>
                                        <th scope="col" className="text-sm font-semibold text-neutral-800 px-6 py-4">Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appliedJobs.map((job, index) => (
                                        <tr key={index} className="border-b border-gray-200 hover:bg-neutral-100 transition-colors">
                                            <td className="px-6 py-4 font-medium text-neutral-800">{job.job_title}</td>
                                            <td className="px-6 py-4 text-secondary">{job.company_name}</td>
                                            <td className="px-6 py-4 text-secondary">{new Date(job.applied_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <a href={job.job_link} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                                                    View Job
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                             <div className="text-center py-16">
                                <BriefcaseIcon className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold text-neutral-800">No Jobs Applied Yet</h3>
                                <p className="text-secondary mt-2">Click the "Run Bot" button to start applying for jobs automatically.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
