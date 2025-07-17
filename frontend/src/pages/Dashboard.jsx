import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')

  const fetchJobs = async () => {
    const res = await axios.get('http://localhost:8000/applied-jobs', {
      headers: { Authorization: `Bearer ${token}` }
    })
    setJobs(res.data)
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const runBot = async () => {
    setLoading(true)
    setMessage('')
    try {
      await axios.post('http://localhost:8000/run-bot', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('✅ Bot started successfully in background.')
    } catch (err) {
      setMessage('❌ Failed to trigger bot.')
    } finally {
      setLoading(false)
    }
  }

  const sendEmailReport = async () => {
    try {
      const res = await axios.post('http://localhost:8000/email-report', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert(res.data.msg)
    } catch (err) {
      alert("Failed to send report.")
    }
  }

  const downloadExcel = () => {
    window.open(`http://localhost:8000/download-excel`, '_blank')
  }

  const downloadPdf = () => {
    window.open(`http://localhost:8000/download-pdf`, '_blank')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Applications</h1>
        <div className="space-x-4">
          <button
            onClick={runBot}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Running...' : 'Apply Now'}
          </button>
          <button
            onClick={sendEmailReport}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Email Report
          </button>
          <button
            onClick={downloadExcel}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Download Excel
          </button>
          <button
            onClick={downloadPdf}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Download PDF
          </button>
        </div>
      </div>

      {message && <p className="mb-4 text-blue-600 font-medium">{message}</p>}

      <p className="mb-2 text-gray-600">Total Jobs Applied: {jobs.length}</p>

      <div className="space-y-2">
        {jobs.map((job, i) => (
          <div key={i} className="p-4 bg-white shadow rounded border border-gray-200">
            <p className="font-semibold">{job.job_title}</p>
            <p className="text-sm text-gray-600">{job.company}</p>
            <a href={job.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">View Job</a>
          </div>
        ))}
      </div>
    </div>
  )
}
