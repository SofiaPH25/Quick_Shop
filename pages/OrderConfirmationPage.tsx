
import React, { useEffect, useState }from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Order } from '../types';
import { orderService } from '../services/orderService';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';


const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId && currentUser) {
        setLoading(true);
        const userOrders = await orderService.getUserOrders(currentUser.id);
        const confirmedOrder = userOrders.find(o => o.id === orderId);
        setOrder(confirmedOrder || null);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, currentUser]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  }
  
  if (!orderId || !order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-accent mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find details for this order. It might have failed or the ID is incorrect.</p>
        <Link to="/" className="px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary transition-colors text-lg">
          Back to Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-neutral-dark mb-3">Thank You For Your Order!</h1>
        <p className="text-gray-600 mb-2">Your order <span className="font-semibold text-primary">#{order.id}</span> has been placed successfully.</p>
        <p className="text-gray-600 mb-6">A confirmation email has been sent to <span className="font-semibold text-neutral-dark">{currentUser?.email}</span> (simulated).</p>
        
        <div className="text-left border-t border-b border-neutral py-4 my-6">
            <h3 className="text-xl font-semibold text-neutral-dark mb-3">Order Summary</h3>
            {order.items.map(item => (
                <div key={item.productId} className="flex justify-between items-center py-1.5">
                    <span className="text-gray-700">{item.productName} (x{item.quantity})</span>
                    <span className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            ))}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-light font-bold text-neutral-dark">
                <span>Total Paid:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
            </div>
        </div>

        <p className="text-gray-600 mb-6">You can view your order history in your profile.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
                to="/profile" 
                className="px-6 py-3 bg-secondary text-white rounded-md hover:opacity-90 transition-opacity text-lg"
            >
                View My Orders
            </Link>
            <Link 
                to="/" 
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary transition-colors text-lg"
            >
                Continue Shopping
            </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
    