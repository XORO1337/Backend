const express = require('express');
const UserController = require('../controllers/User_controller');
const router = express.Router();

// Create user
router.post('/', UserController.createUser);

// Get all users
router.get('/', UserController.getAllUsers);

// Get user by email
router.get('/email/:email', UserController.getUserByEmail);

// Get users by role
router.get('/role/:role', UserController.getUsersByRole);

// Search users
router.get('/search', UserController.searchUsers); // Changed from '/search/users'

// Get user by ID (must come after specific routes)
router.get('/:id', UserController.getUserById);

// Update user by ID
router.put('/:id', UserController.updateUser);

// Delete user by ID
router.delete('/:id', UserController.deleteUser);

// Verify user email
router.patch('/:id/verify', UserController.verifyUser);

// Update user address
router.patch('/:id/address', UserController.updateUserAddress);

module.exports = router;