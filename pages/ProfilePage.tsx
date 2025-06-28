
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Order } from '../types';
import { orderService } from '../services/orderService';
import Spinner from '../components/Spinner';

const ProfilePage: React.FC = () => {
  const { currentUser, isInitialized, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !currentUser) {
      navigate('/login?redirect=/profile');
    }
  }, [currentUser, isInitialized, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser) {
        setLoadingOrders(true);
        const userOrders = await orderService.getUserOrders(currentUser.id);
        // Sort orders by date, newest first
        userOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        setOrders(userOrders);
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isInitialized || (isInitialized && !currentUser)) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  }
  
  // currentUser is guaranteed to be non-null here due to the effect above
  if (!currentUser) return null; 

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-dark mb-4 md:mb-0">My Profile</h1>
            <button 
                onClick={handleLogout}
                className="px-6 py-2 bg-accent text-white rounded-md hover:bg-red-700 transition-colors"
            >
                Logout
            </button>
        </div>

        <div className="mb-8 p-6 border border-neutral rounded-lg bg-neutral-light">
          <h2 className="text-xl font-semibold text-neutral-dark mb-3">Personal Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium text-gray-700">Name:</span> {currentUser.name}</p>
            <p><span className="font-medium text-gray-700">Email:</span> {currentUser.email}</p>
            {/* Add more profile fields as needed, e.g., address (if stored) */}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-neutral-dark mb-6">Purchase History</h2>
          {loadingOrders ? (
            <Spinner />
          ) : orders.length === 0 ? (
            <p className="text-gray-600">You have no past orders.</p>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="p-4 border border-neutral rounded-lg shadow-sm bg-white">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <h3 className="text-lg font-semibold text-primary">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                  <div className="mb-2">
                    {order.items.map(item => (
                      <div key={item.productId} className="flex justify-between text-sm py-1">
                        <span>{item.productName} (x{item.quantity})</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-neutral-light">
                    <p className="text-sm text-gray-600">Status: <span className="font-medium text-green-600">{order.status}</span></p>
                    <p className="font-bold text-neutral-dark">Total: ${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
    