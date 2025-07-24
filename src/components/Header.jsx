import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { FaSun, FaMoon, FaQuestionCircle, FaCog, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'
import logo from "../../public/coderitlogo.png"

const Header = () => {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout, loading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      setIsMobileMenuOpen(false) // Close mobile menu after logout
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={closeMobileMenu}>
            <div className="rounded-lg shadow-md group-hover:shadow-lg">
              <img className="text-white h-8 sm:h-10" src={logo}/>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold gradient-text">
              Quiz
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
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

            {/* User Info & Logout - Desktop */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <FaUser className="text-sm" />
                  <span className="text-sm font-medium truncate max-w-32">{user.name || user.email}</span>
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

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FaSun className="text-yellow-500 text-sm" />
              ) : (
                <FaMoon className="text-gray-700 text-sm" />
              )}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-sm" />
              ) : (
                <FaBars className="text-sm" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Home
              </Link>
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center space-x-2 font-medium py-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaCog className="text-sm" />
                <span>Admin</span>
              </Link>

              {/* User Info & Logout - Mobile */}
              {user && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 py-2 px-2">
                    <FaUser className="text-sm" />
                    <span className="text-sm font-medium">{user.name || user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full flex items-center space-x-2 py-2 px-2 mt-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header