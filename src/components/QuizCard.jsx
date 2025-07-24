import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaPlay, FaClock, FaQuestionCircle, FaTrophy } from 'react-icons/fa'

const QuizCard = ({ quiz, index }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500 text-white'
      case 'medium':
        return 'bg-primary-500 text-white'
      case 'hard':
        return 'bg-red-500 text-white'
      default:
        return 'bg-green-500 text-white'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="quiz-card p-6 hover:scale-105 transform transition-all duration-300 group"
    >
      <div className="flex flex-col h-full">
        {quiz.imageUrl && (
          <img
            src={quiz.imageUrl}
            alt={quiz.title}
            className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
          />
        )}
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {quiz.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {quiz.description}
          </p>
          
          <div className="flex items-center flex-wrap gap-3 mb-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <FaQuestionCircle className="text-primary-500" />
              <span>{quiz.questionCount || 0} questions</span>
            </div>
            
            {quiz.timeLimit && (
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <FaClock className="text-primary-500" />
                <span>{quiz.timeLimit} min</span>
              </div>
            )}
            
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
              {quiz.difficulty || 'Easy'}
            </div>
          </div>
          
          <div className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            Created: {formatDate(quiz.createdAt)}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/quiz/${quiz.$id}`}
            className="flex-1 btn-primary text-center flex items-center justify-center space-x-2"
          >
            <FaPlay className="text-sm" />
            <span>Start Quiz</span>
          </Link>
          
          <Link
            to={`/leaderboard/${quiz.$id}`}
            className="btn-secondary flex items-center justify-center px-4"
          >
            <FaTrophy />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default QuizCard