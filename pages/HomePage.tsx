
import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

const HomePage: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      selectedCategory === 'All' || product.category === selectedCategory
    );

  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  if (error) return <div className="text-center text-accent py-10">{error} Please try refreshing.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-neutral-dark mb-2">Welcome to QuickShop</h1>
        <p className="text-lg text-gray-600">Discover our amazing products</p>
      </header>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input 
          type="text"
          placeholder="Search products..."
          className="p-3 border border-neutral rounded-md shadow-sm focus:ring-primary focus:border-primary flex-grow w-full md:w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 border border-neutral rounded-md shadow-sm focus:ring-primary focus:border-primary w-full md:w-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10 text-xl">
          No products found matching your criteria.
        </p>
      )}
    </div>
  );
};

export default HomePage;
    