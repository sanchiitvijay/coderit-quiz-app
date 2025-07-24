import React from 'react'

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderCardSkeleton = () => (
    <div className="quiz-card p-6 animate-pulse">
      <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="flex space-x-2 mt-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-primary-300 dark:bg-primary-700 rounded-full w-16"></div>
        </div>
        <div className="flex space-x-2 mt-6">
          <div className="h-10 bg-primary-300 dark:bg-primary-700 rounded flex-1"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
        </div>
      </div>
    </div>
  )

  const renderListSkeleton = () => (
    <div className="quiz-card p-6 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="flex space-x-4">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )

  const renderFormSkeleton = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
        <div className="h-10 bg-primary-300 dark:bg-primary-700 rounded w-32"></div>
      </div>
      
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="quiz-card p-6 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderQuizSkeleton = () => (
    <div className="max-w-4xl mx-auto">
      <div className="quiz-card p-8 animate-pulse">
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
        
        <div className="space-y-6">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
          
          <div className="flex justify-between mt-8">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-10 bg-primary-300 dark:bg-primary-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  )

  const skeletons = {
    card: renderCardSkeleton,
    list: renderListSkeleton,
    form: renderFormSkeleton,
    quiz: renderQuizSkeleton,
  }

  const SkeletonComponent = skeletons[type] || renderCardSkeleton

  if (type === 'form' || type === 'quiz') {
    return <SkeletonComponent />
  }

  return (
    <div className={`grid gap-6 ${type === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  )
}

export default LoadingSkeleton