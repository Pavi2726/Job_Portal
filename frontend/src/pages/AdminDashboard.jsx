import { useState, useEffect } from 'react'
import apiClient from '../api/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsRes] = await Promise.all([
          apiClient.get('/jobs', { params: { limit: 100 } }),
        ])
        const jobsData = jobsRes.data

        // Derive stats from jobs data
        setStats({
          totalJobs: jobsData.length,
          activeJobs: jobsData.filter(j => j.is_active).length,
          inactiveJobs: jobsData.filter(j => !j.is_active).length,
        })
        setJobs(jobsData)
      } catch (err) {
        setError(err.userMessage || 'Failed to load analytics.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center py-20 text-gray-400 text-sm gap-2">
      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      Loading analytics...
    </div>
  )

  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {error}
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Platform-wide statistics and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Jobs', value: stats.totalJobs, color: 'bg-blue-500', icon: '💼' },
          { label: 'Active Jobs', value: stats.activeJobs, color: 'bg-green-500', icon: '✅' },
          { label: 'Inactive Jobs', value: stats.inactiveJobs, color: 'bg-gray-400', icon: '⏸️' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className={`w-10 h-10 ${color} rounded-lg mb-3 flex items-center justify-center text-white text-lg`}>
              {icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-gray-500 text-sm mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Jobs Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">All Job Postings</h2>
          <span className="text-xs text-gray-400">{jobs.length} total</span>
        </div>

        {jobs.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No jobs posted yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Posted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                    {job.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Note */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        For deeper analytics (per-candidate, per-recruiter stats), 
        connect the <code className="bg-gray-100 px-1 rounded">/dashboard</code> endpoints.
      </p>
    </div>
  )
}