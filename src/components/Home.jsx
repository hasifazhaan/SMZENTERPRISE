import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Home(){
  const navigate = useNavigate()
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-indigo-800 mb-2">Sponge Distributor</h2>
        <p className="text-sm text-indigo-700 mb-6">Bulk sponge ordering for hardware stores. Fast, simple, reliable.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={()=>navigate('/register')} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">Register</button>
          <button onClick={()=>navigate('/login')} className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition">Login</button>
          <Link to="/products" className="px-4 py-2 rounded-lg border border-indigo-300 text-indigo-800 hover:bg-white transition">Browse Products</Link>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <span className="opacity-70">Admin access:</span> <Link to="/admin" className="underline">Go to Admin Panel</Link>
      </div>
    </div>
  )
}
