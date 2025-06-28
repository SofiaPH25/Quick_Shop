
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import UserIcon from './icons/UserIcon';

const Navbar: React.FC = () => {
  const { currentUser, logout, isInitialized } = useAuth();
  const { getCartItemCount, addToast } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    addToast('Logged out successfully.', 'success');
    navigate('/');
  };

  return (
    <nav className="bg-neutral-dark text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary hover:text-secondary transition-colors">
          QuickShop
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-primary transition-colors">Catalog</Link>
          {isInitialized && currentUser ? (
            <>
              <Link to="/profile" className="hover:text-primary transition-colors flex items-center">
                <UserIcon className="w-5 h-5 mr-1" /> Profile
              </Link>
              <button onClick={handleLogout} className="hover:text-accent transition-colors">Logout</button>
            </>
          ) : isInitialized ? (
            <>
              <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="bg-primary hover:bg-secondary text-white px-3 py-1.5 rounded-md text-sm transition-colors">Register</Link>
            </>
          ) : null}
          <Link to="/cart" className="relative hover:text-primary transition-colors flex items-center">
            <ShoppingCartIcon className="w-6 h-6" />
            {getCartItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
    