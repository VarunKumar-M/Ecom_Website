import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }){
  return (
    <div className="border rounded p-4 bg-white">
      <div className="h-40 flex items-center justify-center">
        <img src={product.images && product.images[0] || 'https://via.placeholder.com/200'} alt={product.title} className="max-h-36" />
      </div>
      <h3 className="font-semibold mt-2">{product.title}</h3>
      <p className="mt-1">${product.price}</p>
      <Link to={`/product/${product._id}`} className="inline-block mt-2 text-sm text-blue-600">View</Link>
    </div>
  );
}
