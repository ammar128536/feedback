"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import toast, { Toaster } from 'react-hot-toast'
import { FiArrowLeft, FiEdit2, FiTrash2, FiCheck, FiX, FiThumbsUp, FiMessageSquare, FiClock } from 'react-icons/fi'

interface FeedbackItem {
  id: string
  name: string
  message: string
  createdAt: string
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{ name: string; message: string }>({ name: '', message: '' })

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('/api/feedback')
        if (response.ok) {
          const data = await response.json()
          setFeedback(data)
        }
      } catch (error) {
        console.error("Failed to fetch feedback:", error)
        toast.error('Failed to load feedback', { position: 'top-center' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete feedback from ${name}?`)) return
    
    try {
      const res = await fetch(`/api/feedback?id=${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete feedback')
      setFeedback((prev) => prev.filter((item) => item.id !== id))
      toast.success(`Feedback from ${name} deleted successfully!`, { 
        position: 'top-center',
        icon: '🗑️'
      })
    } catch (error) {
      toast.error('Failed to delete feedback', { position: 'top-center' })
    }
  }

  const handleEditClick = (item: FeedbackItem) => {
    setEditingId(item.id)
    setEditForm({ name: item.name, message: item.message })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditForm({ name: '', message: '' })
  }

  const handleEditSave = async (id: string) => {
    if (!editForm.name.trim() || !editForm.message.trim()) {
      toast.error('Please fill in all fields', { position: 'top-center' })
      return
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm }),
      })
      if (!res.ok) throw new Error('Failed to update feedback')
      const updated = await res.json()
      setFeedback((prev) => prev.map((item) => item.id === id ? { ...item, ...updated } : item))
      toast.success(`Feedback updated successfully!`, { 
        position: 'top-center',
        icon: '✅'
      })
      setEditingId(null)
      setEditForm({ name: '', message: '' })
    } catch (error) {
      toast.error('Failed to update feedback', { position: 'top-center' })
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-lg transition bg-blue-50 hover:bg-blue-100">
            <FiArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Feedback</h1>
            <p className="text-gray-500 mt-1">Community suggestions and ideas</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
              {feedback.length} {feedback.length === 1 ? 'submission' : 'submissions'}
            </span>
            <Link 
              href="/submit" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 sm:px-6 rounded-lg shadow-md transition hover:-translate-y-0.5"
            >
              <span className="text-xl">+</span>
              <span className="hidden sm:inline">Add Feedback</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : feedback.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="text-gray-300 text-6xl mb-4">💬</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No feedback yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Be the first to share your thoughts and help us improve our product!</p>
              <Link 
                href="/submit" 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition hover:-translate-y-0.5"
              >
                Submit First Feedback
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {feedback.map((item) => (
                <div key={item.id} className="p-5 sm:p-6 hover:bg-gray-50 transition group">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
                      {item.name[0].toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        {editingId === item.id ? (
                          <input
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            className="font-semibold text-gray-800 border border-gray-300 rounded-md px-3 py-1 w-full max-w-xs"
                            placeholder="Your name"
                          />
                        ) : (
                          <div>
                            <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                {new Date(item.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                                New
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          {editingId === item.id ? (
                            <>
                              <button
                                onClick={() => handleEditSave(item.id)}
                                className="p-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition"
                                title="Save"
                              >
                                <FiCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className="p-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                                title="Cancel"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(item)}
                                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                                title="Edit"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id, item.name)}
                                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      {editingId === item.id ? (
                        <textarea
                          name="message"
                          value={editForm.message}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2"
                          rows={3}
                          placeholder="Your feedback message"
                        />
                      ) : (
                        <p className="text-gray-700 mt-2 whitespace-pre-line">{item.message}</p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
                        <div className="flex gap-4">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition">
                            <FiThumbsUp className="w-4 h-4" />
                            <span className="text-sm">24</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition">
                            <FiMessageSquare className="w-4 h-4" />
                            <span className="text-sm">3</span>
                          </button>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                          Feature Request
                        </span>
                      </div>

                      {/* Admin Reply (Example) */}
                      {item.id === feedback[0].id && (
                        <div className="mt-3 p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                              A
                            </div>
                            <span className="font-semibold text-sm">Admin Response</span>
                          </div>
                          <p className="text-sm">Thanks for your suggestion and feedback</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}