// Base API configuration
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // For cookies
  };

  // Add authorization header if token exists
  const token = localStorage.getItem('accessToken');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Google OAuth login
  googleLogin: (role = 'customer') => {
    window.location.href = `${API_BASE_URL}/auth/google?role=${role}`;
  },

  // Complete Google profile
  completeGoogleProfile: async (profileData) => {
    return apiRequest('/auth/complete-google-profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  // Send OTP
  sendOTP: async (phone) => {
    return apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  // Verify OTP
  verifyOTP: async (phone, otp) => {
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  },

  // Refresh token
  refreshToken: async () => {
    return apiRequest('/auth/refresh-token', {
      method: 'POST',
    });
  },

  // Logout
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  // Logout from all devices
  logoutAll: async () => {
    return apiRequest('/auth/logout-all', {
      method: 'POST',
    });
  },

  // Get user profile
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },
};

// Address Management API
export const addressAPI = {
  // Get all addresses
  getAddresses: async () => {
    return apiRequest('/auth/addresses');
  },

  // Add new address
  addAddress: async (addressData) => {
    return apiRequest('/auth/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    return apiRequest(`/auth/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  // Delete address
  deleteAddress: async (addressId) => {
    return apiRequest(`/auth/addresses/${addressId}`, {
      method: 'DELETE',
    });
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    return apiRequest(`/auth/addresses/${addressId}/set-default`, {
      method: 'PATCH',
    });
  },

  // Get default address
  getDefaultAddress: async () => {
    return apiRequest('/auth/addresses/default');
  },
};

// Identity Verification API
export const verificationAPI = {
  // Initiate Aadhaar verification
  initiateAadhaarVerification: async (aadhaarNumber) => {
    return apiRequest('/auth/verification/aadhaar/initiate', {
      method: 'POST',
      body: JSON.stringify({ aadhaarNumber }),
    });
  },

  // Verify Aadhaar OTP
  verifyAadhaarOTP: async (otp) => {
    return apiRequest('/auth/verification/aadhaar/verify', {
      method: 'POST',
      body: JSON.stringify({ otp }),
    });
  },

  // Get verification status
  getVerificationStatus: async () => {
    return apiRequest('/auth/verification/status');
  },

  // Get verification documents
  getVerificationDocuments: async () => {
    return apiRequest('/auth/verification/documents');
  },
};

// Artisan API
export const artisanAPI = {
  // Get all artisans
  getArtisans: async (query = '') => {
    return apiRequest(`/artisans${query ? `?${query}` : ''}`);
  },

  // Get artisan by ID
  getArtisanById: async (id) => {
    return apiRequest(`/artisans/${id}`);
  },

  // Create artisan profile
  createArtisan: async (artisanData) => {
    return apiRequest('/artisans', {
      method: 'POST',
      body: JSON.stringify(artisanData),
    });
  },

  // Update artisan profile
  updateArtisan: async (id, artisanData) => {
    return apiRequest(`/artisans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(artisanData),
    });
  },

  // Update bank details
  updateBankDetails: async (id, bankData) => {
    return apiRequest(`/artisans/${id}/bank-details`, {
      method: 'PATCH',
      body: JSON.stringify(bankData),
    });
  },

  // Delete artisan profile
  deleteArtisan: async (id) => {
    return apiRequest(`/artisans/${id}`, {
      method: 'DELETE',
    });
  },
};

// Distributor API
export const distributorAPI = {
  // Get all distributors
  getDistributors: async (query = '') => {
    return apiRequest(`/distributors${query ? `?${query}` : ''}`);
  },

  // Get distributor by ID
  getDistributorById: async (id) => {
    return apiRequest(`/distributors/${id}`);
  },

  // Create distributor profile
  createDistributor: async (distributorData) => {
    return apiRequest('/distributors', {
      method: 'POST',
      body: JSON.stringify(distributorData),
    });
  },

  // Update distributor profile
  updateDistributor: async (id, distributorData) => {
    return apiRequest(`/distributors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(distributorData),
    });
  },

  // Delete distributor profile
  deleteDistributor: async (id) => {
    return apiRequest(`/distributors/${id}`, {
      method: 'DELETE',
    });
  },
};

// Products API
export const productsAPI = {
  // Get all products
  getProducts: async (query = '') => {
    return apiRequest(`/products${query ? `?${query}` : ''}`);
  },

  // Get product by ID
  getProductById: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  // Create product
  createProduct: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product
  updateProduct: async (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product
  deleteProduct: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  // Get all orders
  getOrders: async (query = '') => {
    return apiRequest(`/orders${query ? `?${query}` : ''}`);
  },

  // Get order by ID
  getOrderById: async (id) => {
    return apiRequest(`/orders/${id}`);
  },

  // Create order
  createOrder: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Update order
  updateOrder: async (id, orderData) => {
    return apiRequest(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },

  // Cancel order
  cancelOrder: async (id) => {
    return apiRequest(`/orders/${id}/cancel`, {
      method: 'PATCH',
    });
  },
};

// Raw Materials API
export const rawMaterialsAPI = {
  // Get all raw materials
  getRawMaterials: async (query = '') => {
    return apiRequest(`/raw-materials${query ? `?${query}` : ''}`);
  },

  // Get raw material by ID
  getRawMaterialById: async (id) => {
    return apiRequest(`/raw-materials/${id}`);
  },

  // Create raw material
  createRawMaterial: async (materialData) => {
    return apiRequest('/raw-materials', {
      method: 'POST',
      body: JSON.stringify(materialData),
    });
  },

  // Update raw material
  updateRawMaterial: async (id, materialData) => {
    return apiRequest(`/raw-materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(materialData),
    });
  },

  // Delete raw material
  deleteRawMaterial: async (id) => {
    return apiRequest(`/raw-materials/${id}`, {
      method: 'DELETE',
    });
  },
};

// Materials API
export const materialsAPI = {
  // Get all materials
  getMaterials: async (query = '') => {
    return apiRequest(`/materials${query ? `?${query}` : ''}`);
  },

  // Get material by ID
  getMaterialById: async (id) => {
    return apiRequest(`/materials/${id}`);
  },

  // Create material
  createMaterial: async (materialData) => {
    return apiRequest('/materials', {
      method: 'POST',
      body: JSON.stringify(materialData),
    });
  },

  // Update material
  updateMaterial: async (id, materialData) => {
    return apiRequest(`/materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(materialData),
    });
  },

  // Delete material
  deleteMaterial: async (id) => {
    return apiRequest(`/materials/${id}`, {
      method: 'DELETE',
    });
  },
};

// Inventory API
export const inventoryAPI = {
  // Get all inventory items
  getInventory: async (query = '') => {
    return apiRequest(`/inventory${query ? `?${query}` : ''}`);
  },

  // Get inventory item by ID
  getInventoryById: async (id) => {
    return apiRequest(`/inventory/${id}`);
  },

  // Create inventory item
  createInventoryItem: async (inventoryData) => {
    return apiRequest('/inventory', {
      method: 'POST',
      body: JSON.stringify(inventoryData),
    });
  },

  // Update inventory item
  updateInventoryItem: async (id, inventoryData) => {
    return apiRequest(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(inventoryData),
    });
  },

  // Delete inventory item
  deleteInventoryItem: async (id) => {
    return apiRequest(`/inventory/${id}`, {
      method: 'DELETE',
    });
  },
};

// User Management API
export const userAPI = {
  // Get all users (admin only)
  getUsers: async (query = '') => {
    return apiRequest(`/users${query ? `?${query}` : ''}`);
  },

  // Get user by ID
  getUserById: async (id) => {
    return apiRequest(`/users/${id}`);
  },

  // Update user
  updateUser: async (id, userData) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  deleteUser: async (id) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin Verification API
export const adminAPI = {
  // Get pending verifications
  getPendingVerifications: async (query = '') => {
    return apiRequest(`/auth/admin/verifications/pending${query ? `?${query}` : ''}`);
  },

  // Manually verify user
  manuallyVerifyUser: async (userId, verificationData) => {
    return apiRequest(`/auth/admin/verifications/${userId}/manual-verify`, {
      method: 'PATCH',
      body: JSON.stringify(verificationData),
    });
  },
};

// Utility functions
export const tokenUtils = {
  // Save token to localStorage
  saveToken: (token) => {
    localStorage.setItem('accessToken', token);
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('accessToken');
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('accessToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
};

export default {
  authAPI,
  addressAPI,
  verificationAPI,
  artisanAPI,
  distributorAPI,
  productsAPI,
  ordersAPI,
  rawMaterialsAPI,
  materialsAPI,
  inventoryAPI,
  userAPI,
  adminAPI,
  tokenUtils,
};
