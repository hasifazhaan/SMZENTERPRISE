import React, {useEffect, useState} from 'react'
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'

export default function AdminPanel(){
  const [orders, setOrders] = useState([])
  useEffect(()=>{
    const load = async ()=>{
      const q = query(collection(db,'orders'), orderBy('createdAt','desc'))
      const snap = await getDocs(q)
      setOrders(snap.docs.map(d=>({id:d.id, ...d.data()})))
    }
    load()
  },[])

  const toggleComplete = async (order)=>{
    const ref = doc(db,'orders',order.id)
    await updateDoc(ref, { status: order.status==='completed' ? 'placed' : 'completed' })
    setOrders(o=> o.map(x=> x.id===order.id ? {...x, status: x.status==='completed' ? 'placed' : 'completed'} : x))
  }

  const soldCount = orders.reduce((s,o)=>{
    if(o.status==='completed'){
      return s + (o.items?.reduce((a,i)=> a + (i.qty||0),0) || 0)
    }
    return s
  },0)

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Admin Panel</h2>
      <div className="bg-white p-3 rounded shadow">
        <div className="mb-2">Total goods sold (completed orders): <strong>{soldCount}</strong></div>
        {orders.map(o=> (
          <div key={o.id} className="border p-2 mb-2 rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">Hardware: {o.vendor?.hardware || '—'}</div>
                <div className="text-sm text-gray-600">Vendor: {o.vendor?.owner || '—'} ({o.vendor?.phone || '—'})</div>
                <div className="text-sm text-gray-600">Location: {o.vendor?.address || '—'}</div>
                <div className="text-sm">Items: {o.items?.map(i=> `${i.name} x${i.qty}`).join(', ')}</div>
                <div className="text-sm">Est delivery: {o.estimatedDelivery ? new Date(o.estimatedDelivery).toLocaleString() : '—'}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="mb-2">Status: {o.status}</div>
                <button onClick={()=>toggleComplete(o)} className="px-3 py-1 border rounded">Toggle complete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
