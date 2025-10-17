import React, {useState, useEffect} from 'react'
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { auth } from '../../firebase'

export default function Cart(){
  const [cart, setCart] = useState([])
  useEffect(()=> setCart(JSON.parse(localStorage.getItem('cart')||'[]')), [])

  const placeOrder = async ()=>{
    if(!auth.currentUser) return alert('Please login')
    if(cart.length===0) return alert('Cart empty')
    const estimated = new Date()
    estimated.setDate(estimated.getDate()+3) // simple: deliver after 3 days

    // Load vendor profile to snapshot vendor details at order time
    const uid = auth.currentUser.uid
    let vendorProfile = null
    try{
      const vRef = doc(db,'vendors', uid)
      const vSnap = await getDoc(vRef)
      vendorProfile = vSnap.exists() ? vSnap.data() : null
    }catch(_e){ /* ignore and fallback */ }

    const order = {
      vendorId: uid,
      vendor: vendorProfile ? {
        uid,
        phone: vendorProfile.phone || '',
        owner: vendorProfile.owner || '',
        hardware: vendorProfile.hardware || '',
        address: vendorProfile.address || ''
      } : { uid },
      items: cart,
      createdAt: serverTimestamp(),
      estimatedDelivery: estimated.toISOString(),
      status: 'placed'
    }
    await addDoc(collection(db,'orders'), order)
    localStorage.removeItem('cart')
    setCart([])
    alert('Order placed. Estimated delivery: '+estimated.toDateString())
  }

  const total = cart.reduce((s,i)=> s + (i.price||0)*i.qty, 0)

  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="font-semibold">Cart</h2>
      {cart.length===0 ? <div>No items</div> : (
        <div className="space-y-2">
          {cart.map((c,idx)=> (
            <div key={idx} className="flex justify-between">
              <div>{c.name} x {c.qty}</div>
              <div>₹{(c.price||0)*c.qty}</div>
            </div>
          ))}
          <div className="flex justify-between font-bold">Total <div>₹{total}</div></div>
          <button onClick={placeOrder} className="w-full p-2 bg-blue-600 text-white rounded">Place bulk order</button>
        </div>
      )}
    </div>
  )
}
