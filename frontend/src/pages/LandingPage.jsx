import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, RocketLaunchIcon, BellAlertIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
    return (
        <div className="bg-neutral-100 text-neutral-800 font-sans">
            {/* Navbar Placeholder - Assuming you have a Navbar component */}
            {/* For now, we'll just have a simple header */}
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary">NaukriBot</h1>
                    <div>
                        <Link to="/login" className="text-secondary hover:text-primary mr-4">Login</Link>
                        <Link to="/register" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition duration-300">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-6 py-24 text-center">
                <h2 className="text-5xl font-extrabold mb-4">Automate Your Job Search.</h2>
                <h3 className="text-5xl font-extrabold text-primary mb-6">Land Your Dream Job Faster.</h3>
                <p className="text-xl text-secondary max-w-3xl mx-auto mb-8">
                    Our intelligent bot applies to jobs on Naukri.com for you, based on your unique profile and preferences. Stop searching, start interviewing.
                </p>
                <Link to="/register" className="bg-primary text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-primary-hover transition duration-300">
                    Create Your Free Account
                </Link>
            </main>

            {/* Features Section */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-2">Why You'll Love NaukriBot</h2>
                    <p className="text-lg text-secondary mb-12">The features that will revolutionize your job hunt.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="feature-card">
                            <RocketLaunchIcon className="h-12 w-12 text-primary mx-auto mb-4"/>
                            <h3 className="text-2xl font-bold mb-2">Auto Job Applications</h3>
                            <p className="text-secondary">Our bot tirelessly scans for new jobs and applies instantly using your profile, so you never miss an opportunity.</p>
                        </div>
                        <div className="feature-card">
                            <ShieldCheckIcon className="h-12 w-12 text-primary mx-auto mb-4"/>
                            <h3 className="text-2xl font-bold mb-2">Smart Profile Matching</h3>
                            <p className="text-secondary">Customize your job search with keywords, locations, and salary expectations to find the perfect role.</p>
                        </div>
                        <div className="feature-card">
                            <BellAlertIcon className="h-12 w-12 text-primary mx-auto mb-4"/>
                            <h3 className="text-2xl font-bold mb-2">Detailed Reporting</h3>
                            <p className="text-secondary">Get daily or weekly reports on all the jobs applied for, right in your inbox or on your dashboard.</p>
                        </div>
                    </div>
                </div>
            </section>

             {/* How It Works Section */}
            <section className="py-20">
                 <div className="container mx-auto px-6 text-center">
                     <h2 className="text-4xl font-bold mb-12">Get Started in 3 Simple Steps</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative">
                        {/* Dotted line for desktop view */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>
                        
                        <div className="step-card bg-white p-6 rounded-lg shadow-lg z-10">
                            <div className="text-5xl font-extrabold text-primary mb-2">1</div>
                            <h3 className="text-2xl font-bold mb-2">Create Your Profile</h3>
                            <p className="text-secondary">Set up your Naukri credentials and job preferences. Upload your resume to get started.</p>
                        </div>
                        <div className="step-card bg-white p-6 rounded-lg shadow-lg z-10">
                            <div className="text-5xl font-extrabold text-primary mb-2">2</div>
                            <h3 className="text-2xl font-bold mb-2">Activate the Bot</h3>
                            <p className="text-secondary">Start the bot with a single click from your dashboard. It will begin applying for jobs immediately.</p>
                        </div>
                        <div className="step-card bg-white p-6 rounded-lg shadow-lg z-10">
                            <div className="text-5xl font-extrabold text-primary mb-2">3</div>
                            <h3 className="text-2xl font-bold mb-2">Receive Updates</h3>
                            <p className="text-secondary">Track all your applications on the dashboard and receive email reports to monitor your progress.</p>
                        </div>
                     </div>
                 </div>
            </section>
        </div>
    );
};

export default LandingPage;