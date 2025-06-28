
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { ToastContainer } from './components/Toast';
import { useCart } from './hooks/useCart'; // To access toasts
import { useAuth } from './hooks/useAuth'; // To access currentUser for protected routes

// Helper component for Protected Routes
interface ProtectedRouteProps {
  children: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isInitialized } = useAuth();
  
  if (!isInitialized) {
    // Optionally, show a global loading spinner while auth state is initializing
    return <div className="flex justify-center items-center h-screen">Loading authentication...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};


const AppContent: React.FC = () => {
  // useCart hook must be used inside CartProvider
  const { toasts, dismissToast } = useCart();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-confirmation" 
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            } 
          />
          {/* Fallback for any unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer messages={toasts} onDismiss={dismissToast} />
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider> {/* CartProvider needs to be inside AuthProvider if it uses auth data, but here it's fine */}
          <HashRouter>
            <AppContent />
          </HashRouter>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
    