
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string;
  getProductById: (id: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
  updateProductInList: (updatedProduct: Product) => void;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await productService.getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError('Failed to fetch products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch products on mount

  const getProductById = useCallback((id: string): Product | undefined => {
    return products.find(p => p.id === id);
  }, [products]);

  const updateProductInList = useCallback((updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  }, []);

  // Expose refreshProducts so other parts of the app (e.g. after an order) can trigger a data refresh if needed.
  // In this app, stock is updated via productService which directly modifies its internal store and localStorage.
  // Then, ProductPage or HomePage could re-fetch if they need to show the absolute latest.
  // For this version, changes in stock will be reflected if components re-fetch products or ProductProvider is re-rendered.
  // `updateProductInList` helps more directly update the context's state.

  return (
    <ProductContext.Provider value={{ products, loading, error, getProductById, refreshProducts: fetchProducts, updateProductInList }}>
      {children}
    </ProductContext.Provider>
  );
};
    
