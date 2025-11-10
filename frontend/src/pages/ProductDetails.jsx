import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { CartContext } from '../contexts/CartContext';

export default function ProductDetails(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(()=> {
    API.get(`/products/${id}`).then(res=> setProduct(res.data)).catch(()=>{});
  }, [id]);

  if (!product) return <div>Loading...</div>;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <img src={product.images && product.images[0] || 'https://via.placeholder.com/400'} alt={product.title} />
      </div>
      <div>
        <h2 className="text-2xl font-bold">{product.title}</h2>
        <p className="mt-2">${product.price}</p>
        <p className="mt-4">{product.description}</p>
        <button onClick={()=> addToCart(product._id, 1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Add to cart</button>
      </div>
    </div>
  );
}
