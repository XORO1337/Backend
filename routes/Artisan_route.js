const express = require('express');
const router = express.Router();
const ArtisanController = require('../controllers/Artisan_controller');

// Create a new artisan profile
router.post('/', ArtisanController.createArtisan);

// Get all artisan profiles with pagination and filters
router.get('/', ArtisanController.getAllArtisans);

// Get artisan profile by ID
router.get('/:id', ArtisanController.getArtisanById);

// Get artisan profile by user ID
router.get('/user/:userId', ArtisanController.getArtisanByUserId);

// Update artisan profile by ID
router.put('/:id', ArtisanController.updateArtisan);

// Update artisan profile by user ID
router.put('/user/:userId', ArtisanController.updateArtisanByUserId);

// Delete artisan profile by ID
router.delete('/:id', ArtisanController.deleteArtisan);

// Delete artisan profile by user ID
router.delete('/user/:userId', ArtisanController.deleteArtisanByUserId);

// Search artisans by skills
router.get('/search/skills', ArtisanController.searchBySkills);

// Search artisans by region
router.get('/search/region', ArtisanController.searchByRegion);

// Update bank details
router.patch('/:id/bank-details', ArtisanController.updateBankDetails);

// Add skill to artisan
router.patch('/:id/skills/add', ArtisanController.addSkill);

// Remove skill from artisan
router.patch('/:id/skills/remove', ArtisanController.removeSkill);

module.exports = router;
