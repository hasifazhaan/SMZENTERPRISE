import React, {useState} from 'react'

export default function ProductCard({product}){
  const [qty,setQty]=useState(0)

  const addToCart = ()=>{
    const cart = JSON.parse(localStorage.getItem('cart')||'[]')
    if(qty<=0) return alert('Add quantity')
    const existing = cart.find(c=>c.id===product.id)
    if(existing) existing.qty += qty
    else cart.push({id:product.id, name:product.name, price:product.price, qty, color:product.color})
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart')
    setQty(0)
  }

  const increment = ()=> setQty(q=> Math.min((q||0)+1, 999))
  const decrement = ()=> setQty(q=> Math.max((q||0)-1, 0))

  return (
    <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-3 flex flex-col items-stretch aspect-square">
      <div className="flex-1">
        <div className="font-medium text-slate-900 truncate">{product.name}</div>
        <div className="text-xs text-slate-500 mb-2 truncate">{product.color} • {product.shortDescription}</div>
        <div className="text-sm font-semibold text-indigo-700">₹{product.price} / unit</div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button onClick={decrement} className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-50">−</button>
          <div className="min-w-8 text-center">{qty}</div>
          <button onClick={increment} className="h-8 w-8 rounded-lg border border-slate-200 hover:bg-slate-50">+</button>
        </div>
        <button onClick={addToCart} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Add</button>
      </div>
    </div>
  )
}
