
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../constants';
import { getItem, setItem } from '../utils/localStorage';

const PRODUCTS_KEY = 'quickshop_products';

let currentProducts: Product[] = [];

const initializeProducts = (): Product[] => {
  let products = getItem<Product[]>(PRODUCTS_KEY);
  if (!products || products.length === 0) {
    products = INITIAL_PRODUCTS.map(p => ({ ...p })); // Ensure a fresh copy
    setItem(PRODUCTS_KEY, products);
  }
  currentProducts = products;
  return products;
};

// Initialize products on module load
initializeProducts();

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    if (currentProducts.length === 0) {
       initializeProducts(); // Re-initialize if empty (e.g., after localStorage clear)
    }
    return [...currentProducts]; // Return a copy
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    if (currentProducts.length === 0) {
      initializeProducts();
    }
    return currentProducts.find(p => p.id === id);
  },

  // This function will be central to updating stock.
  // It modifies the 'currentProducts' in memory and persists to localStorage.
  updateStock: async (productId: string, quantitySold: number): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 50));
    if (currentProducts.length === 0) {
      initializeProducts();
    }
    const productIndex = currentProducts.findIndex(p => p.id === productId);
    if (productIndex > -1) {
      if (currentProducts[productIndex].stock >= quantitySold) {
        currentProducts[productIndex].stock -= quantitySold;
        setItem(PRODUCTS_KEY, currentProducts); // Persist change
        return true;
      }
    }
    return false; // Stock not sufficient or product not found
  },

  // Function to directly set stock (e.g. for admin or restocking simulation)
  setProductStock: async (productId: string, newStock: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    if (currentProducts.length === 0) {
      initializeProducts();
    }
    const productIndex = currentProducts.findIndex(p => p.id === productId);
    if (productIndex > -1) {
      currentProducts[productIndex].stock = newStock;
      setItem(PRODUCTS_KEY, currentProducts);
      return true;
    }
    return false;
  },

  // Reset products to initial state (for testing/dev)
  resetProducts: async (): Promise<void> => {
    currentProducts = INITIAL_PRODUCTS.map(p => ({ ...p }));
    setItem(PRODUCTS_KEY, currentProducts);
  }
};
    