export interface Product {
  id: string;
  name: string;
  image: string;
  pricePerUnit: number;
  availableStock: number;
  artisan: string;
  category: string;
  description: string;
}

export interface Order {
  id: string;
  productName: string;
  productId: string;
  quantity: number;
  orderDate: string;
  totalAmount: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  artisan: string;
}

export interface OrderFilter {
  status: 'all' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  dateRange: 'all' | '7days' | '30days' | '90days';
}

export interface BulkOrderRequest {
  productId: string;
  quantity: number;
}