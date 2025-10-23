import React, { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore'
import { db } from '../../firebase'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ name: '', price: '', color: '', shortDescription: '', imageUrl: '' })

  useEffect(() => {
    loadOrders()
    loadProducts()
  }, [])

  const loadOrders = async () => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  const loadProducts = async () => {
    const snap = await getDocs(collection(db, 'products'))
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  const toggleComplete = async (order) => {
    const ref = doc(db, 'orders', order.id)
    const nextStatus =
      order.status === 'pending'
        ? 'inprogress'
        : order.status === 'inprogress'
        ? 'completed'
        : 'pending'
    await updateDoc(ref, { status: nextStatus })
    setOrders((o) =>
      o.map((x) =>
        x.id === order.id ? { ...x, status: nextStatus } : x
      )
    )
  }

  const addOrUpdateProduct = async () => {
    if (!form.name || !form.price) return alert('Name and price are required')
    const existing = products.find(p => p.name.toLowerCase() === form.name.toLowerCase())
    if (existing) {
      await updateDoc(doc(db, 'products', existing.id), form)
      alert('Product updated successfully!')
    } else {
      await addDoc(collection(db, 'products'), form)
      alert('Product added successfully!')
    }
    setForm({ name: '', price: '', color: '', shortDescription: '', imageUrl: '' })
    loadProducts()
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    await deleteDoc(doc(db, 'products', id))
    loadProducts()
  }

    // Filter + sort orders so completed ones go to bottom
    const filteredOrders = (() => {
      const sorted = [...orders].sort((a, b) => {
        const orderPriority = { placed: 1, pending: 1, inprogress: 1, completed: 3 }
        return (orderPriority[a.status] || 4) - (orderPriority[b.status] || 4)
      })
      if (filter === 'all') return sorted
      return sorted.filter(o => o.status === filter)
    })()
  

  const totalVendors = new Set(orders.map(o => o.vendor?.phone)).size

  const soldCount = orders.reduce((s, o) => {
    if (o.status === 'completed') {
      return s + (o.items?.reduce((a, i) => a + (i.qty || 0), 0) || 0)
    }
    return s
  }, 0)

  const statusColor = (status) => {
    switch (status) {
      case 'placed': return 'bg-white border border-slate-200'
      case 'pending': return 'bg-white border border-slate-200'
      case 'inprogress': return 'bg-yellow-50 border border-yellow-200'
      case 'completed': return 'bg-green-100 border border-green-500'
      default: return 'bg-white'
    }
  }

  

  return (
    <div className="p-3 space-y-4 pb-20">
      <h2 className="text-xl font-semibold text-slate-800 text-center">Admin Dashboard</h2>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {['orders', 'addProduct', 'deleteProduct'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap ${
              activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab === 'orders' && 'Orders'}
            {tab === 'addProduct' && 'Add / Edit Product'}
            {tab === 'deleteProduct' && 'Delete Product'}
          </button>
        ))}
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <div className="text-sm text-slate-700">Total Vendors: <strong>{totalVendors}</strong></div>
              <div className="text-sm text-slate-700">Total Goods Sold: <strong>{soldCount}</strong></div>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'inprogress', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-sm border ${
                    filter === f
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.map((o) => (
            <div
              key={o.id}
              className={`p-3 mb-3 rounded-xl shadow-sm ${statusColor(o.status)}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Hardware: {o.vendor?.hardware || '—'}</div>
                  <div className="text-sm text-gray-600">
                    Vendor: {o.vendor?.owner || '—'} ({o.vendor?.phone || '—'})
                  </div>
                  <div className="text-sm text-gray-600">Location: {o.vendor?.address || '—'}</div>
                  <div className="text-sm">
                    Items: {o.items?.map((i) => `${i.name} x${i.qty}`).join(', ')}
                  </div>
                  <div className="text-xs text-gray-500">
                    Est delivery:{' '}
                    {o.estimatedDelivery
                      ? new Date(o.estimatedDelivery).toLocaleString()
                      : '—'}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div
                    className={`text-xs font-semibold uppercase ${
                      o.status === 'completed'
                        ? 'text-green-700'
                        : o.status === 'inprogress'
                        ? 'text-yellow-700'
                        : 'text-slate-600'
                    }`}
                  >
                    {o.status}
                  </div>
                  <button
                    onClick={() => toggleComplete(o)}
                    className="px-3 py-1 rounded border border-slate-300 text-sm hover:bg-slate-50"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT PRODUCT TAB */}
      {activeTab === 'addProduct' && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-medium mb-3">Add or Edit Product</h3>
          <div className="grid gap-3">
            {['name', 'price', 'color', 'shortDescription', 'imageUrl'].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            ))}
            <button
              onClick={addOrUpdateProduct}
              className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Save Product
            </button>
          </div>
        </div>
      )}

      {/* DELETE PRODUCT TAB */}
      {activeTab === 'deleteProduct' && (
        <div className="bg-white p-3 rounded-xl shadow-md">
          <h3 className="text-lg font-medium mb-3">Delete Products</h3>
          <div className="space-y-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center border rounded-lg px-3 py-2"
              >
                <div className="text-sm">
                  {p.name} — ₹{p.price}
                </div>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
