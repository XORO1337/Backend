import React from 'react';
import Navbar from '../Navbar';
import WelcomeSection from '../WelcomeSection';
import StatsCards from '../StatsCards';
import RawMaterials from '../RawMaterials';
import OrdersTable from '../OrdersTable';
import EarningsCard from '../EarningsCard';
import ProductsCard from '../ProductsCard';
import TutorialsCard from '../TutorialsCard';
import SupportChat from '../SupportChat';

import { rawMaterials, products as initialProducts, orders, tutorials, earningsData, dashboardStats } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

import { Product } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [products, setProducts] = React.useState<Product[]>(initialProducts);

  // Event handlers
  const handleOrderMore = () => {
    console.log('Order more materials clicked');
  };

  const handleSearch = () => {
    console.log('Search orders clicked');
  };

  const handleFilter = () => {
    console.log('Filter orders clicked');
  };

  const handleAddNewProduct = (newProduct: Omit<Product, 'id'>) => {
    setProducts((prev) => [
      { ...newProduct, id: prev.length ? Math.max(...prev.map(p => p.id)) + 1 : 1 },
      ...prev
    ]);
  };

  const handleEditProduct = (productId: number) => {
    console.log('Edit product:', productId);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter(p => p.id !== productId));
  };

  const handlePlayTutorial = (tutorialId: number) => {
    console.log('Play tutorial:', tutorialId);
  };

  const handleOpenChat = () => {
    console.log('Open support chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      <Navbar userName={user?.name || 'Artisan'} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection userName={user?.name || 'Artisan'} />
        
        <StatsCards stats={dashboardStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <RawMaterials 
              materials={rawMaterials} 
              onOrderMore={handleOrderMore}
            />
            
            <OrdersTable 
              orders={orders}
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <EarningsCard earnings={earningsData} />
            
            <ProductsCard 
              products={products}
              onAddNew={handleAddNewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
            
            <TutorialsCard 
              tutorials={tutorials}
              onPlayTutorial={handlePlayTutorial}
            />
          </div>
        </div>
      </div>

      <SupportChat onOpenChat={handleOpenChat} />
    </div>
  );
};

export default Dashboard;