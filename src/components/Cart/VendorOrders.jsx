import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { useNavigate } from 'react-router-dom'

export default function VendorOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const user = auth.currentUser
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        setLoading(true)
        let phonenumber = user.email.split('@')[0]
        const q = query(
          collection(db, 'orders'),
          where('vendor.phone', '==', phonenumber),
          orderBy('createdAt', 'desc')
        )
        const snap = await getDocs(q)
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const totalOrders = orders.length

  const statusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-white border border-slate-200'
      case 'inprogress': return 'bg-yellow-50 border border-yellow-200'
      case 'completed': return 'bg-green-50 border border-green-200'
      default: return 'bg-white'
    }
  }

  // 🛒 Reorder Handler
  const handleReorder = async (order) => {
    try {
      if (!order.items || order.items.length === 0) {
        alert('No items found in this order.')
        return
      }

      const vendor = order.vendor
      for (const item of order.items) {
        await addDoc(collection(db, 'cart'), {
          vendor,
          name: item.name,
          qty: item.qty,
          price: item.price || 0,
          productId: item.id || null,
          createdAt: serverTimestamp(),
        })
      }

      alert('Items added to your cart successfully!')
      navigate('/cart') // 👈 Redirect to Cart page if it exists
    } catch (err) {
      console.error('Error reordering:', err)
      alert('Failed to reorder. Please try again.')
    }
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <h2 className="text-xl font-semibold text-center text-slate-800">My Orders</h2>

      {loading && <div className="text-center text-slate-500">Loading your orders...</div>}

      {!loading && totalOrders === 0 && (
        <div className="text-center text-slate-500 mt-10">No orders placed yet.</div>
      )}

      {!loading && totalOrders > 0 && (
        <>
          <div className="flex justify-between items-center bg-white shadow-sm p-3 rounded-xl">
            <div className="text-sm text-slate-700">
              You have placed <strong>{totalOrders}</strong> orders so far.
            </div>
            <div className="text-xs text-slate-500">
              {orders.filter(o => o.status !== 'completed').length} active orders
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {orders.map((o, idx) => (
              <div
                key={o.id}
                className={`p-4 rounded-xl shadow-sm ${statusColor(o.status)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-slate-800">
                      Order #{idx + 1}
                    </div>
                    <div className="text-xs text-slate-500">
                      Placed on:{' '}
                      {o.createdAt?.toDate
                        ? o.createdAt.toDate().toLocaleString()
                        : new Date(o.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm mt-1">
                      <span className="font-semibold">Items:</span>{' '}
                      {o.items?.map((i) => `${i.name} x${i.qty}`).join(', ') || '—'}
                    </div>
                    <div className="text-sm text-slate-600">
                      Est. Delivery:{' '}
                      {o.estimatedDelivery
                        ? new Date(o.estimatedDelivery).toLocaleString()
                        : '—'}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        o.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : o.status === 'inprogress'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {o.status}
                    </div>

                    {/* 🛒 Reorder button */}
                    {o.status === 'completed' && (
                      <button
                        onClick={() => handleReorder(o)}
                        className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-indigo-700 transition"
                      >
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
