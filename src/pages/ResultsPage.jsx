import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { useAppwrite } from '../contexts/AppwriteContext'
import { FaTrophy, FaHome, FaShareAlt, FaChartBar } from 'react-icons/fa'

const ResultsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { databases, appwriteConfig } = useAppwrite()
  const [result, setResult] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const resultData = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.results,
          id
        )
        setResult(resultData)

        const quizData = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.quizzes,
          resultData.quiz_id
        )
        setQuiz(quizData)

        // Show confetti for good scores
        if (resultData.percentage >= 80) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 5000)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchResult()
    }
  }, [id])

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return 'Excellent! 🎉'
    if (percentage >= 80) return 'Great job! 👏'
    if (percentage >= 70) return 'Good work! 👍'
    if (percentage >= 60) return 'Not bad! 💪'
    return 'Keep trying! 📚'
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quiz Results - ${quiz?.title}`,
          text: `I scored ${result.percentage}% on "${quiz?.title}" quiz!`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback - copy to clipboard
      const text = `I scored ${result.percentage}% on "${quiz?.title}" quiz! ${window.location.href}`
      navigator.clipboard.writeText(text)
      alert('Result copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !result || !quiz) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">Error loading results</div>
        <p className="text-gray-600 dark:text-gray-400">{error || 'Results not found'}</p>
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
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="quiz-card p-8 mb-6">
          <div className="mb-6">
            <FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Quiz Complete!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {quiz.title}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(result.percentage)}`}>
                {result.percentage}%
              </div>
              <div className="text-gray-600 dark:text-gray-400">Score</div>
            </div>

            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {result.score}/{result.total_questions}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Correct</div>
            </div>

            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {formatTime(result.time_taken || 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Time</div>
            </div>
          </div>

          <div className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            {getScoreMessage(result.percentage)}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            <p>Completed by: {result.user_name}</p>
            <p>Date: {new Date(result.timestamp).toLocaleString()}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <FaHome />
              <span>Back to Home</span>
            </button>

            {/* <button
              onClick={shareResult}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <FaShareAlt />
              <span>Share Result</span>
            </button> */}

            <button
              onClick={() => navigate(`/leaderboard/${quiz.$id}`)}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <FaChartBar />
              <span>Leaderboard</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Performance Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="quiz-card p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Performance Analysis
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    result.percentage >= 80 ? 'bg-green-500' :
                    result.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
              <span className="font-semibold">{result.percentage}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: '100%' }}
                />
              </div>
              <span className="font-semibold">100%</span>
            </div>
          </div>

          {quiz.timeLimit && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Time Efficiency</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ 
                      width: `${Math.min(100, ((quiz.timeLimit * 60 - result.time_taken) / (quiz.timeLimit * 60)) * 100)}%` 
                    }}
                  />
                </div>
                <span className="font-semibold">
                  {Math.round(((quiz.timeLimit * 60 - result.time_taken) / (quiz.timeLimit * 60)) * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ResultsPage