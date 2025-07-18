import React from 'react';
import { TrendingUp } from 'lucide-react';
import { EarningsData } from './types';

interface EarningsCardProps {
  earnings: EarningsData;
}

const EarningsCard: React.FC<EarningsCardProps> = ({ earnings }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-green-100">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
        Earnings
      </h3>
      
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-800">${earnings.total}</p>
          <p className="text-sm text-gray-600">Total Earnings</p>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
          <div>
            <p className="font-medium text-gray-800">This Month</p>
            <p className="text-2xl font-bold text-green-600">${earnings.thisMonth}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Growth</p>
            <p className="text-green-600 font-medium">{earnings.growth}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
          <div>
            <p className="font-medium text-gray-800">Last Month</p>
            <p className="text-2xl font-bold text-blue-600">${earnings.lastMonth}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Orders</p>
            <p className="text-blue-600 font-medium">{earnings.ordersThisMonth}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsCard;