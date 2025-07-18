import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { UsersIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users.');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Memoized filtering logic to avoid re-calculating on every render
    const filteredUsers = useMemo(() => {
        if (!searchTerm) {
            return users;
        }
        return users.filter(user =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    return (
        <div className="bg-neutral-100 min-h-screen p-4 sm:p-8 font-sans">
            <div className="container mx-auto">
                {/* Header Section */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">Admin Panel</h1>
                    <p className="text-secondary mt-1">Manage users and monitor application activity.</p>
                </header>

                {/* Stat Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <UsersIcon className="h-10 w-10 text-primary mr-4" />
                        <div>
                            <p className="text-sm text-secondary">Total Users</p>
                            <p className="text-3xl font-bold">{loading ? '...' : users.length}</p>
                        </div>
                    </div>
                    {/* You can add more stat cards here, e.g., Active Bots, Jobs Applied Today */}
                </div>

                {/* Users Table Card */}
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-neutral-800 mb-4 md:mb-0">User Management</h2>
                        <div className="relative w-full md:w-auto">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by email or username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-style w-full pl-10"
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <p className="text-center text-secondary py-8">Loading users...</p>
                        ) : (
                            <table className="min-w-full text-left">
                                <thead className="border-b-2 border-gray-200">
                                    <tr>
                                        <th scope="col" className="table-header">Username</th>
                                        <th scope="col" className="table-header">Email</th>
                                        <th scope="col" className="table-header">Is Active</th>
                                        <th scope="col" className="table-header">Is Admin</th>
                                        <th scope="col" className="table-header">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-200 hover:bg-neutral-100 transition-colors">
                                            <td className="table-cell font-medium">{user.username}</td>
                                            <td className="table-cell text-secondary">{user.email}</td>
                                            <td className="table-cell">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="table-cell text-secondary">{user.is_superuser ? 'Yes' : 'No'}</td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 text-secondary hover:text-primary transition-colors">
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button className="p-2 text-secondary hover:text-red-600 transition-colors">
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                         {filteredUsers.length === 0 && !loading && (
                            <p className="text-center text-secondary py-8">No users found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add these utility classes to your src/index.css file
/*
.table-header {
    @apply text-sm font-semibold text-neutral-800 px-6 py-4;
}
.table-cell {
    @apply px-6 py-4;
}
*/

export default AdminPanel;
