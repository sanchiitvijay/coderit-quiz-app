import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuiz } from '../hooks/useQuiz'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { FaClock, FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'

const QuizPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentQuiz, questions, loading, error, fetchQuiz, fetchQuestions, submitQuiz } = useQuiz()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [showUserForm, setShowUserForm] = useState(true)
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [startTime, setStartTime] = useState(null)

  useEffect(() => {
    if (id) {
      fetchQuiz(id)
      fetchQuestions(id)
    }
  }, [id])

  useEffect(() => {
    if (currentQuiz && currentQuiz.timeLimit && !showUserForm) {
      setTimeLeft(currentQuiz.timeLimit * 60)
      setStartTime(Date.now())
    }
  }, [currentQuiz, showUserForm])

  useEffect(() => {
    if (timeLeft > 0 && !showUserForm) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, showUserForm])

  const handleStartQuiz = () => {
    if (userInfo.name && userInfo.email) {
      setShowUserForm(false)
    }
  }

  const handleAnswerSelect = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (submitting) return
    
    setSubmitting(true)
    try {
      const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
      const result = await submitQuiz(id, Object.values(answers), {
        ...userInfo,
        timeTaken
      })
      navigate(`/results/${result.result.$id}`)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Error submitting quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0

  if (loading) {
    return <LoadingSkeleton type="quiz" />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">Error loading quiz</div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary mt-4"
        >
          Back to Home
        </button>
      </div>
    )
  }

  if (!currentQuiz || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">Quiz not found</div>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Back to Home
        </button>
      </div>
    )
  }

  if (showUserForm) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="quiz-card p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {currentQuiz.title}
          </h1>
          
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Your Name"
              value={userInfo.name}
              onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={userInfo.email}
              onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
              className="input-field"
              required
            />
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            <p>📝 {questions.length} questions</p>
            {currentQuiz.timeLimit && (
              <p>⏱️ {currentQuiz.timeLimit} minutes</p>
            )}
            <p>🎯 {currentQuiz.difficulty || 'Easy'} difficulty</p>
          </div>
          
          <button
            onClick={handleStartQuiz}
            disabled={!userInfo.name || !userInfo.email}
            className="btn-primary w-full"
          >
            Start Quiz
          </button>
        </div>
      </motion.div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary p-2"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentQuiz.title}
          </h1>
        </div>
        
        {currentQuiz.timeLimit && (
          <div className="flex items-center space-x-2 text-lg font-semibold">
            <FaClock className="text-red-500" />
            <span className={timeLeft < 300 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="quiz-card p-8 mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {currentQ.question}
          </h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  answers[currentQuestion] === index
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === index
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <FaCheck className="text-white text-xs" />
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn-secondary flex items-center space-x-2"
        >
          <FaArrowLeft />
          <span>Previous</span>
        </button>
        
        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary flex items-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <FaCheck />
                <span>Submit Quiz</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-primary flex items-center space-x-2"
          >
            <span>Next</span>
            <FaArrowRight />
          </button>
        )}
      </div>
    </div>
  )
}

export default QuizPage