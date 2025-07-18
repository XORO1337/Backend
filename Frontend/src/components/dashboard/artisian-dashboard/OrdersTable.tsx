import React from 'react';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { getStatusColor, getStatusIcon } from './utils/statusHelpers';
import { Order } from './types'; // Make sure this path is correct based on your folder structure

interface OrdersTableProps {
  orders: Order[];
  onSearch?: () => void;
  onFilter?: () => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onSearch, onFilter }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-orange-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2 text-orange-600" />
          Orders Received
        </h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onSearch}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <button 
            onClick={onFilter}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-orange-100">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <tr key={order.id} className="border-b border-orange-50 hover:bg-orange-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{order.customer}</div>
                    <div className="text-sm text-gray-600">{order.date}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-800">{order.product}</td>
                  <td className="py-3 px-4 text-gray-800">{order.quantity}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">${order.total}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(order.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span>{order.status}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
