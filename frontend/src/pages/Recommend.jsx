import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { LightBulbIcon, BuildingOffice2Icon, LinkIcon, TagIcon } from '@heroicons/react/24/outline';

const Recommend = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch job recommendations from the backend
    const fetchRecommendations = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/bot/recommend', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Session expired. Please log in again.');
                } else {
                    throw new Error('Failed to fetch recommendations.');
                }
                return;
            }

            const data = await response.json();
            setRecommendations(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // useEffect hook to run fetchRecommendations when the component mounts
    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    // Component for rendering a single recommendation card
    const RecommendationCard = ({ job }) => (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-neutral-800">{job.job_title}</h3>
                <div className="flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    <TagIcon className="h-4 w-4 mr-1.5" />
                    Matched: {job.matched_keyword}
                </div>
            </div>
            <div className="flex items-center text-secondary mt-2">
                <BuildingOffice2Icon className="h-5 w-5 mr-2" />
                <span>{job.company_name}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
                <a 
                    href={job.job_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary w-full text-center flex items-center justify-center gap-2"
                >
                    <LinkIcon className="h-5 w-5" />
                    View & Apply
                </a>
            </div>
        </div>
    );

    return (
        <div className="bg-neutral-100 min-h-screen p-4 sm:p-8 font-sans">
            <div className="container mx-auto">
                {/* Header Section */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">Job Recommendations</h1>
                    <p className="text-secondary mt-1">Here are jobs we found that match your profile keywords.</p>
                </header>

                {/* Main Content Area */}
                <div>
                    {loading ? (
                        <p className="text-center text-secondary py-16">Finding the best jobs for you...</p>
                    ) : recommendations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendations.map((job, index) => (
                                <RecommendationCard key={index} job={job} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-md">
                            <LightBulbIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-neutral-800">No Recommendations Yet</h3>
                            <p className="text-secondary mt-2 max-w-md mx-auto">
                                We couldn't find any new job recommendations right now. Make sure your keywords are up to date in your profile!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recommend;
