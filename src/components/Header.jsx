import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { FaSun, FaMoon, FaQuestionCircle, FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa'
import logo from "../../public/coderitlogo.png"

const Header = () => {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="rounded-lg shadow-md group-hover:shadow-lg">
              <img className="text-white h-10" src={logo}/>
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              Quiz
            </h1>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/admin"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center space-x-2 font-medium"
            >
              <FaCog className="text-sm" />
              <span>Admin</span>
            </Link>

            {/* User Info & Logout */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <FaUser className="text-sm" />
                  <span className="text-sm font-medium">{user.name || user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FaSun className="text-yellow-500" />
              ) : (
                <FaMoon className="text-gray-700" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header