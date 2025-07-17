import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminPanel() {
  const token = localStorage.getItem('token')
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    is_admin: false
  })
  const [message, setMessage] = useState('')

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(res.data)
    } catch (err) {
      setMessage("Access Denied — Admins only.")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8000/admin/create-user', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage("✅ User created successfully")
      fetchUsers()
    } catch (err) {
      setMessage("❌ Error: " + err.response.data.detail)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel — User Management</h1>

      {message && <p className="mb-3 text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6 space-y-3">
        <h2 className="text-lg font-semibold">Create New User</h2>
        <input name="username" placeholder="Username" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" />
        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" name="is_admin" onChange={handleChange} />
          <span>Is Admin?</span>
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create User</button>
      </form>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Existing Users</h2>
        {users.map(user => (
          <div key={user.id} className="bg-white border px-4 py-2 rounded shadow">
            <p><b>{user.username}</b> — {user.email}</p>
            <p className="text-sm">{user.is_admin ? "🛡 Admin" : "👤 Standard User"}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
