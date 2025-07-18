import { CheckCircle, Clock, Truck, AlertCircle } from 'lucide-react';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Delivered': return 'bg-green-100 text-green-800';
    case 'Processing': return 'bg-blue-100 text-blue-800';
    case 'Shipped': return 'bg-purple-100 text-purple-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'In Transit': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Delivered': return CheckCircle;
    case 'Processing': return Clock;
    case 'Shipped': return Truck;
    case 'Pending': return AlertCircle;
    case 'In Transit': return Truck;
    default: return Clock;
  }
};