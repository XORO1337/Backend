const express = require('express');
const router = express.Router();
const BackupController = require('../controllers/BackupController');
const auth = require('../middleware/auth');

// Admin middleware to ensure only admins can access backup routes
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
};

// Get backup status and history
router.get('/status', auth, requireAdmin, BackupController.getBackupStatus);

// Create manual backup
router.post('/create', auth, requireAdmin, BackupController.createManualBackup);

// Import backup to local MongoDB
router.post('/import', auth, requireAdmin, BackupController.importBackupToLocal);

// Clean old backups
router.post('/clean', auth, requireAdmin, BackupController.cleanOldBackups);

// Test database connections
router.get('/test-connections', auth, requireAdmin, BackupController.testConnections);

module.exports = router;
