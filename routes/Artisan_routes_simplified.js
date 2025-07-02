const express = require('express');
const router = express.Router();
const ArtisanController = require('../controllers/Artisan_controller');

// Basic CRUD Operations
router.post('/', ArtisanController.createArtisan);
router.get('/', ArtisanController.getAllArtisans);
router.get('/:id', ArtisanController.getArtisanById);
router.put('/:id', ArtisanController.updateArtisan);
router.delete('/:id', ArtisanController.deleteArtisan);

// User-specific operations
router.get('/user/:userId', ArtisanController.getArtisanByUserId);
router.put('/user/:userId', ArtisanController.updateArtisanByUserId);
router.delete('/user/:userId', ArtisanController.deleteArtisanByUserId);

// Search operations
router.get('/search/skills', ArtisanController.searchBySkills);
router.get('/search/region', ArtisanController.searchByRegion);

// Specific update operations
router.patch('/:id/bank-details', ArtisanController.updateBankDetails);
router.patch('/:id/skills/add', ArtisanController.addSkill);
router.patch('/:id/skills/remove', ArtisanController.removeSkill);

module.exports = router;
