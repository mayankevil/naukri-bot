import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    keywords: '',
    preferred_locations: '',
    resume_path: '',
    notice_period: '',
    current_ctc: '',
    expected_ctc: '',
    experience: '',
    security_answers: '',
    blacklisted_keywords: '',
    blacklisted_companies: ''
  })

  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get('http://localhost:8000/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setProfile(res.data)
      axios.get(`http://localhost:8000/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then((resp) => {
        setForm(resp.data)
        setLoading(false)
      }).catch(() => setLoading(false))
    })
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    await axios.post('http://localhost:8000/update-profile', form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setMessage("✅ Profile updated successfully! Recommendations refreshed.")
  } catch (err) {
    setMessage("❌ Failed to update profile.")
  }
}

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(form).map((key) => (
          <div key={key}>
            <label className="block mb-1 font-medium capitalize">
              {key.replaceAll('_', ' ')}
            </label>
            <input
              type="text"
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        ))}

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Profile
        </button>
      </form>
    </div>
  )
}
