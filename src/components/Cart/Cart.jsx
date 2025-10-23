import React, { useState, useEffect } from 'react'
import { 
  collection, addDoc, serverTimestamp, doc, getDoc, 
  getDocs, query, where, deleteDoc 
} from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { Trash2 } from 'lucide-react'

export default function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const user = auth.currentUser

  // 🔹 Load cart from Firestore + localStorage
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true)
      try {
        let localCart = JSON.parse(localStorage.getItem('cart') || '[]')

        if (user) {
          const phonenumber = user.email.split('@')[0]
          const q = query(collection(db, 'cart'), where('vendor.phone', '==', phonenumber))
          const snap = await getDocs(q)
          const firestoreCart = snap.docs.map(d => ({ id: d.id, ...d.data() }))

          // merge local + firestore (avoid duplicates)
          const merged = [...localCart]
          firestoreCart.forEach(item => {
            const idx = merged.findIndex(i => i.name === item.name)
            if (idx > -1) merged[idx].qty += item.qty
            else merged.push(item)
          })
          setCart(merged)
        } else {
          setCart(localCart)
        }
      } catch (err) {
        console.error('Error loading cart:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [user])

  const total = cart.reduce((s, i) => s + (i.price || 0) * i.qty, 0)

  // 🔹 Remove item handler
  const removeItem = async (index) => {
    const item = cart[index]
    const updated = cart.filter((_, i) => i !== index)
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))

    // Remove from Firestore if it exists
    if (user) {
      try {
        const phonenumber = user.email.split('@')[0]
        const q = query(
          collection(db, 'cart'),
          where('vendor.phone', '==', phonenumber),
          where('name', '==', item.name)
        )
        const snap = await getDocs(q)
        snap.forEach(async (d) => {
          await deleteDoc(doc(db, 'cart', d.id))
        })
      } catch (err) {
        console.error('Error deleting item from Firestore:', err)
      }
    }
  }

  // 🔹 Place Order Handler
  const placeOrder = async () => {
    if (!user) return alert('Please login')
    if (cart.length === 0) return alert('Cart is empty')

    const estimated = new Date()
    estimated.setDate(estimated.getDate() + 3)

    const uid = user.uid
    let vendorProfile = null

    try {
      const vRef = doc(db, 'vendors', uid)
      const vSnap = await getDoc(vRef)
      vendorProfile = vSnap.exists() ? vSnap.data() : null
    } catch (err) {
      console.error('Error fetching vendor profile:', err)
    }

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

    try {
      await addDoc(collection(db, 'orders'), order)

      // clear Firestore cart entries
      const phonenumber = vendorProfile?.phone || (user.email?.split('@')[0] ?? '')
      const q = query(collection(db, 'cart'), where('vendor.phone', '==', phonenumber))
      const snap = await getDocs(q)
      const deletions = snap.docs.map(d => deleteDoc(doc(db, 'cart', d.id)))
      await Promise.all(deletions)

      // clear local storage
      localStorage.removeItem('cart')
      setCart([])

      alert(`Order placed successfully! Estimated delivery: ${estimated.toDateString()}`)
    } catch (err) {
      console.error('Error placing order:', err)
      alert('Failed to place order. Please try again.')
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="font-semibold text-lg">Cart</h2>

      {loading ? (
        <div className="text-center text-slate-500">Loading your cart...</div>
      ) : cart.length === 0 ? (
        <div>No items in your cart</div>
      ) : (
        <div className="space-y-3">
          {cart.map((c, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <div className="font-medium text-slate-800">{c.name}</div>
                <div className="text-xs text-slate-500">Qty: {c.qty}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-semibold text-slate-700">
                  ₹{(c.price || 0) * c.qty}
                </div>
                <button
                  onClick={() => removeItem(idx)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between font-bold text-slate-700 pt-2">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <button
            onClick={placeOrder}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  )
}
