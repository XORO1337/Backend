const express = require('express');
const router = express.Router();
const ArtisanService = require('../services/Artisan_serv');

// Create a new artisan profile
router.post('/', async (req, res) => {
  try {
    const artisan = await ArtisanService.createArtisanProfile(req.body);
    res.status(201).json({
      success: true,
      message: 'Artisan profile created successfully',
      data: artisan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get all artisan profiles with pagination and filters
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {};

    // Extract filters from query parameters
    if (req.query.region) filters.region = req.query.region;
    if (req.query.skills) {
      filters.skills = Array.isArray(req.query.skills) 
        ? req.query.skills 
        : req.query.skills.split(',');
    }

    const result = await ArtisanService.getAllArtisanProfiles(page, limit, filters);
    res.status(200).json({
      success: true,
      message: 'Artisan profiles retrieved successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get artisan profile by ID
router.get('/:id', async (req, res) => {
  try {
    const artisan = await ArtisanService.getArtisanProfileById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Artisan profile retrieved successfully',
      data: artisan
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// Get artisan profile by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const artisan = await ArtisanService.getArtisanProfileByUserId(req.params.userId);
    res.status(200).json({
      success: true,
      message: 'Artisan profile retrieved successfully',
      data: artisan
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// Update artisan profile by ID
router.put('/:id', async (req, res) => {
  try {
    const artisan = await ArtisanService.updateArtisanProfile(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Artisan profile updated successfully',
      data: artisan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update artisan profile by user ID
router.put('/user/:userId', async (req, res) => {
  try {
    const artisan = await ArtisanService.updateArtisanProfileByUserId(req.params.userId, req.body);
    res.status(200).json({
      success: true,
      message: 'Artisan profile updated successfully',
      data: artisan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete artisan profile by ID
router.delete('/:id', async (req, res) => {
  try {
    const artisan = await ArtisanService.deleteArtisanProfile(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Artisan profile deleted successfully',
      data: artisan
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// Delete artisan profile by user ID
router.delete('/user/:userId', async (req, res) => {
  try {
    const artisan = await ArtisanService.deleteArtisanProfileByUserId(req.params.userId);
    res.status(200).json({
      success: true,
      message: 'Artisan profile deleted successfully',
      data: artisan
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// Search artisans by skills
router.get('/search/skills', async (req, res) => {
  try {
    const skills = req.query.skills ? req.query.skills.split(',') : [];
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Skills parameter is required'
      });
    }

    const result = await ArtisanService.searchArtisansBySkills(skills, page, limit);
    res.status(200).json({
      success: true,
      message: 'Artisans found by skills',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Search artisans by region
router.get('/search/region', async (req, res) => {
  try {
    const region = req.query.region;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!region) {
      return res.status(400).json({
        success: false,
        message: 'Region parameter is required'
      });
    }

    const result = await ArtisanService.searchArtisansByRegion(region, page, limit);
    res.status(200).json({
      success: true,
      message: 'Artisans found by region',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update bank details
router.patch('/:id/bank-details', async (req, res) => {
  try {
    const artisan = await ArtisanService.updateBankDetails(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Bank details updated successfully',
      data: artisan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Add skill to artisan
router.patch('/:id/skills/add', async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Skill is required'
      });
    }

    const artisan = await ArtisanService.addSkill(req.params.id, skill);
    res.status(200).json({
      success: true,
      message: 'Skill added successfully',
      data: artisan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Remove skill from artisan
router.patch('/:id/skills/remove', async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Skill is required'
      });
    }

    const artisan = await ArtisanService.removeSkill(req.params.id, skill);
    res.status(200).json({
      success: true,
      message: 'Skill removed successfully',
      data: artisan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
