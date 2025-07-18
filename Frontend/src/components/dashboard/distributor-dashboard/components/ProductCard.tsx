import React, { useState } from 'react';
import { User, Package, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onPlaceOrder: (productId: string, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPlaceOrder }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isOrdering, setIsOrdering] = useState(false);

  const handlePlaceOrder = async () => {
    if (quantity > 0 && quantity <= product.availableStock) {
      setIsOrdering(true);
      await onPlaceOrder(product.id, quantity);
      setQuantity(1);
      setIsOrdering(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
            {product.category}
          </span>
        </div>
        {product.availableStock < 20 && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Low Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center text-gray-600 mb-3">
            <User size={16} className="mr-2 text-indigo-500" />
            <span className="text-sm font-medium">by {product.artisan}</span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.pricePerUnit)}
            </span>
            <span className="text-gray-500 text-xs">per unit</span>
          </div>
          
          <div className="text-right">
            <div className={`flex items-center ${product.availableStock > 50 ? 'text-green-600' : product.availableStock > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
              <Package size={16} className="mr-1" />
              <span className="text-sm font-semibold">
                {product.availableStock}
              </span>
            </div>
            <span className="text-xs text-gray-500">in stock</span>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={product.availableStock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={isOrdering || quantity > product.availableStock}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ShoppingCart size={18} />
              <span className="text-sm font-medium">
                {isOrdering ? 'Placing...' : 'Place Order'}
              </span>
            </button>
          </div>
          
          <div className="mt-3 p-3 bg-gray-50 rounded-xl">
            <div className="text-sm font-semibold text-gray-900">
              Total: <span className="text-indigo-600">{formatPrice(product.pricePerUnit * quantity)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;