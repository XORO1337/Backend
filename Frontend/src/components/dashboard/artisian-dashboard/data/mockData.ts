import { RawMaterial, Product, Order, Tutorial, EarningsData, DashboardStats } from '../types';

export const rawMaterials: RawMaterial[] = [
  { id: 1, name: 'Organic Cotton Yarn', quantity: '2.5 kg', status: 'Delivered', date: '2025-01-10' },
  { id: 2, name: 'Natural Wool', quantity: '1 kg', status: 'Pending', date: '2025-01-15' },
  { id: 3, name: 'Bamboo Fiber', quantity: '3 kg', status: 'In Transit', date: '2025-01-12' },
  { id: 4, name: 'Silk Thread', quantity: '500g', status: 'Delivered', date: '2025-01-08' }
];

export const products: Product[] = [
  { id: 1, name: 'Handwoven Scarf', price: 45, stock: 12, image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, name: 'Knitted Sweater', price: 80, stock: 8, image: 'https://images.pexels.com/photos/5876695/pexels-photo-5876695.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, name: 'Crochet Handbag', price: 35, stock: 15, image: 'https://images.pexels.com/photos/7679659/pexels-photo-7679659.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 4, name: 'Embroidered Cushion', price: 25, stock: 20, image: 'https://images.pexels.com/photos/6186810/pexels-photo-6186810.jpeg?auto=compress&cs=tinysrgb&w=400' }
];

export const orders: Order[] = [
  { id: 1, customer: 'Sarah Johnson', product: 'Handwoven Scarf', quantity: 2, total: 90, status: 'Processing', date: '2025-01-10' },
  { id: 2, customer: 'Michael Chen', product: 'Knitted Sweater', quantity: 1, total: 80, status: 'Shipped', date: '2025-01-09' },
  { id: 3, customer: 'Emma Wilson', product: 'Crochet Handbag', quantity: 3, total: 105, status: 'Delivered', date: '2025-01-08' },
  { id: 4, customer: 'David Brown', product: 'Embroidered Cushion', quantity: 4, total: 100, status: 'Processing', date: '2025-01-11' }
];

export const tutorials: Tutorial[] = [
  { id: 1, title: 'Basic Knitting Techniques', duration: '15 min', thumbnail: 'https://images.pexels.com/photos/5876695/pexels-photo-5876695.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, title: 'Crochet Patterns for Beginners', duration: '20 min', thumbnail: 'https://images.pexels.com/photos/7679659/pexels-photo-7679659.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, title: 'Embroidery Stitches Guide', duration: '12 min', thumbnail: 'https://images.pexels.com/photos/6186810/pexels-photo-6186810.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 4, title: 'Color Matching for Textiles', duration: '18 min', thumbnail: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400' }
];

export const earningsData: EarningsData = {
  total: 2340,
  thisMonth: 890,
  lastMonth: 792,
  growth: '+12.5%',
  ordersThisMonth: 24
};

export const dashboardStats: DashboardStats = {
  totalProducts: 24,
  ordersThisMonth: 18,
  revenue: 2340,
  customerRating: '4.8⭐'
};