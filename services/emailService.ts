
import { Order, User } from '../types';

export const emailService = {
  sendConfirmationEmail: async (userEmail: string, order: Order): Promise<void> => {
    // Simulate API delay for sending email
    await new Promise(resolve => setTimeout(resolve, 700));

    console.log("====================================");
    console.log("SIMULATING EMAIL CONFIRMATION");
    console.log("To:", userEmail);
    console.log("From: QuickShop <noreply@quickshop.example.com>");
    console.log("Subject: Your QuickShop Order Confirmation (#" + order.id + ")");
    console.log("------------------------------------");
    console.log(`Hi there,`);
    console.log(`\nThank you for your order! Your order #${order.id} has been placed successfully.`);
    console.log("\nOrder Details:");
    order.items.forEach(item => {
      console.log(`- ${item.productName} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}`);
    });
    console.log(`\nTotal Amount: $${order.totalAmount.toFixed(2)}`);
    console.log(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`);
    console.log("\nWe'll notify you when your order ships.");
    console.log("\nThanks for shopping with QuickShop!");
    console.log("====================================");
    // In a real application, this would use an email sending library (e.g., SendGrid, Nodemailer)
  },

  sendPasswordResetEmail: async (userEmail: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("====================================");
    console.log("SIMULATING PASSWORD RESET EMAIL");
    console.log("To:", userEmail);
    console.log("From: QuickShop <noreply@quickshop.example.com>");
    console.log("Subject: Password Reset Request for QuickShop");
    console.log("------------------------------------");
    console.log(`Hi there,`);
    console.log(`\nWe received a request to reset your password. If you didn't make this request, please ignore this email.`);
    console.log(`Otherwise, click this link to reset your password: [Simulated Reset Link]`);
    console.log("\nThanks,");
    console.log("The QuickShop Team");
    console.log("====================================");
  }
};
    