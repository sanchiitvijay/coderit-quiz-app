import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuiz } from '../hooks/useQuiz'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { FaTrophy, FaMedal, FaArrowLeft, FaClock, FaUser } from 'react-icons/fa'

const LeaderboardPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentQuiz, results, loading, error, fetchQuiz, fetchResults } = useQuiz()
  const [sortedResults, setSortedResults] = useState([])

  useEffect(() => {
    if (id) {
      fetchQuiz(id)
      fetchResults(id)
    }
  }, [id])

  useEffect(() => {
    if (results.length > 0) {
      const sorted = [...results].sort((a, b) => {
        // Sort by percentage first, then by time taken (less time is better)
        if (b.percentage !== a.percentage) {
          return b.percentage - a.percentage
        }
        return (a.time_taken || 0) - (b.time_taken || 0)
      })
      setSortedResults(sorted)
    }
  }, [results])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <FaTrophy className="text-yellow-500 text-xl" />
      case 2:
        return <FaMedal className="text-gray-400 text-xl" />
      case 3:
        return <FaMedal className="text-orange-600 text-xl" />
      default:
        return <span className="text-gray-500 font-bold">{position}</span>
    }
  }

  const getPositionColor = (position) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600'
      default:
        return 'bg-gray-100 dark:bg-gray-700'
    }
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  if (loading) {
    return <LoadingSkeleton type="form" />
  }

  if (error || !currentQuiz) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">Error loading leaderboard</div>
        <p className="text-gray-600 dark:text-gray-400">{error || 'Quiz not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary mt-4"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="btn-secondary p-2 mr-4"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {currentQuiz.title}
          </p>
        </div>
      </div>

      {/* Quiz Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="quiz-card p-4 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {sortedResults.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Attempts
          </div>
        </div>

        <div className="quiz-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {sortedResults.length > 0 ? Math.round(
              sortedResults.reduce((acc, result) => acc + result.percentage, 0) / sortedResults.length
            ) : 0}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Average Score
          </div>
        </div>

        <div className="quiz-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {sortedResults.length > 0 ? Math.max(...sortedResults.map(r => r.percentage)) : 0}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Highest Score
          </div>
        </div>

        <div className="quiz-card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {sortedResults.length > 0 ? formatTime(
              Math.min(...sortedResults.map(r => r.time_taken || 0))
            ) : '0:00'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Fastest Time
          </div>
        </div>
      </motion.div>

      {/* Leaderboard */}
      {sortedResults.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {sortedResults.map((result, index) => (
            <motion.div
              key={result.$id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`quiz-card p-4 ${
                index < 3 ? 'ring-2 ring-opacity-50' : ''
              } ${
                index === 0 ? 'ring-yellow-400' :
                index === 1 ? 'ring-gray-400' :
                index === 2 ? 'ring-orange-400' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Position */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index < 3 ? getPositionColor(index + 1) : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {getPositionIcon(index + 1)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-gray-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {result.user_name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(result.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Score and Stats */}
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(result.percentage)}`}>
                      {result.percentage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {result.score}/{result.total_questions}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <FaClock className="text-sm" />
                      <span>{formatTime(result.time_taken || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      result.percentage >= 90 ? 'bg-green-500' :
                      result.percentage >= 80 ? 'bg-blue-500' :
                      result.percentage >= 70 ? 'bg-yellow-500' :
                      result.percentage >= 60 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            No results yet
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Be the first to take this quiz and claim the top spot!
          </p>
          <button
            onClick={() => navigate(`/quiz/${id}`)}
            className="btn-primary"
          >
            Take Quiz
          </button>
        </motion.div>
      )}

      {/* Back to Quiz Button */}
      {sortedResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => navigate(`/quiz/${id}`)}
            className="btn-primary"
          >
            Try Again
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default LeaderboardPage