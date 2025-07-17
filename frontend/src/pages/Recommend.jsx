import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Recommend() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get('http://localhost:8000/recommended-jobs', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setJobs(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-6">Loading recommendations...</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Recommended Jobs</h1>
      {jobs.length === 0 && (
        <p className="text-gray-600">No matching jobs found based on your keywords and preferences.</p>
      )}
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div key={index} className="p-4 border rounded shadow bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.company} · {job.location}</p>
                <p className="text-sm text-gray-500">Experience: {job.experience}</p>
              </div>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                📌 View Job
              </a>
            </div>
            {job.match && (
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                Matched Keyword: {job.match}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
