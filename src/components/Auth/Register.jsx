import React, {useState} from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [phone,setPhone]=useState('')
  const [password,setPassword]=useState('')
  const [hardware,setHardware]=useState('')
  const [owner,setOwner]=useState('')
  const [address,setAddress]=useState('')
  const navigate = useNavigate()

  const askGeo = async ()=>{
    if(!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos)=>{
      const {latitude, longitude} = pos.coords
      setAddress(`lat:${latitude.toFixed(4)}, lng:${longitude.toFixed(4)}`)
    }, ()=>{})
  }

  React.useEffect(()=>{ askGeo() }, [])

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try{
      // make a synthetic email because firebase needs an email
      const email = `${phone}@sponge.local`
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCred.user.uid
      await setDoc(doc(db,'vendors',uid),{
        phone, hardware, owner, address, uid
      })
      navigate('/products')
    }catch(err){
      alert(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
      <h2 className="font-semibold">Vendor Registration</h2>
      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" className="w-full p-2 border" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border" />
      <input value={hardware} onChange={e=>setHardware(e.target.value)} placeholder="Hardware name" className="w-full p-2 border" />
      <input value={owner} onChange={e=>setOwner(e.target.value)} placeholder="Owner name" className="w-full p-2 border" />
      <div className="flex gap-2">
        <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Location (auto or manual)" className="flex-1 p-2 border" />
        <button type="button" onClick={askGeo} className="p-2 border">Use GPS</button>
      </div>
      <div className="flex justify-between">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Register</button>
        <a href="/login" className="underline">Already have account?</a>
      </div>
    </form>
  )
}
