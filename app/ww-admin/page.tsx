'use client'

import { SetStateAction, useState } from 'react'
import { Trash2, Download, RefreshCw } from 'lucide-react'
import { getWaitlistData } from '@/actions/waitlist/getWaitlistData'
import { deleteRenter } from '@/actions/waitlist/deleteRenter'
import { exportToCSV, exportToExcel } from '@/lib/exportUtils'

interface WaitlistEntry {
  id: string
  name: string
  email: string
  createdAt: Date | string
  status: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passkey, setPasskey] = useState('')
  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const ADMIN_PASSKEY = '1Rentme.com'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passkey === ADMIN_PASSKEY) {
      setIsAuthenticated(true)
      setError('')
      fetchWaitlistData()
    } else {
      setError('Invalid passkey')
    }
  }

  const fetchWaitlistData = async () => {
    setIsLoading(true)
    try {
      const result = await getWaitlistData()
      if (result.success) {
        setWaitlistData((result.data as unknown as WaitlistEntry[]) || [])
      } else {
        setError(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      setError('An error occurred while fetching data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRenter = async (renterId: string, renterName: string) => {
    if (!confirm(`Are you sure you want to delete ${renterName} from the waitlist?`)) {
      return
    }

    setDeletingId(renterId)
    try {
      const result = await deleteRenter(renterId)
      if (result.success) {
        setWaitlistData(prev => prev.filter(entry => entry.id !== renterId))
      } else {
        setError(result.error || 'Failed to delete renter')
      }
    } catch (err) {
      setError('An error occurred while deleting renter')
    } finally {
      setDeletingId(null)
    }
  }

  const handleExportCSV = () => {
    exportToCSV(waitlistData, `rentme-waitlist-${new Date().toISOString().split('T')[0]}`)
  }

  const handleExportExcel = () => {
    exportToExcel(waitlistData, `rentme-waitlist-${new Date().toISOString().split('T')[0]}`)
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-8 text-foreground">
            RentMe Admin
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter passkey..."
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground rounded-lg py-3 hover:bg-primary/90 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-foreground">RentMe Waitlist</h1>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchWaitlistData}
              disabled={isLoading}
              className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={handleExportCSV}
              disabled={waitlistData.length === 0}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>

            <button
              onClick={handleExportExcel}
              disabled={waitlistData.length === 0}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading waitlist data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
            <button
              onClick={fetchWaitlistData}
              className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-muted-foreground">
                Total entries: {waitlistData.length}
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {waitlistData.map((entry) => (
                      <tr key={entry.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {entry.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {entry.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(entry.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          <button
                            onClick={() => handleDeleteRenter(entry.id, entry.name)}
                            disabled={deletingId === entry.id}
                            className="flex items-center gap-1 text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            {deletingId === entry.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {waitlistData.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No waitlist entries yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}