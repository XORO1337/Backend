const express = require('express');
const UserController = require('../controllers/User_controller');
const router = express.Router();

// Create user
router.post('/', UserController.createUser);

// Get all users
router.get('/', UserController.getAllUsers);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Get user by email
router.get('/email/:email', UserController.getUserByEmail);

// Update user by ID
router.put('/:id', UserController.updateUser);

// Delete user by ID
router.delete('/:id', UserController.deleteUser);

// Get users by role
router.get('/role/:role', UserController.getUsersByRole);

// Verify user email
router.patch('/:id/verify', UserController.verifyUser);

// Update user address
router.patch('/:id/address', UserController.updateUserAddress);

// Search users
router.get('/search/users', UserController.searchUsers);

module.exports = router;