import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';

export default function Header(){
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const totalItems = cart?.items?.reduce((s,i)=>s+i.qty,0) || 0;
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to='/' className="font-bold text-xl">ShopDemo</Link>
        <nav className="flex gap-4 items-center">
          <Link to='/cart'>Cart ({totalItems})</Link>
          {user ? (
            <>
              <span>{user.name}</span>
              <button onClick={logout} className="px-2 py-1 border rounded">Logout</button>
            </>
          ) : <Link to='/login'>Login</Link>}
        </nav>
      </div>
    </header>
  );
}
