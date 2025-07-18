import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const profileMenuRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Close profile menu if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Recommendations', path: '/recommend' },
        { name: 'Profile', path: '/profile' },
    ];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <NavLink to="/dashboard" className="text-2xl font-bold text-primary">
                            NaukriBot
                        </NavLink>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            isActive
                                                ? 'bg-primary text-white'
                                                : 'text-secondary hover:bg-gray-100 hover:text-neutral-800'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <UserCircleIcon className="h-8 w-8 text-secondary hover:text-primary" />
                                </button>
                                {isProfileOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <NavLink to="/profile" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                                            <UserCircleIcon className="h-5 w-5 mr-2" />
                                            Your Profile
                                        </NavLink>
                                        <button onClick={handleLogout} className="dropdown-item w-full text-left">
                                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-secondary hover:text-white hover:bg-primary focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <XMarkIcon className="block h-6 w-6" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive ? 'bg-primary text-white' : 'text-secondary hover:bg-gray-100'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="px-2 space-y-1">
                             <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-gray-100">
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
