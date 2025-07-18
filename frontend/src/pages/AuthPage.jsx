import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LockClosedIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/solid';

// You can replace this with a relevant image from a service like Unsplash or a custom illustration
const authImageUrl = "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069";

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoginView, setIsLoginView] = useState(location.pathname === '/login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // For registration
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Update view when URL changes (e.g., user clicks a link to /register from /login)
    useEffect(() => {
        setIsLoginView(location.pathname === '/login');
        setError(''); // Reset errors when switching views
    }, [location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLoginView 
        ? 'http://localhost:8000/api/auth/token' 
        : 'http://localhost:8000/api/auth/register';

        const payload = isLoginView 
            ? { username: email, password } 
            : { email, password, username };

        const headers = isLoginView 
            ? { 'Content-Type': 'application/x-www-form-urlencoded' }
            : { 'Content-Type': 'application/json' };
            
        const body = isLoginView 
            ? new URLSearchParams(payload) 
            : JSON.stringify(payload);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: body,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'An error occurred.');
            }
            
            if (isLoginView) {
                localStorage.setItem('token', data.access_token);
                navigate('/dashboard');
            } else {
                // On successful registration, redirect to login with a success message
                navigate('/login?registered=true');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* Image Panel */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-primary p-12">
                <div 
                    className="w-full h-full bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url(${authImageUrl})` }}
                ></div>
            </div>

            {/* Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-neutral-100">
                <div className="max-w-md w-full">
                    <div>
                        <Link to="/" className="text-2xl font-bold text-primary">NaukriBot</Link>
                        <h2 className="mt-6 text-4xl font-extrabold text-neutral-800">
                            {isLoginView ? 'Welcome Back!' : 'Create an Account'}
                        </h2>
                        <p className="mt-2 text-secondary">
                            {isLoginView ? 'Sign in to continue to your dashboard.' : 'Let\'s get you started.'}
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {!isLoginView && (
                            <div className="relative">
                                <UserIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4"/>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="relative">
                             <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4"/>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                             <LockClosedIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4"/>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-indigo-300"
                            >
                                {loading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Create Account')}
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-center text-sm text-secondary">
                        {isLoginView ? "Don't have an account? " : "Already have an account? "}
                        <Link to={isLoginView ? '/register' : '/login'} className="font-medium text-primary hover:text-primary-hover">
                            {isLoginView ? 'Sign Up' : 'Sign In'}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;