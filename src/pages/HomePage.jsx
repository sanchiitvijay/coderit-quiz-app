import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useQuiz } from '../hooks/useQuiz'
import QuizCard from '../components/QuizCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { FaSearch, FaFilter, FaPlus, FaStar, FaUsers, FaChartLine } from 'react-icons/fa'

const HomePage = () => {
  const { quizzes, loading, error, fetchQuizzes } = useQuiz()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [filteredQuizzes, setFilteredQuizzes] = useState([])

  useEffect(() => {
    fetchQuizzes()
  }, [])

  useEffect(() => {
    let filtered = quizzes

    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(quiz =>
        quiz.difficulty?.toLowerCase() === filterDifficulty.toLowerCase()
      )
    }

    setFilteredQuizzes(filtered)
  }, [quizzes, searchTerm, filterDifficulty])

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">Error loading quizzes</div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={fetchQuizzes}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Test Your Knowledge</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Challenge yourself with our collection of interactive quizzes. Learn, compete, and have fun!
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500 dark:text-gray-400" />
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="input-field py-2 px-3 w-auto"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quiz Grid */}
      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz, index) => (
            <QuizCard key={quiz.$id} quiz={quiz} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            {searchTerm || filterDifficulty !== 'all' 
              ? 'No quizzes found matching your criteria'
              : 'No quizzes available'
            }
          </div>
          {searchTerm || filterDifficulty !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterDifficulty('all')
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          ) : null}
        </motion.div>
      )}

      {/* Statistics */}
      {quizzes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="quiz-card p-6 text-center group hover:scale-105 transition-transform">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaStar className="text-2xl text-white" />
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {quizzes.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Total Quizzes</div>
          </div>
          
          <div className="quiz-card p-6 text-center group hover:scale-105 transition-transform">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaChartLine className="text-2xl text-white" />
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {quizzes.reduce((acc, quiz) => acc + (quiz.questionCount || 0), 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Total Questions</div>
          </div>
          
          <div className="quiz-card p-6 text-center group hover:scale-105 transition-transform">
            <div className="p-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-2xl text-gray-100" />
            </div>
            <div className="text-3xl font-bold text-gray-700 mb-2">
              {quizzes.filter(quiz => quiz.difficulty === 'Hard').length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Hard Quizzes</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default HomePage