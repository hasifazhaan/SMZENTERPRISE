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
    try{
      const email = `${phone}@sponge.local`
      await signInWithEmailAndPassword(auth,email,password)
      navigate('/products')
    }catch(err){ alert(err.message) }
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
      <h2 className="font-semibold">Vendor Login</h2>
      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" className="w-full p-2 border" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border" />
      <div className="flex justify-between">
        <button className="px-4 py-2 bg-green-600 text-white rounded">Login</button>
        <a href="/register" className="underline">Register</a>
      </div>
    </form>
  )
}
