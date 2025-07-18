import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Navigation from './Navigation';
import ProductCatalog from './ProductCatalog';
import OrderHistory from './OrderHistory';
import Support from './Support';
import { mockProducts, mockOrders } from '../data/mockData';
import { Order } from '../types';

const DistributorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'support'>('products');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))];
  const totalStock = mockProducts.reduce((sum, p) => sum + p.availableStock, 0);

  const handlePlaceOrder = async (productId: string, quantity: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const product = mockProducts.find(p => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        productName: product.name,
        productId: product.id,
        quantity,
        orderDate: new Date().toISOString().split('T')[0],
        totalAmount: product.pricePerUnit * quantity,
        status: 'Processing',
        artisan: product.artisan
      };

      setOrders(prev => [newOrder, ...prev]);
      
      // Show success message
      toast.success(`Order placed successfully! Order ID: ${newOrder.id}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
    } catch (error) {
      toast.error('Failed to place order. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <ProductCatalog
            products={mockProducts}
            onPlaceOrder={handlePlaceOrder}
          />
        );
      case 'orders':
        return <OrderHistory orders={orders} />;
      case 'support':
        return <Support />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        totalProducts={mockProducts.length}
        totalStock={totalStock}
      />
      <main>
        {renderContent()}
      </main>
      <ToastContainer />
    </div>
  );
};

export default DistributorDashboard;