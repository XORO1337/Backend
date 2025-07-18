import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  dashboardService, 
  artisanDashboardService, 
  distributorDashboardService,
  customerDashboardService
} from '../services/dashboardService';

// Generic dashboard hook
export const useDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsResult, activitiesResult] = await Promise.all([
        dashboardService.getDashboardStats(user.role),
        dashboardService.getRecentActivities(user.role)
      ]);
      
      if (statsResult.success) {
        setStats(statsResult.data);
      }
      
      if (activitiesResult.success) {
        setActivities(activitiesResult.data);
      }
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  return {
    stats,
    activities,
    loading,
    error,
    refreshData
  };
};

// Artisan dashboard hook
export const useArtisanDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    profile: null,
    products: [],
    orders: [],
    materials: [],
    verificationStatus: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'artisan') {
      loadArtisanData();
    }
  }, [user]);

  const loadArtisanData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [artisanResult, materialsResult, verificationResult] = await Promise.all([
        artisanDashboardService.getArtisanData(),
        artisanDashboardService.getRawMaterials(),
        artisanDashboardService.getVerificationStatus()
      ]);
      
      setData(prev => ({
        ...prev,
        ...artisanResult.data,
        materials: materialsResult.data || [],
        verificationStatus: verificationResult.data
      }));
    } catch (error) {
      setError('Failed to load artisan data');
      console.error('Artisan data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Product management functions
  const createProduct = async (productData) => {
    try {
      const result = await artisanDashboardService.createProduct(productData);
      if (result.success) {
        loadArtisanData(); // Refresh data
      }
      return result;
    } catch (error) {
      console.error('Create product error:', error);
      return { success: false, message: error.message };
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const result = await artisanDashboardService.updateProduct(productId, productData);
      if (result.success) {
        loadArtisanData(); // Refresh data
      }
      return result;
    } catch (error) {
      console.error('Update product error:', error);
      return { success: false, message: error.message };
    }
  };

  // Verification functions
  const initiateVerification = async (aadhaarNumber) => {
    try {
      const result = await artisanDashboardService.initiateVerification(aadhaarNumber);
      return result;
    } catch (error) {
      console.error('Initiate verification error:', error);
      return { success: false, message: error.message };
    }
  };

  const verifyOTP = async (otp) => {
    try {
      const result = await artisanDashboardService.verifyVerificationOTP(otp);
      if (result.success) {
        loadArtisanData(); // Refresh verification status
      }
      return result;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, message: error.message };
    }
  };

  return {
    ...data,
    loading,
    error,
    refreshData: loadArtisanData,
    createProduct,
    updateProduct,
    initiateVerification,
    verifyOTP
  };
};

// Distributor dashboard hook
export const useDistributorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    profile: null,
    inventory: [],
    orders: [],
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'distributor') {
      loadDistributorData();
    }
  }, [user]);

  const loadDistributorData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [distributorResult, productsResult] = await Promise.all([
        distributorDashboardService.getDistributorData(),
        distributorDashboardService.getAvailableProducts()
      ]);
      
      setData(prev => ({
        ...prev,
        ...distributorResult.data,
        products: productsResult.data || []
      }));
    } catch (error) {
      setError('Failed to load distributor data');
      console.error('Distributor data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Inventory management functions
  const addInventoryItem = async (inventoryData) => {
    try {
      const result = await distributorDashboardService.addInventoryItem(inventoryData);
      if (result.success) {
        loadDistributorData(); // Refresh data
      }
      return result;
    } catch (error) {
      console.error('Add inventory item error:', error);
      return { success: false, message: error.message };
    }
  };

  const updateInventoryItem = async (itemId, inventoryData) => {
    try {
      const result = await distributorDashboardService.updateInventoryItem(itemId, inventoryData);
      if (result.success) {
        loadDistributorData(); // Refresh data
      }
      return result;
    } catch (error) {
      console.error('Update inventory item error:', error);
      return { success: false, message: error.message };
    }
  };

  // Order management functions
  const processOrder = async (orderId, orderData) => {
    try {
      const result = await distributorDashboardService.processOrder(orderId, orderData);
      if (result.success) {
        loadDistributorData(); // Refresh data
      }
      return result;
    } catch (error) {
      console.error('Process order error:', error);
      return { success: false, message: error.message };
    }
  };

  return {
    ...data,
    loading,
    error,
    refreshData: loadDistributorData,
    addInventoryItem,
    updateInventoryItem,
    processOrder
  };
};

// Customer dashboard hook
export const useCustomerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    profile: null,
    orders: [],
    addresses: [],
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'customer') {
      loadCustomerData();
    }
  }, [user]);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [customerResult, productsResult] = await Promise.all([
        customerDashboardService.getCustomerData(),
        customerDashboardService.browseProducts()
      ]);
      
      setData(prev => ({
        ...prev,
        ...customerResult.data,
        products: productsResult.data || []
      }));
    } catch (error) {
      setError('Failed to load customer data');
      console.error('Customer data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Shopping functions
  const browseProducts = async (filters = {}) => {
    try {
      const result = await customerDashboardService.browseProducts(filters);
      return result;
    } catch (error) {
      console.error('Browse products error:', error);
      return { success: false, message: error.message };
    }
  };

  const placeOrder = async (orderData) => {
    try {
      const result = await customerDashboardService.placeOrder(orderData);
      if (result.success) {
        loadCustomerData(); // Refresh data
      }
      return result;
    } catch (error) {
      console.error('Place order error:', error);
      return { success: false, message: error.message };
    }
  };

  return {
    ...data,
    loading,
    error,
    refreshData: loadCustomerData,
    browseProducts,
    placeOrder
  };
};

export default {
  useDashboard,
  useArtisanDashboard,
  useDistributorDashboard,
  useCustomerDashboard
};
