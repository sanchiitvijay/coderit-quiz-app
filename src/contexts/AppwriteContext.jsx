import React, { createContext, useContext, useState } from 'react'
import { databases, storage, ID, appwriteConfig } from '../utils/appwrite'
import { Query } from 'appwrite'

const AppwriteContext = createContext()

export const useAppwrite = () => {
  const context = useContext(AppwriteContext)
  if (!context) {
    throw new Error('useAppwrite must be used within an AppwriteProvider')
  }
  return context
}

export const AppwriteProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Quiz operations
  const getQuizzes = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.quizzes,
        [Query.orderDesc('$createdAt')]
      )
      return response.documents
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getQuiz = async (quizId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.quizzes,
        quizId
      )
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createQuiz = async (quizData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.quizzes,
        ID.unique(),
        {
          ...quizData,
          createdAt: new Date().toISOString()
        }
      )
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateQuiz = async (quizId, quizData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.quizzes,
        quizId,
        quizData
      )
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteQuiz = async (quizId) => {
    setLoading(true)
    setError(null)
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.quizzes,
        quizId
      )
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Question operations
  const getQuestions = async (quizId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.questions,
        [Query.equal('quiz_id', quizId)]
      )
      return response.documents
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createQuestion = async (questionData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.questions,
        ID.unique(),
        questionData
      )
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateQuestion = async (questionId, questionData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.questions,
        questionId,
        questionData
      )
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteQuestion = async (questionId) => {
    setLoading(true)
    setError(null)
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.questions,
        questionId
      )
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteQuestionsByQuizId = async (quizId) => {
    setLoading(true)
    setError(null)
    try {
      const questions = await getQuestions(quizId)
      for (const question of questions) {
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.questions,
          question.$id
        )
      }
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Result operations
  const getResults = async (quizId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.results,
        [
          Query.equal('quiz_id', quizId),
          Query.orderDesc('percentage'),
          Query.orderAsc('time_taken')
        ]
      )
      return response.documents
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createResult = async (resultData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.results,
        ID.unique(),
        {
          ...resultData,
          timestamp: new Date().toISOString()
        }
      )
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteResult = async (resultId) => {
    setLoading(true)
    setError(null)
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.results,
        resultId
      )
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteResultsByQuizId = async (quizId) => {
    setLoading(true)
    setError(null)
    try {
      const results = await getResults(quizId)
      for (const result of results) {
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.results,
          result.$id
        )
      }
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // File operations
  const uploadFile = async (file) => {
    setLoading(true)
    setError(null)
    try {
      const response = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        file
      )
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    loading,
    error,
    databases,
    storage,
    appwriteConfig,
    // Quiz operations
    getQuizzes,
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    // Question operations
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    deleteQuestionsByQuizId,
    // Result operations
    getResults,
    createResult,
    deleteResult,
    deleteResultsByQuizId,
    // File operations
    uploadFile
  }

  return (
    <AppwriteContext.Provider value={value}>
      {children}
    </AppwriteContext.Provider>
  )
}