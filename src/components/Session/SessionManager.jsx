import React from 'react'
import { auth } from '../../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

// Support test overrides via localStorage keys:
// localStorage.setItem('session_test_ten_ms', '10000')
// localStorage.setItem('session_test_two_ms', '5000')
const TEN_MIN_DEFAULT = 10 * 60 * 1000
const TWO_MIN_DEFAULT = 2 * 60 * 1000

function getDurations(){
  const ten = parseInt(localStorage.getItem('session_test_ten_ms') || '0', 10)
  const two = parseInt(localStorage.getItem('session_test_two_ms') || '0', 10)
  return {
    TEN_MS: !Number.isNaN(ten) && ten > 0 ? ten : TEN_MIN_DEFAULT,
    TWO_MS: !Number.isNaN(two) && two > 0 ? two : TWO_MIN_DEFAULT,
  }
}

function getKeys(uid){
  return {
    expiryKey: `session_expiry_${uid}`,
    graceKey: `session_grace_${uid}`,
  }
}

export default function SessionManager(){
  const [user, setUser] = React.useState(auth.currentUser)
  const [showPrompt, setShowPrompt] = React.useState(false)
  const [countdownMs, setCountdownMs] = React.useState(0)

  React.useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=> setUser(u || null))
    return ()=> unsub()
  },[])

  React.useEffect(()=>{
    if(!user){ setShowPrompt(false); setCountdownMs(0); return }
    const { expiryKey, graceKey } = getKeys(user.uid)
    const { TEN_MS, TWO_MS } = getDurations()

    // Initialize expiry if missing
    const now = Date.now()
    let expiry = parseInt(localStorage.getItem(expiryKey) || '0', 10)
    if(!expiry || Number.isNaN(expiry)){
      expiry = now + TEN_MS
      localStorage.setItem(expiryKey, String(expiry))
      localStorage.removeItem(graceKey)
    }

    const interval = setInterval(()=>{
      const current = Date.now()
      let exp = parseInt(localStorage.getItem(expiryKey) || '0', 10)
      let grace = parseInt(localStorage.getItem(graceKey) || '0', 10)

      if(current < exp){
        // Before expiry
        setShowPrompt(false)
        setCountdownMs(exp - current)
        return
      }

      // At/after expiry → start grace window if not set
      if(!grace || Number.isNaN(grace)){
        grace = exp + TWO_MS
        localStorage.setItem(graceKey, String(grace))
      }

      if(current < grace){
        setShowPrompt(true)
        setCountdownMs(grace - current)
      }else{
        // Grace elapsed → sign out
        clearInterval(interval)
        localStorage.removeItem(expiryKey)
        localStorage.removeItem(graceKey)
        signOut(auth)
      }
    }, 250) // faster tick so short test windows work reliably

    return ()=> clearInterval(interval)
  },[user])

  const extendSession = ()=>{
    if(!user) return
    const { expiryKey, graceKey } = getKeys(user.uid)
    const { TEN_MS } = getDurations()
    const newExpiry = Date.now() + TEN_MS
    localStorage.setItem(expiryKey, String(newExpiry))
    localStorage.removeItem(graceKey)
    setShowPrompt(false)
  }

  if(!user) return null

  const seconds = Math.max(0, Math.floor(countdownMs / 1000))

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      {showPrompt ? (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 shadow">
          <div className="text-sm text-amber-900">Session expiring soon. Extend 10 minutes?</div>
          <div className="text-xs text-amber-800">Auto logout in {seconds}s</div>
          <button onClick={extendSession} className="px-3 py-1.5 rounded bg-amber-600 text-white hover:bg-amber-700">Extend</button>
        </div>
      ) : (
        <div className="pointer-events-none select-none text-[0px]" aria-hidden>\u200b</div>
      )}
    </div>
  )
}
