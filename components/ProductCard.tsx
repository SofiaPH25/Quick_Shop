
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, 1);
    } else {
      // This case is also handled by addToCart, but good to be explicit
      alert("This product is out of stock.");
    }
  };

  return (
    <div className="bg-white border border-neutral rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105 duration-300">
      <Link to={`/product/${product.id}`} className="block">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-48 object-cover" 
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/400/300?grayscale')}
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-neutral-dark hover:text-primary mb-1 truncate">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2 h-10 overflow-hidden">{product.description.substring(0,60)}...</p>
        <p className="text-xl font-bold text-primary mb-3 mt-auto">${product.price.toFixed(2)}</p>
        {product.stock > 0 ? (
           <p className="text-sm text-green-600 mb-2">In Stock ({product.stock} left)</p>
        ) : (
           <p className="text-sm text-accent mb-2">Out of Stock</p>
        )}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full mt-2 px-4 py-2 rounded-md font-semibold text-white transition-colors
            ${product.stock > 0 
              ? 'bg-primary hover:bg-secondary' 
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
    