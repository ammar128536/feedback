'use client'
import Link from 'next/link'
import { Feedback } from '../lib/db'
import { FiSearch, FiThumbsUp, FiMessageSquare } from 'react-icons/fi'
import { useState, useEffect } from 'react'

export default function Home() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [search, setSearch] = useState('')
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([])
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'user-az' | 'user-za'>('newest')
  const [userFilter, setUserFilter] = useState<string>('')

  // Get unique user names for filter dropdown
  const userNames = Array.from(new Set(feedbacks.map(f => f.name))).sort((a, b) => a.localeCompare(b))

  useEffect(() => {
    async function fetchFeedbacks() {
      const res = await fetch('/api/feedback')
      const data = await res.json()
      setFeedbacks(data)
      setFilteredFeedbacks(data)
    }
    fetchFeedbacks()
  }, [])

  useEffect(() => {
    let result = feedbacks
    // Filter by search
    if (search) {
      result = result.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.message.toLowerCase().includes(search.toLowerCase())
      )
    }
    // Filter by user
    if (userFilter) {
      result = result.filter(f => f.name === userFilter)
    }
    // Sort
    switch (sortOption) {
      case 'newest':
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        result = [...result].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'user-az':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'user-za':
        result = [...result].sort((a, b) => b.name.localeCompare(a.name))
        break
    }
    setFilteredFeedbacks(result)
  }, [search, feedbacks, sortOption, userFilter])

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-6 sm:mb-8 py-8 sm:py-12 px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Feedback Board
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8">
            Share your thoughts, suggestions, and feedback to help us improve.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link 
              href="/submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 sm:py-3 sm:px-6 rounded-lg shadow-md transition transform hover:-translate-y-0.5"
            >
              Submit Feedback
            </Link>
            <Link 
              href="/feedback" 
              className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-5 sm:py-3 sm:px-6 rounded-lg border border-gray-300 shadow-sm transition transform hover:-translate-y-0.5"
            >
              View All Feedback
            </Link>
          </div>
        </section>

        {/* Search, Filter, and Sort Bar */}
        <div className="mb-10 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search feedback..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
            >
              <option value="">All Users</option>
              {userNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
              value={sortOption}
              onChange={e => setSortOption(e.target.value as 'newest' | 'oldest' | 'user-az' | 'user-za')}
              >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="user-az">User A-Z</option>
              <option value="user-za">User Z-A</option>
            </select>
          </div>
        </div>

        {/* Feedback Preview */}
        <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recent Feedback</h2>
            <span className="text-sm sm:text-base text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredFeedbacks.length} {filteredFeedbacks.length === 1 ? 'submission' : 'submissions'}
            </span>
          </div>
          {filteredFeedbacks.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-5xl sm:text-6xl mb-3 sm:mb-4">💬</div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1 sm:mb-2">No feedback found</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Try a different search term or submit new feedback!</p>
              <Link 
                href="/submit" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 sm:py-2 sm:px-6 rounded-lg shadow-md transition transform hover:-translate-y-0.5"
              >
                Submit Feedback
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredFeedbacks.slice(0, 3).map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="p-4 sm:p-5 border rounded-lg hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                      {feedback.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{feedback.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base pl-11 sm:pl-13 mt-1 sm:mt-2">
                    {feedback.message.length > 120 
                      ? `${feedback.message.substring(0, 120)}...` 
                      : feedback.message}
                  </p>
                  <div className="flex justify-end gap-4 mt-3">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                      <FiThumbsUp size={16} />
                      <span className="text-sm">0</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                      <FiMessageSquare size={16} />
                      <span className="text-sm">0</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}