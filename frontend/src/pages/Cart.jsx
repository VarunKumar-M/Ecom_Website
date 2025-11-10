import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage(){
  const { cart, removeItem } = useContext(CartContext);
  const items = cart?.items || [];
  const subtotal = items.reduce((s,i)=> s + i.qty * i.price, 0).toFixed(2);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <div>Your cart is empty. <Link to='/'>Go shopping</Link></div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {items.map(i => (
              <div key={i.product._id} className="flex items-center justify-between p-3 bg-white border mb-2">
                <div className="flex items-center gap-3">
                  <img src={i.product.images && i.product.images[0] || 'https://via.placeholder.com/80'} alt={i.product.title} className="w-20"/>
                  <div>
                    <div className="font-semibold">{i.product.title}</div>
                    <div>Qty: {i.qty}</div>
                  </div>
                </div>
                <div>
                  <div>${(i.price * i.qty).toFixed(2)}</div>
                  <button onClick={()=> removeItem(i.product._id)} className="text-sm text-red-600 mt-2">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white border">
            <h2 className="font-semibold">Order Summary</h2>
            <p className="mt-2">Subtotal: ${subtotal}</p>
            <Link to='/checkout' className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}
