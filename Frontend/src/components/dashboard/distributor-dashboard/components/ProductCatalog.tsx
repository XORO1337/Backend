import React, { useState } from 'react';
import { Search, Filter, Package } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  onPlaceOrder: (productId: string, quantity: number) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onPlaceOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredAndSortedProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.artisan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.pricePerUnit - b.pricePerUnit;
      case 'price-high':
        return b.pricePerUnit - a.pricePerUnit;
      case 'stock':
        return b.availableStock - a.availableStock;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const totalStock = products.reduce((sum, p) => sum + p.availableStock, 0);
  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          Artisan Product Catalog
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover authentic handcrafted products from talented artisans across India
        </p>
      </div>
      
      {/* Sort and Results Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredAndSortedProducts.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{products.length}</span> products
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all text-sm"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="stock">Stock Level</option>
            </select>
          </div>
        </div>
      </div>
      {/* Results Count */}
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onPlaceOrder={onPlaceOrder}
          />
        ))}
      </div>
      
      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <div className="text-gray-400 mb-4">
            <Package size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
      
      {/* Load More Button (for future pagination) */}
      {filteredAndSortedProducts.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">Showing all available products</p>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;