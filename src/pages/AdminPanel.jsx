import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useQuiz } from '../hooks/useQuiz'
import Login from '../components/Login'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { FaPlus, FaEdit, FaTrash, FaEye, FaSave, FaTimes, FaTrashAlt } from 'react-icons/fa'

const AdminPanel = () => {
  const { user, loading: authLoading } = useAuth()
  const { 
    quizzes, 
    loading, 
    error, 
    fetchQuizzes, 
    fetchQuestions,
    createQuiz, 
    updateQuiz, 
    deleteQuiz, 
    createQuestion,
    updateQuestion,
    deleteQuestion,
    deleteQuestionsByQuizId,
    deleteResultsByQuizId
  } = useQuiz()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState(null)
  const [editQuizData, setEditQuizData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    timeLimit: 10,
    questions: []
  })
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    timeLimit: 10,
    questions: []
  })
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  })

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const handleCreateQuiz = async () => {
    try {
      if (!newQuiz.title || !newQuiz.description || newQuiz.questions.length === 0) {
        alert('Please fill in all required fields and add at least one question')
        return
      }

      const quiz = await createQuiz({
        title: newQuiz.title,
        description: newQuiz.description,
        difficulty: newQuiz.difficulty,
        timeLimit: newQuiz.timeLimit,
        questionCount: newQuiz.questions.length
      })

      // Create questions for the quiz
      for (const question of newQuiz.questions) {
        await createQuestion({
          quiz_id: quiz.$id,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer
        })
      }

      setShowCreateModal(false)
      setNewQuiz({
        title: '',
        description: '',
        difficulty: 'Easy',
        timeLimit: 10,
        questions: []
      })
      fetchQuizzes()
      alert('Quiz created successfully!')
    } catch (error) {
      console.error('Error creating quiz:', error)
      alert('Error creating quiz. Please try again.')
    }
  }

  const handleEditQuiz = async (quiz) => {
    try {
      setEditingQuiz(quiz)
      const questions = await fetchQuestions(quiz.$id)
      setEditQuizData({
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty,
        timeLimit: quiz.timeLimit,
        questions: questions.map(q => ({
          id: q.$id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        }))
      })
      setShowEditModal(true)
    } catch (error) {
      console.error('Error loading quiz for edit:', error)
      alert('Error loading quiz data. Please try again.')
    }
  }

  const handleUpdateQuiz = async () => {
    try {
      if (!editQuizData.title || !editQuizData.description || editQuizData.questions.length === 0) {
        alert('Please fill in all required fields and add at least one question')
        return
      }

      // Update quiz details
      await updateQuiz(editingQuiz.$id, {
        title: editQuizData.title,
        description: editQuizData.description,
        difficulty: editQuizData.difficulty,
        timeLimit: editQuizData.timeLimit,
        questionCount: editQuizData.questions.length
      })

      // Delete all existing questions and create new ones
      await deleteQuestionsByQuizId(editingQuiz.$id)
      
      // Create updated questions
      for (const question of editQuizData.questions) {
        await createQuestion({
          quiz_id: editingQuiz.$id,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer
        })
      }

      setShowEditModal(false)
      setEditingQuiz(null)
      setEditQuizData({
        title: '',
        description: '',
        difficulty: 'Easy',
        timeLimit: 10,
        questions: []
      })
      fetchQuizzes()
      alert('Quiz updated successfully!')
    } catch (error) {
      console.error('Error updating quiz:', error)
      alert('Error updating quiz. Please try again.')
    }
  }

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(quizId)
        fetchQuizzes()
        alert('Quiz deleted successfully!')
      } catch (error) {
        console.error('Error deleting quiz:', error)
        alert('Error deleting quiz. Please try again.')
      }
    }
  }

  const handleClearUserData = async (quizId, quizTitle) => {
    if (window.confirm(`Are you sure you want to clear all user data for "${quizTitle}"? This will delete all user results and cannot be undone.`)) {
      try {
        await deleteResultsByQuizId(quizId)
        alert('User data cleared successfully!')
      } catch (error) {
        console.error('Error clearing user data:', error)
        alert('Error clearing user data. Please try again.')
      }
    }
  }

  const addQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt)) {
      alert('Please fill in all question fields')
      return
    }

    setNewQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion }]
    }))

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    })
  }

  const removeQuestion = (index) => {
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const addEditQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt)) {
      alert('Please fill in all question fields')
      return
    }

    setEditQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion }]
    }))

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    })
  }

  const removeEditQuestion = (index) => {
    setEditQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!user) {
    return <Login />
  }

  if (loading) {
    return <LoadingSkeleton type="form" />
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user.name || user.email}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Create Quiz</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Quiz List */}
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz.$id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="quiz-card p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {quiz.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {quiz.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{quiz.questionCount || 0} questions</span>
                  <span>{quiz.difficulty}</span>
                  <span>{quiz.timeLimit} min</span>
                  <span>Created: {new Date(quiz.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(`/quiz/${quiz.$id}`, '_blank')}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Preview Quiz"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleEditQuiz(quiz)}
                  className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                  title="Edit Quiz"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleClearUserData(quiz.$id, quiz.title)}
                  className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                  title="Clear User Data"
                >
                  <FaTrashAlt />
                </button>
                <button
                  onClick={() => handleDeleteQuiz(quiz.$id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete Quiz"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create New Quiz
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Quiz Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      value={newQuiz.title}
                      onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field"
                      placeholder="Enter quiz title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={newQuiz.difficulty}
                      onChange={(e) => setNewQuiz(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="input-field"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newQuiz.description}
                      onChange={(e) => setNewQuiz(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field"
                      rows={3}
                      placeholder="Enter quiz description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time Limit (Seconds)
                    </label>
                    <input
                      type="number"
                      value={newQuiz.timeLimit}
                      onChange={(e) => setNewQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                      className="input-field"
                      min="1"
                    />
                  </div>
                </div>

                {/* Add Question */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add Question
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Question
                      </label>
                      <input
                        type="text"
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                        className="input-field"
                        placeholder="Enter question"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Option {index + 1}
                            {index === currentQuestion.correctAnswer && (
                              <span className="text-green-600 ml-2">(Correct)</span>
                            )}
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...currentQuestion.options]
                                newOptions[index] = e.target.value
                                setCurrentQuestion(prev => ({ ...prev, options: newOptions }))
                              }}
                              className="input-field flex-1"
                              placeholder={`Option ${index + 1}`}
                            />
                            <button
                              onClick={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                              className={`px-3 py-2 rounded-lg ${
                                index === currentQuestion.correctAnswer
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              ✓
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addQuestion}
                      className="btn-secondary"
                    >
                      Add Question
                    </button>
                  </div>
                </div>

                {/* Questions List */}
                {newQuiz.questions.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Questions ({newQuiz.questions.length})
                    </h3>
                    <div className="space-y-3">
                      {newQuiz.questions.map((q, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {index + 1}. {q.question}
                              </h4>
                              <p className="text-sm text-green-600 mt-1">
                                Correct: {q.options[q.correctAnswer]}
                              </p>
                            </div>
                            <button
                              onClick={() => removeQuestion(index)}
                              className="text-red-600 hover:text-red-800 ml-2"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateQuiz}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FaSave />
                    <span>Create Quiz</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quiz Modal */}
      {showEditModal && editingQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Quiz: {editingQuiz.title}
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Quiz Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      value={editQuizData.title}
                      onChange={(e) => setEditQuizData(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field"
                      placeholder="Enter quiz title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={editQuizData.difficulty}
                      onChange={(e) => setEditQuizData(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="input-field"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editQuizData.description}
                      onChange={(e) => setEditQuizData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field"
                      rows={3}
                      placeholder="Enter quiz description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={editQuizData.timeLimit}
                      onChange={(e) => setEditQuizData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                      className="input-field"
                      min="1"
                    />
                  </div>
                </div>

                {/* Add Question */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add Question
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Question
                      </label>
                      <input
                        type="text"
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                        className="input-field"
                        placeholder="Enter question"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Option {index + 1}
                            {index === currentQuestion.correctAnswer && (
                              <span className="text-green-600 ml-2">(Correct)</span>
                            )}
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...currentQuestion.options]
                                newOptions[index] = e.target.value
                                setCurrentQuestion(prev => ({ ...prev, options: newOptions }))
                              }}
                              className="input-field flex-1"
                              placeholder={`Option ${index + 1}`}
                            />
                            <button
                              onClick={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                              className={`px-3 py-2 rounded-lg ${
                                index === currentQuestion.correctAnswer
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              ✓
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addEditQuestion}
                      className="btn-secondary"
                    >
                      Add Question
                    </button>
                  </div>
                </div>

                {/* Questions List */}
                {editQuizData.questions.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Questions ({editQuizData.questions.length})
                    </h3>
                    <div className="space-y-3">
                      {editQuizData.questions.map((q, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {index + 1}. {q.question}
                              </h4>
                              <p className="text-sm text-green-600 mt-1">
                                Correct: {q.options[q.correctAnswer]}
                              </p>
                            </div>
                            <button
                              onClick={() => removeEditQuestion(index)}
                              className="text-red-600 hover:text-red-800 ml-2"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateQuiz}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FaSave />
                    <span>Update Quiz</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel