import { Product, Order } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Handwoven Silk Scarf',
    image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
    pricePerUnit: 850,
    availableStock: 45,
    artisan: 'Priya Sharma',
    category: 'Scarves',
    description: 'Beautiful handwoven silk scarf with traditional patterns'
  },
  {
    id: '2',
    name: 'Leather Handbag',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    pricePerUnit: 1200,
    availableStock: 28,
    artisan: 'Rajesh Kumar',
    category: 'Bags',
    description: 'Genuine leather handbag with intricate craftsmanship'
  },
  {
    id: '3',
    name: 'Cotton Block Print Stole',
    image: 'https://images.pexels.com/photos/7679864/pexels-photo-7679864.jpeg?auto=compress&cs=tinysrgb&w=400',
    pricePerUnit: 450,
    availableStock: 67,
    artisan: 'Meera Devi',
    category: 'Scarves',
    description: 'Traditional block print cotton stole in vibrant colors'
  },
  {
    id: '4',
    name: 'Jute Tote Bag',
    image: 'https://images.pexels.com/photos/7679435/pexels-photo-7679435.jpeg?auto=compress&cs=tinysrgb&w=400',
    pricePerUnit: 380,
    availableStock: 92,
    artisan: 'Amit Singh',
    category: 'Bags',
    description: 'Eco-friendly jute tote bag with modern design'
  },
  {
    id: '5',
    name: 'Embroidered Pashmina',
    image: 'https://images.pexels.com/photos/7679587/pexels-photo-7679587.jpeg?auto=compress&cs=tinysrgb&w=400',
    pricePerUnit: 1850,
    availableStock: 23,
    artisan: 'Sunita Joshi',
    category: 'Scarves',
    description: 'Luxurious pashmina with delicate hand embroidery'
  },
  {
    id: '6',
    name: 'Canvas Messenger Bag',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    pricePerUnit: 950,
    availableStock: 34,
    artisan: 'Vikram Patel',
    category: 'Bags',
    description: 'Durable canvas messenger bag perfect for daily use'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    productName: 'Handwoven Silk Scarf',
    productId: '1',
    quantity: 25,
    orderDate: '2024-01-15',
    totalAmount: 21250,
    status: 'Delivered',
    artisan: 'Priya Sharma'
  },
  {
    id: 'ORD-002',
    productName: 'Leather Handbag',
    productId: '2',
    quantity: 15,
    orderDate: '2024-01-20',
    totalAmount: 18000,
    status: 'Shipped',
    artisan: 'Rajesh Kumar'
  },
  {
    id: 'ORD-003',
    productName: 'Cotton Block Print Stole',
    productId: '3',
    quantity: 40,
    orderDate: '2024-01-22',
    totalAmount: 18000,
    status: 'Processing',
    artisan: 'Meera Devi'
  },
  {
    id: 'ORD-004',
    productName: 'Jute Tote Bag',
    productId: '4',
    quantity: 50,
    orderDate: '2024-01-10',
    totalAmount: 19000,
    status: 'Delivered',
    artisan: 'Amit Singh'
  },
  {
    id: 'ORD-005',
    productName: 'Embroidered Pashmina',
    productId: '5',
    quantity: 12,
    orderDate: '2024-01-25',
    totalAmount: 22200,
    status: 'Processing',
    artisan: 'Sunita Joshi'
  }
];