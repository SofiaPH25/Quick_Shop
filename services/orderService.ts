
import { Order, CartItem, User, OrderItem } from '../types';
import { productService } from './productService';
import { emailService } from './emailService';
import { getItem, setItem } from '../utils/localStorage';

const ORDERS_KEY_PREFIX = 'quickshop_orders_'; // Per user

// This is a placeholder for where more complex payment gateway integration would occur.
// For now, it's a simple simulation.
const simulatePaymentProcess = async (totalAmount: number): Promise<boolean> => {
  console.log(`Simulating payment for $${totalAmount.toFixed(2)}...`);
  // Simulate API delay for payment processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Simulate a successful payment
  const paymentSuccess = Math.random() > 0.1; // 90% success rate
  if (paymentSuccess) {
    console.log("Payment successful.");
    return true;
  } else {
    console.error("Payment failed (simulated).");
    return false;
  }
};


export const orderService = {
  placeOrder: async (user: User, cartItems: CartItem[], totalAmount: number): Promise<Order | null> => {
    // Technical Refactoring Note: This section could be refactored for better transaction management
    // in a real backend system (e.g., ensuring stock update and order creation are atomic).

    // 1. Simulate Payment
    const paymentSuccessful = await simulatePaymentProcess(totalAmount);
    if (!paymentSuccessful) {
      // TODO: Provide user feedback about payment failure
      return null;
    }

    // 2. Update Stock
    let stockSufficient = true;
    for (const item of cartItems) {
      const success = await productService.updateStock(item.id, item.quantity);
      if (!success) {
        stockSufficient = false;
        // Technical Note: In a real system, you'd roll back any previous stock updates if one fails.
        // Or, better, check all stock *before* attempting any updates or payment.
        console.error(`Failed to update stock for ${item.name}. Order cannot be completed.`);
        // For simplicity, we stop here. A real app might try to revert payment or notify admin.
        return null; 
      }
    }

    if (!stockSufficient) {
      // This case should ideally be caught by pre-checking stock, but included for robustness.
      console.error("Order could not be completed due to insufficient stock for one or more items after payment attempt.");
      // Potentially refund payment here.
      return null;
    }
    
    // 3. Create Order Object
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const newOrder: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id,
      items: orderItems,
      totalAmount: totalAmount,
      orderDate: new Date().toISOString(),
      status: 'Completed',
    };

    // 4. Store Order (e.g., in user's purchase history via localStorage)
    const userOrdersKey = `${ORDERS_KEY_PREFIX}${user.id}`;
    const existingOrders = getItem<Order[]>(userOrdersKey) || [];
    existingOrders.push(newOrder);
    setItem(userOrdersKey, existingOrders);

    // 5. Send Confirmation Email (Simulated)
    try {
        await emailService.sendConfirmationEmail(user.email, newOrder);
    } catch (emailError) {
        console.error("Failed to send confirmation email, but order was placed:", emailError);
        // Log this, but don't fail the order just because email failed.
    }
    
    // Technical Research Note: Could investigate integrating with actual shipping APIs or inventory management systems here.
    return newOrder;
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const userOrdersKey = `${ORDERS_KEY_PREFIX}${userId}`;
    return getItem<Order[]>(userOrdersKey) || [];
  },

  // Technical research: For a real system, investigate different payment gateways (Stripe, PayPal)
  // and how their SDKs/APIs would integrate here. Consider security implications (PCI compliance).
};
    