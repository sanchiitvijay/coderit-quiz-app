import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppwriteProvider } from './contexts/AppwriteContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import ResultsPage from './pages/ResultsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import AdminPanel from './pages/AdminPanel'

function App() {
  return (
    <ThemeProvider>
      <AppwriteProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col gradient-bg">
              <Header />
              <main className="flex-1 container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/quiz/:id" element={<QuizPage />} />
                  <Route path="/results/:id" element={<ResultsPage />} />
                  <Route path="/leaderboard/:id" element={<LeaderboardPage />} />
                  <Route path="/admin" element={<AdminPanel />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </AppwriteProvider>
    </ThemeProvider>
  )
}

export default App