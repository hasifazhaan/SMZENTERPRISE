import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Home(){
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Section - Brand and CTA */}
        <div className="text-center lg:text-left space-y-6">
          {/* Brand Logo/Name */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600 tracking-wide">SMZ</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="block">SMZ</span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Enterprise
              </span>
            </h1>
          </div>
          
          {/* Tagline */}
          <p className="text-lg sm:text-xl text-gray-700 max-w-md mx-auto lg:mx-0">
            Sponge ordering for hardware stores. Fast, simple, reliable.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={()=>navigate('/register')} 
              className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Register
            </button>
            <button 
              onClick={()=>navigate('/login')} 
              className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              Login
            </button>
          </div>
          
          {/* Admin Link */}
          <div className="pt-4">
            <Link 
              to="/admin" 
              className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              Admin Panel →
            </Link>
          </div>
        </div>
        
        {/* Right Section - Visual Element */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Floating Product Cards */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-teal-200 to-teal-300 rounded-2xl transform rotate-12 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
            <div className="absolute top-20 right-0 w-24 h-24 bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl transform -rotate-12 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
            <div className="absolute bottom-0 left-1/4 w-28 h-28 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl transform rotate-6 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}></div>
            
            {/* Main Product Visual */}
            <div className="relative z-10 w-80 h-80 mx-auto">
              <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-purple-400 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-2xl">🧽</span>
                  </div>
                  <div className="text-gray-600 font-medium">Premium Sponges</div>
                  <div className="text-sm text-gray-500">Bulk Ordering</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
