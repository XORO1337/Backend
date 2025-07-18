import React from 'react';
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const statsData = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      bgColor: 'bg-rose-100',
      iconColor: 'text-rose-600',
      borderColor: 'border-rose-100'
    },
    {
      title: 'Orders This Month',
      value: stats.ordersThisMonth.toString(),
      icon: ShoppingBag,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-100'
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue}`,
      icon: DollarSign,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-green-100'
    },
    {
      title: 'Customer Rating',
      value: stats.customerRating,
      icon: TrendingUp,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className={`bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border ${stat.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;