import React, { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';

export default function Checkout(){
  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState('');
  const handlePlaceOrder = async () => {
    if (!user) return setStatus('Please login to place order.');
    try {
      const shippingAddress = { addressLine1: 'Demo address', city: 'City', state: 'State', postalCode: '000000', country: 'Country' };
      const { data } = await API.post('/orders', { shippingAddress, paymentMethod: 'COD' });
      setStatus('Order placed. ID: ' + data._id);
    } catch (err) {
      setStatus('Failed to place order');
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="bg-white p-4 border">
        <p>Items: {cart?.items?.length || 0}</p>
        <button onClick={handlePlaceOrder} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Place Order</button>
        {status && <p className="mt-2">{status}</p>}
      </div>
    </div>
  );
}
