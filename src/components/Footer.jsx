import React from 'react'
import { FaHeart } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="footer-gradient text-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center space-x-1 text-gray-300">
            <span>Made with</span>
            <FaHeart className="text-red-400 text-xs" />
            <span>by CodeRIT Team</span>
          </div>
          <div className="text-gray-400 mt-2 md:mt-0">
            © 2025 CodeRIT. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer