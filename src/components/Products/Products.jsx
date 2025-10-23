// 



import React, { useEffect, useState } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import ProductCard from './ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [quantities, setQuantities] = useState({})
  const [vendor, setVendor] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const user = auth.currentUser

  // Load products
  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, 'products'))
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    load()
  }, [])

  // Load vendor info
  useEffect(() => {
    const fetchVendor = async () => {
      if (!user) return
      try {
        const vRef = doc(db, 'vendors', user.uid)
        const vSnap = await getDoc(vRef)
        if (vSnap.exists()) setVendor(vSnap.data())
      } catch (err) {
        console.error('Error loading vendor:', err)
      }
    }
    fetchVendor()
  }, [user])

  const handleLogout = async () => {
    await signOut(auth)
    window.location.href = '/login'
  }

  const handleQtyChange = (id, qty) => {
    setQuantities(prev => ({ ...prev, [id]: qty }))
  }

  const addAllToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const updated = [...cart]
    products.forEach(p => {
      const qty = quantities[p.id] || 0
      if (qty > 0) {
        const existing = updated.find(c => c.id === p.id)
        if (existing) existing.qty += qty
        else updated.push({ id: p.id, name: p.name, price: p.price, qty, color: p.color })
      }
    })
    localStorage.setItem('cart', JSON.stringify(updated))
    alert('All selected products added to cart!')
  }

  return (
    <div className="pb-24 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-white py-3 z-10 shadow-sm px-2">
        <h2 className="text-lg font-semibold text-slate-800">Available Sponges</h2>

        <div className="flex items-center gap-3 relative">
          {vendor && (
            <div
              className="text-sm text-slate-700 cursor-pointer relative select-none"
              onClick={() => setShowProfile(!showProfile)}
              onMouseEnter={() => setShowProfile(true)}
              onMouseLeave={() => setShowProfile(false)}
            >
              <div>Signed in as:</div>
              <div className="font-medium text-indigo-700">
                {vendor.owner || 'Vendor'}
              </div>

              {/* Dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg text-sm z-20 p-3 space-y-1">
                  <div><span className="font-medium">Phone:</span> {vendor.phone || '—'}</div>
                  <div><span className="font-medium">Hardware:</span> {vendor.hardware || '—'}</div>
                  <div><span className="font-medium">Owner:</span> {vendor.owner || '—'}</div>
                </div>
              )}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-2">
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            qty={quantities[p.id] || 0}
            onQtyChange={handleQtyChange}
          />
        ))}
      </div>

      {/* Fixed Bottom Add to Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex justify-center">
        <button
          onClick={addAllToCart}
          className="w-full max-w-sm py-3 rounded-xl bg-indigo-600 text-white font-medium text-lg hover:bg-indigo-700"
        >
          Add All Selected to Cart
        </button>
      </div>
    </div>
  )
}
