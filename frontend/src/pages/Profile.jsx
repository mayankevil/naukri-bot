import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { UserCircleIcon, BriefcaseIcon, NoSymbolIcon, ArrowUpOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

// =================================================================================
// Custom Tags Input Component - Replaces the external 'react-tagsinput' library
// =================================================================================
const CustomTagsInput = ({ value, onChange, inputProps }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!value.includes(inputValue.trim())) {
                onChange([...value, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="react-tagsinput">
            {value.map((tag, index) => (
                <span key={index} className="react-tagsinput-tag">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1.5">
                        <XMarkIcon className="h-3 w-3" />
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                {...inputProps}
                className="react-tagsinput-input"
            />
        </div>
    );
};


// Helper component for form fields to reduce repetition
const FormField = ({ label, id, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">
            {children}
        </div>
    </div>
);

const Profile = () => {
    const [activeTab, setActiveTab] = useState('naukri');
    const [profileData, setProfileData] = useState({
        naukri_username: '',
        naukri_password: '',
        keywords: [],
        locations: [],
        notice_period: '',
        ctc: '',
        resume_filename: '',
        blacklisted_companies: [],
        blacklisted_keywords: [],
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);

    // Fetch user profile data when the component loads
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Could not fetch profile data.');
            const data = await response.json();
            
            // Ensure array fields are actually arrays, handling null or empty strings
            setProfileData({
                ...data,
                keywords: data.keywords ? data.keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
                locations: data.locations ? data.locations.split(',').map(l => l.trim()).filter(Boolean) : [],
                blacklisted_companies: data.blacklisted_companies ? data.blacklisted_companies.split(',').map(c => c.trim()).filter(Boolean) : [],
                blacklisted_keywords: data.blacklisted_keywords ? data.blacklisted_keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
            });

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleTagsChange = (tags, name) => {
        setProfileData(prev => ({ ...prev, [name]: tags }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
            setProfileData(prev => ({ ...prev, resume_filename: file.name }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const toastId = toast.loading('Saving your profile...');

        try {
            const token = localStorage.getItem('token');
            
            // First, upload the resume if a new one is selected
            if (resumeFile) {
                const formData = new FormData();
                formData.append('resume', resumeFile);
                const resumeResponse = await fetch('/api/auth/upload-resume', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });
                if (!resumeResponse.ok) throw new Error('Failed to upload resume.');
            }

            // Next, save the rest of the profile data
            const payload = {
                ...profileData,
                keywords: profileData.keywords.join(','),
                locations: profileData.locations.join(','),
                blacklisted_companies: profileData.blacklisted_companies.join(','),
                blacklisted_keywords: profileData.blacklisted_keywords.join(','),
            };
            
            const profileResponse = await fetch('/api/auth/profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!profileResponse.ok) throw new Error('Failed to save profile data.');
            
            toast.success('Profile saved successfully!', { id: toastId });
            setResumeFile(null); // Reset file input after successful upload

        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return <p className="text-center text-secondary py-8">Loading your profile...</p>;
        }

        switch (activeTab) {
            case 'naukri':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-neutral-800">Naukri.com Settings</h3>
                        <p className="text-sm text-secondary">Provide your Naukri credentials and job preferences. This information is required for the bot to work.</p>
                        <FormField label="Naukri Username (Email)" id="naukri_username">
                            <input type="email" name="naukri_username" id="naukri_username" value={profileData.naukri_username} onChange={handleInputChange} className="input-style" required />
                        </FormField>
                        <FormField label="Naukri Password" id="naukri_password">
                            <input type="password" name="naukri_password" id="naukri_password" value={profileData.naukri_password} onChange={handleInputChange} className="input-style" required />
                        </FormField>
                        <FormField label="Job Keywords (e.g., React, Python, Data Scientist)" id="keywords">
                            <CustomTagsInput value={profileData.keywords} onChange={(tags) => handleTagsChange(tags, 'keywords')} inputProps={{placeholder: 'Add a keyword and press Enter'}} />
                        </FormField>
                        <FormField label="Preferred Locations (e.g., Delhi, Bangalore, Remote)" id="locations">
                           <CustomTagsInput value={profileData.locations} onChange={(tags) => handleTagsChange(tags, 'locations')} inputProps={{placeholder: 'Add a location and press Enter'}} />
                        </FormField>
                    </div>
                );
            case 'career':
                 return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-neutral-800">Career Details</h3>
                        <p className="text-sm text-secondary">Help the bot fill out applications more accurately with your career information.</p>
                        <FormField label="Current Annual CTC (in Lakhs)" id="ctc">
                            <input type="number" name="ctc" id="ctc" value={profileData.ctc} onChange={handleInputChange} className="input-style" placeholder="e.g., 15" />
                        </FormField>
                         <FormField label="Notice Period (in days)" id="notice_period">
                            <input type="number" name="notice_period" id="notice_period" value={profileData.notice_period} onChange={handleInputChange} className="input-style" placeholder="e.g., 30" />
                        </FormField>
                        <FormField label="Upload Resume (.pdf, .doc, .docx)" id="resume">
                             <div className="flex items-center gap-4">
                                <label htmlFor="resume-upload" className="cursor-pointer btn-secondary flex items-center gap-2">
                                    <ArrowUpOnSquareIcon className="h-5 w-5"/>
                                    Choose File
                                </label>
                                <input id="resume-upload" name="resume" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx"/>
                                <span className="text-secondary text-sm">{profileData.resume_filename || "No file selected"}</span>
                            </div>
                        </FormField>
                    </div>
                );
            case 'blacklist':
                 return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-neutral-800">Blacklists</h3>
                        <p className="text-sm text-secondary">Prevent the bot from applying to specific companies or for jobs with certain keywords.</p>
                        <FormField label="Blacklisted Companies" id="blacklisted_companies">
                            <CustomTagsInput value={profileData.blacklisted_companies} onChange={(tags) => handleTagsChange(tags, 'blacklisted_companies')} inputProps={{placeholder: 'Add a company and press Enter'}} />
                        </FormField>
                        <FormField label="Blacklisted Keywords" id="blacklisted_keywords">
                           <CustomTagsInput value={profileData.blacklisted_keywords} onChange={(tags) => handleTagsChange(tags, 'blacklisted_keywords')} inputProps={{placeholder: 'Add a keyword and press Enter'}} />
                        </FormField>
                    </div>
                );
            default:
                return null;
        }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === id ? 'bg-primary text-white' : 'text-secondary hover:bg-gray-200'
            }`}
        >
            <Icon className="h-5 w-5" />
            {label}
        </button>
    );

    return (
        <div className="bg-neutral-100 min-h-screen p-4 sm:p-8 font-sans">
            <div className="container mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">Your Profile</h1>
                    <p className="text-secondary mt-1">Keep your information up to date for the best results.</p>
                </header>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-wrap gap-2">
                            <TabButton id="naukri" label="Naukri Settings" icon={UserCircleIcon} />
                            <TabButton id="career" label="Career Details" icon={BriefcaseIcon} />
                            <TabButton id="blacklist" label="Blacklists" icon={NoSymbolIcon} />
                        </div>
                    </div>

                    <div className="p-8">
                        {renderContent()}
                    </div>

                    <div className="bg-gray-50 p-6 flex justify-end rounded-b-lg">
                        <button type="submit" className="btn-primary" disabled={saving || loading}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
