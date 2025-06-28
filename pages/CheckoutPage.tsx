
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { useProducts } from '../hooks/useProducts'; // To refresh products list after order
import Spinner from '../components/Spinner';

const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart, addToast } = useCart();
  const { currentUser } = useAuth();
  const { refreshProducts } = useProducts();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=/checkout');
    }
    if (cartItems.length === 0 && currentUser) {
      addToast('Your cart is empty. Add items to checkout.', 'info');
      navigate('/');
    }
  }, [currentUser, cartItems, navigate, addToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return; // Should not happen due to useEffect guard

    // Basic form validation
    for (const key in formData) {
      if (formData[key as keyof typeof formData].trim() === '') {
        addToast(`Please fill in all fields. Missing: ${key}`, 'error');
        return;
      }
    }
    // Simple validation for card details (length)
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        addToast('Card number must be 16 digits.', 'error');
        return;
    }
    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        addToast('Expiry date must be in MM/YY format.', 'error');
        return;
    }
    if (formData.cvv.length !== 3) {
        addToast('CVV must be 3 digits.', 'error');
        return;
    }


    setIsProcessing(true);
    try {
      // orderService.placeOrder will handle stock deduction via productService
      const order = await orderService.placeOrder(currentUser, cartItems, getCartTotal());
      if (order) {
        addToast('Order placed successfully!', 'success');
        clearCart();
        await refreshProducts(); // Refresh product list to reflect stock changes
        navigate(`/order-confirmation?orderId=${order.id}`);
      } else {
        addToast('Failed to place order. Payment might have failed or stock issue.', 'error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      addToast('An unexpected error occurred during checkout.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentUser) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>; // Or redirect
  }
  
  if (cartItems.length === 0) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-semibold">Your cart is empty.</h1>
            <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-secondary">
                Continue Shopping
            </button>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-dark mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white p-6 rounded-lg shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-2 border border-neutral rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full p-2 border border-neutral rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} required className="mt-1 block w-full p-2 border border-neutral rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input type="text" name="postalCode" id="postalCode" value={formData.postalCode} onChange={handleChange} required className="mt-1 block w-full p-2 border border-neutral rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">Payment Details (Simulated)</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                <input type="text" name="cardNumber" id="cardNumber" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleChange} required className="mt-1 block w-full p-2 border border-neutral rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date (MM/YY)</label>
                  <input type="text" name="expiryDate" id="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={handleChange} required className="mt-1 block w-full p-2 border border-neutral rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                  <input type="text" name="cvv" id="cvv" placeholder="123" value={formData.cvv} onChange={handleChange} required className="mt-1 block w-full p-2 border border-neutral rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                </div>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-secondary transition-colors text-lg disabled:bg-gray-400 flex items-center justify-center"
          >
            {isProcessing ? <Spinner size="sm" color="border-white"/> : `Pay $${getCartTotal().toFixed(2)}`}
          </button>
        </form>

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-xl sticky top-24">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">Order Summary</h2>
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-neutral-light">
                <div>
                  <p className="font-medium text-neutral-dark">{item.name} (x{item.quantity})</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                </div>
                <p className="font-semibold text-neutral-dark">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-neutral">
              <div className="flex justify-between text-lg font-bold text-neutral-dark">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
    
