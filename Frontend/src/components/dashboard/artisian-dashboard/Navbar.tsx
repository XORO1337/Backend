import React from 'react';
import { Home, Bell, User, LogOut } from 'lucide-react';

interface NavbarProps {
  userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ userName = 'Maya' }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-rose-400 to-orange-400 p-2 rounded-xl">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">RootsReach</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden sm:block">Welcome, {userName}!</span>
            <button className="p-2 rounded-full hover:bg-rose-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-full hover:bg-rose-200 transition-colors">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;