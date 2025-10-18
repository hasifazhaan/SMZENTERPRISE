import React, {useState} from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [phone,setPhone]=useState('')
  const [password,setPassword]=useState('')
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    if(!phone || !password) {
      alert('Please fill all fields')
      return
    }
    try{
      const email = `${phone}@sponge.local`
      await signInWithEmailAndPassword(auth,email,password)
      navigate('/products')
    }catch(err){ alert(err.message) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 items-center w-full">
        {/* Left Panel - Branding */}
        <div className="hidden lg:block bg-gradient-to-br from-teal-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <div className="text-sm font-medium opacity-90">Welcome back to</div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto lg:mx-0">
                <span className="text-2xl">🧽</span>
              </div>
              <h1 className="text-3xl font-bold">SMZ Enterprise</h1>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Access your vendor dashboard and manage your sponge orders efficiently. 
              Your business, simplified.
            </p>
            <div className="text-xs opacity-75">
              <div>CREATOR HERE</div>
              <div>DESIGNER HERE</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={()=>navigate('/')} 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h2>
          
          <form onSubmit={submit} className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                value={phone} 
                onChange={e=>setPhone(e.target.value)} 
                placeholder="Enter your phone number" 
                className="w-full p-3 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-colors" 
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                placeholder="Enter your password" 
                type="password" 
                className="w-full p-3 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-colors" 
                required
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Sign In
              </button>
              <button 
                type="button" 
                onClick={()=>navigate('/register')} 
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
