
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import Spinner from '../components/Spinner';
import { Product } from '../types';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, products, loading: productsLoading } = useProducts(); // Use products from context
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null | undefined>(null); // undefined for not found, null for loading
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (id && !productsLoading) { // Check if products are loaded
        const foundProduct = getProductById(id);
        setProduct(foundProduct); // Will be Product or undefined
    }
  }, [id, getProductById, products, productsLoading]);

  const handleAddToCart = () => {
    if (product && product.stock > 0 && quantity > 0) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prevQuantity => {
        const newQuantity = prevQuantity + change;
        if (newQuantity < 1) return 1;
        if (product && newQuantity > product.stock) return product.stock;
        return newQuantity;
    });
  };


  if (productsLoading || product === null) {
      return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  }

  if (product === undefined) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-accent mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <Link to="/" className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto max-h-[500px] object-contain rounded-lg border border-neutral"
              onError={(e) => (e.currentTarget.src = 'https://picsum.photos/600/400?grayscale')}
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-3">{product.name}</h1>
            <p className="text-gray-500 text-sm mb-3">Category: {product.category}</p>
            <p className="text-2xl font-semibold text-primary mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
            
            {product.stock > 0 ? (
              <p className="text-lg text-green-600 mb-4 font-semibold">In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-lg text-accent mb-4 font-semibold">Out of Stock</p>
            )}

            {product.stock > 0 && (
              <div className="flex items-center space-x-4 mb-6">
                <label htmlFor="quantity" className="font-medium text-neutral-dark">Quantity:</label>
                <div className="flex items-center border border-neutral rounded">
                    <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1.5 hover:bg-neutral-light disabled:opacity-50" disabled={quantity <= 1}>-</button>
                    <input 
                        type="number" 
                        id="quantity" 
                        name="quantity"
                        value={quantity}
                        onChange={(e) => {
                            let val = parseInt(e.target.value);
                            if (isNaN(val) || val < 1) val = 1;
                            if (val > product.stock) val = product.stock;
                            setQuantity(val);
                        }}
                        className="w-16 text-center border-l border-r border-neutral focus:outline-none"
                        min="1"
                        max={product.stock}
                    />
                    <button onClick={() => handleQuantityChange(1)} className="px-3 py-1.5 hover:bg-neutral-light disabled:opacity-50" disabled={quantity >= product.stock}>+</button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || quantity === 0}
              className={`w-full md:w-auto px-8 py-3 rounded-md font-bold text-white transition-colors text-lg
                ${product.stock > 0 && quantity > 0
                  ? 'bg-primary hover:bg-secondary' 
                  : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
    