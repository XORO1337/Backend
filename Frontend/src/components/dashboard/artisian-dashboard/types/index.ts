export interface RawMaterial {
  id: number;
  name: string;
  quantity: string;
  status: 'Delivered' | 'Pending' | 'In Transit';
  date: string;
  unit: string; 
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
}

export interface Order {
  id: number;
  customer: string;
  product: string;
  quantity: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  date: string;
}

export interface Tutorial {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
}

export interface EarningsData {
  total: number;
  thisMonth: number;
  lastMonth: number;
  growth: string;
  ordersThisMonth: number;
}

export interface DashboardStats {
  totalProducts: number;
  ordersThisMonth: number;
  revenue: number;
  customerRating: string;
}