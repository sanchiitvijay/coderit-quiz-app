import { useState, useEffect } from 'react'
import { useAppwrite } from '../contexts/AppwriteContext'

export const useQuiz = () => {
  const [quizzes, setQuizzes] = useState([])
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const { 
    getQuizzes, 
    getQuiz, 
    getQuestions, 
    getResults,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    deleteQuestionsByQuizId,
    createResult,
    deleteResult,
    deleteResultsByQuizId,
    loading 
  } = useAppwrite()

  const fetchQuizzes = async () => {
    try {
      const data = await getQuizzes()
      setQuizzes(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchQuiz = async (quizId) => {
    try {
      const quiz = await getQuiz(quizId)
      setCurrentQuiz(quiz)
      setError(null)
      return quiz
    } catch (err) {
      setError(err.message)
      return null
    }
  }

  const fetchQuestions = async (quizId) => {
    try {
      const data = await getQuestions(quizId)
      setQuestions(data)
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      return []
    }
  }

  const fetchResults = async (quizId) => {
    try {
      const data = await getResults(quizId)
      setResults(data)
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      return []
    }
  }

  const submitQuiz = async (quizId, answers, userInfo) => {
    try {
      const quiz = await getQuiz(quizId)
      const questionsData = await getQuestions(quizId)
      
      let score = 0
      const totalQuestions = questionsData.length
      
      // Calculate score
      questionsData.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          score += 1
        }
      })

      const percentage = Math.round((score / totalQuestions) * 100)
      
      const result = await createResult({
        quiz_id: quizId,
        user_name: userInfo.name,
        user_email: userInfo.email,
        score: score,
        total_questions: totalQuestions,
        percentage: percentage,
        answers: JSON.stringify(answers),
        time_taken: userInfo.timeTaken || 0
      })

      return { result, score, percentage, totalQuestions }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    quizzes,
    currentQuiz,
    questions,
    results,
    error,
    loading,
    fetchQuizzes,
    fetchQuiz,
    fetchQuestions,
    fetchResults,
    submitQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    deleteQuestionsByQuizId,
    deleteResult,
    deleteResultsByQuizId
  }
}