import React from 'react'

export default function ProductCard({ product, qty, onQtyChange }) {
  const increment = () => onQtyChange(product.id, Math.min((qty || 0) + 1, 999))
  const decrement = () => onQtyChange(product.id, Math.max((qty || 0) - 1, 0))

  return (
    <div className="rounded-xl bg-white shadow-md border border-slate-100 p-3 flex flex-col items-stretch">
      <div className="flex-1 flex flex-col items-center">
        {/* Product Image */}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-32 w-full object-contain rounded-lg mb-2"
          />
        ) : (
          <div className="h-32 w-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm">
            No Image
          </div>
        )}

        {/* Product Info */}
        <div className="font-medium text-slate-900 text-center truncate">{product.name}</div>
        <div className=" font-medium  text-slate-500 text-center mb-1 truncate overflow-hidden">
          {/* {product.color} • <br></br> */}
          {product.shortDescription}
        </div>
        <div className="text-sm font-semibold text-indigo-700 mb-2 text-center">
          ₹{product.price} / Bundle
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="mt-auto flex items-center justify-center gap-3">
        <button
          onClick={decrement}
          className="h-8 w-8 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 font-bold text-lg"
        >
          −
        </button>
        <div className="min-w-8 text-center text-slate-800 font-medium">{qty}</div>
        <button
          onClick={increment}
          className="h-8 w-8 rounded-lg border border-green-300 text-green-600 hover:bg-green-50 font-bold text-lg"
        >
          +
        </button>
      </div>
    </div>
  )
}
