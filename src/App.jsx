import React from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import Products from './components/Products/Products'
import Cart from './components/Cart/Cart'
import AdminPanel from './components/Admin/AdminPanel'
import About from './components/About'
import ProtectedRoute from './components/ProtectedRoute'
import DevTools from './components/Dev/DevTools'
import Home from './components/Home'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import SessionManager from './components/Session/SessionManager'

function NavItem({ to, children }){
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative inline-flex items-center px-2 py-1 rounded-md transition-colors ${
          isActive
            ? 'font-semibold text-indigo-700'
            : 'text-slate-600 hover:text-slate-900'
        }`
      }
    >
      <span className="relative">
        {children}
        <span className="pointer-events-none absolute left-0 -bottom-0.5 h-0.5 w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
      </span>
    </NavLink>
  )
}

export default function App(){
  const [currentUser, setCurrentUser] = React.useState(auth.currentUser)
  const location = useLocation()
  React.useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=> setCurrentUser(u || null))
    return ()=> unsub()
  },[])

  const showHeader = currentUser && location.pathname !== '/'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {currentUser && <SessionManager/>}
      {showHeader && (
        <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-900">Sponge Distributor</h1>
            <nav className="space-x-3 flex items-center">
              <div className="group"><NavItem to="/">Home</NavItem></div>
              <div className="group"><NavItem to="/products">Products</NavItem></div>
              <div className="group"><NavItem to="/cart">Cart</NavItem></div>
              <div className="group"><NavItem to="/about">About</NavItem></div>
              <div className="group opacity-70"><NavItem to="/dev">Dev</NavItem></div>
            </nav>
          </div>
        </header>
      )}

      <main className="max-w-5xl mx-auto p-4 animate-[fadeIn_250ms_ease]">
        <Routes>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/products" element={<ProtectedRoute><Products/></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>} />
          <Route path="/admin" element={<AdminPanel/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/dev" element={<DevTools/>} />
          <Route path="/" element={<Home/>} />
        </Routes>
      </main>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(2px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}
