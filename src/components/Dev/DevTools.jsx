import React, { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function DevTools(){
  const [log, setLog] = useState([])
  const append = (msg)=> setLog((l)=> [...l, `[${new Date().toLocaleTimeString()}] ${msg}`])

  const seedProducts = async ()=>{
    try{
      const sample = [
        { name:'Blue Cleaning Sponge', color:'Blue', price:15, shortDescription:'Heavy-duty blue sponge for tough cleaning' },
        { name:'Green Scrub Sponge', color:'Green', price:12, shortDescription:'Balanced scrub suitable for kitchens' },
        { name:'Pink Soft Sponge', color:'Pink', price:10, shortDescription:'Soft finish for delicate surfaces' },
      ]
      for(const p of sample){
        await addDoc(collection(db,'products'), p)
      }
      append('Seeded sample products (3).')
    }catch(e){ append(`Seed products failed: ${e.message}`) }
  }

  const seedSyntheticOrders = async ()=>{
    try{
      const vendorId = auth.currentUser?.uid || 'demoVendor'
      const order = {
        vendorId,
        items: [
          { id:'p-blue', name:'Blue Cleaning Sponge', price:15, qty:4, color:'Blue' },
          { id:'p-green', name:'Green Scrub Sponge', price:12, qty:2, color:'Green' },
        ],
        createdAt: serverTimestamp(),
        estimatedDelivery: new Date(Date.now()+3*24*60*60*1000).toISOString(),
        status: 'placed'
      }
      await addDoc(collection(db,'orders'), order)
      append('Inserted one synthetic order. (Uses current user if signed in)')
    }catch(e){ append(`Seed order failed: ${e.message}`) }
  }

  const checkEmailPasswordEnabled = async ()=>{
    try{
      // Try a bogus sign-in. If provider disabled, Firebase returns auth/operation-not-allowed
      await signInWithEmailAndPassword(auth, '__check__@example.com', 'x')
    }catch(e){
      if(e?.code === 'auth/operation-not-allowed'){
        append('Email/Password provider appears DISABLED (enable in Firebase Console).')
      }else if(e?.code === 'auth/user-not-found' || e?.code === 'auth/invalid-credential' || e?.code === 'auth/wrong-password'){
        append('Email/Password provider appears ENABLED.')
      }else{
        append(`Check inconclusive: ${e.code || e.message}`)
      }
    }
  }

  return (
    <div className="space-y-3 bg-white p-4 rounded shadow">
      <h2 className="font-semibold">Developer Tools</h2>
      <div className="flex flex-wrap gap-2">
        <button onClick={seedProducts} className="px-3 py-2 border rounded">Seed Products</button>
        <button onClick={seedSyntheticOrders} className="px-3 py-2 border rounded">Seed Synthetic Order</button>
        <button onClick={checkEmailPasswordEnabled} className="px-3 py-2 border rounded">Check Email/Password Enabled?</button>
      </div>
      <div className="text-sm text-gray-700 whitespace-pre-wrap">
        {log.map((l, i)=> <div key={i}>{l}</div>)}
      </div>
    </div>
  )
}

