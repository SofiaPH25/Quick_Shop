
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import CartItemCard from '../components/CartItemCard';

const CartPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart, getCartItemCount } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (currentUser) {
      navigate('/checkout');
    } else {
      // addToast('Please log in to proceed to checkout.', 'info'); // Handled by CartContext addToast
      navigate('/login?redirect=/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-semibold text-neutral-dark mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <Link to="/" className="px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary transition-colors text-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-dark mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-xl sticky top-24">
            <h2 className="text-2xl font-semibold text-neutral-dark mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({getCartItemCount()} items)</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <hr className="my-2 border-neutral" />
              <div className="flex justify-between text-xl font-bold text-neutral-dark">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-secondary transition-colors text-lg"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-4 text-accent hover:text-red-700 transition-colors py-2"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
    