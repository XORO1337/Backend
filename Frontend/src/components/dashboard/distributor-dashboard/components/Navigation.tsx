import React from 'react';
import { Package, ShoppingCart, HeadphonesIcon, Search, Filter } from 'lucide-react';

interface NavigationProps {
  activeTab: 'products' | 'orders' | 'support';
  onTabChange: (tab: 'products' | 'orders' | 'support') => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  categories?: string[];
  totalProducts?: number;
  totalStock?: number;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange,
  searchTerm = '',
  onSearchChange,
  selectedCategory = 'all',
  onCategoryChange,
  categories = [],
  totalProducts = 0,
  totalStock = 0
}) => {
  const navItems = [
    { id: 'products', label: 'Browse Products', icon: Package },
    { id: 'orders', label: 'My Orders', icon: ShoppingCart },
    { id: 'support', label: 'Support', icon: HeadphonesIcon }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation Bar */}
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RootsReach
              </h1>
              <p className="text-sm text-gray-500 font-medium">Distributor Dashboard</p>
            </div>
          </div>
          
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as 'products' | 'orders' | 'support')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Amazing Stats Section Below Navbar */}
      {activeTab === 'products' && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Products Stats */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-md">
                        <Package size={16} className="text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800">Total Products</h3>
                    </div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
                      {totalProducts}
                    </p>
                    <p className="text-xs text-gray-600">Available for order</p>
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Package size={20} className="text-indigo-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Stats */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="p-1.5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800">Items in Stock</h3>
                    </div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      {totalStock.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">Ready to ship</p>
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories Stats */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="p-1.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800">Categories</h3>
                    </div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                      {categories.length - 1}
                    </p>
                    <p className="text-xs text-gray-600">Product types</p>
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Search and Filter Bar - Only show on products tab */}
      {activeTab === 'products' && onSearchChange && onCategoryChange && (
        <div className="bg-white border-t border-gray-100 pb-6 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products or artisans..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white shadow-sm"
                />
              </div>
              
              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all shadow-sm appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-3">
                <button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl font-medium">
                  View All
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium">
                  Clear Filters
                </button>
              </div>
            </div>
            
            {/* Active Filters */}
            {(searchTerm || selectedCategory !== 'all') && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 font-medium">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => onSearchChange('')}
                      className="ml-2 text-indigo-600 hover:text-indigo-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 font-medium">
                    Category: {selectedCategory}
                    <button
                      onClick={() => onCategoryChange('all')}
                      className="ml-2 text-purple-600 hover:text-purple-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;