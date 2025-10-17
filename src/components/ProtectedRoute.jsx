import React from 'react'
import { Navigate } from 'react-router-dom'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function ProtectedRoute({children}){
  const [ready, setReady] = React.useState(false)
  const [user, setUser] = React.useState(auth.currentUser)

  React.useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{
      setUser(u || null)
      setReady(true)
    })
    return ()=> unsub()
  },[])

  if(!ready) return null
  if(!user) return <Navigate to="/login" replace />
  return children
}
