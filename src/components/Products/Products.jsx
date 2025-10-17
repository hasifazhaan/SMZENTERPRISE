import React, {useEffect, useState} from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import ProductCard from './ProductCard'

export default function Products(){
  const [products, setProducts] = useState([])
  const user = auth.currentUser

  useEffect(()=>{
    const load = async ()=>{
      const snap = await getDocs(collection(db,'products'))
      setProducts(snap.docs.map(d=>({id:d.id, ...d.data()})))
    }
    load()
  },[])

  const handleLogout = async ()=>{
    await signOut(auth)
    window.location.href = '/login'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Available Sponges</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-600">{user ? `Signed in as ${user.email}` : ''}</div>
          <button onClick={handleLogout} className="px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50">Logout</button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {products.map(p=> <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
