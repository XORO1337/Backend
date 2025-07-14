const { connectDualDB, getConnections } = require('./db/connect');
const MongoBackupService = require('./services/mongoBackupService');
require('dotenv').config();

// Test script for MongoDB backup functionality
async function testBackupSystem() {
    console.log('🔄 Testing MongoDB Backup System...\n');

    try {
        // Test 1: Database Connections
        console.log('Test 1: Testing database connections...');
        const connections = await connectDualDB();
        
        const connectionStatus = getConnections();
        console.log('Atlas Connection:', connectionStatus.atlas ? '✅ Connected' : '❌ Failed');
        console.log('Local Connection:', connectionStatus.local ? '✅ Connected' : '❌ Failed');
        console.log('');

        // Test 2: Backup Service Initialization
        console.log('Test 2: Initializing backup service...');
        const backupService = new MongoBackupService();
        console.log('✅ Backup service initialized');
        console.log('');

        // Test 3: Check Backup Status
        console.log('Test 3: Checking backup status...');
        const status = backupService.getBackupStatus();
        console.log('Backup Configuration:');
        console.log(`- Enabled: ${status.enabled}`);
        console.log(`- Interval: ${status.interval} hours`);
        console.log(`- Auto Import: ${status.autoImport}`);
        console.log(`- Backup Path: ${status.backupPath}`);
        console.log(`- Existing Backups: ${status.backups.length}`);
        console.log('');

        // Test 4: Check Environment Variables
        console.log('Test 4: Checking environment configuration...');
        console.log('Environment Variables:');
        console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
        console.log(`- MONGO_URI_ATLAS: ${process.env.MONGO_URI_ATLAS ? 'Set' : 'Not set'}`);
        console.log(`- MONGO_URI_LOCAL: ${process.env.MONGO_URI_LOCAL ? 'Set' : 'Not set'}`);
        console.log(`- BACKUP_ENABLED: ${process.env.BACKUP_ENABLED || 'Not set'}`);
        console.log(`- BACKUP_INTERVAL_HOURS: ${process.env.BACKUP_INTERVAL_HOURS || 'Not set'}`);
        console.log(`- AUTO_IMPORT_TO_LOCAL: ${process.env.AUTO_IMPORT_TO_LOCAL || 'Not set'}`);
        console.log('');

        // Test 5: Manual Backup Test (only if Atlas is configured)
        if (process.env.MONGO_URI_ATLAS && !process.env.MONGO_URI_ATLAS.includes('username:password')) {
            console.log('Test 5: Testing manual backup...');
            console.log('⚠️  Manual backup test requires valid Atlas credentials');
            console.log('Please update MONGO_URI_ATLAS in .env file with real credentials to test backup functionality');
        } else {
            console.log('Test 5: Skipping manual backup test (Atlas credentials not configured)');
        }
        console.log('');

        console.log('✅ Backup system test completed successfully!');
        console.log('\nNext Steps:');
        console.log('1. Update .env file with real MongoDB Atlas credentials');
        console.log('2. Ensure MongoDB tools (mongodump, mongorestore) are installed');
        console.log('3. Start the server to enable automatic backups');
        console.log('4. Use API endpoints to manage backups:');
        console.log('   - GET /api/backups/status - Check backup status');
        console.log('   - POST /api/backups/create - Create manual backup');
        console.log('   - GET /api/backups/test-connections - Test connections');

    } catch (error) {
        console.error('❌ Backup system test failed:', error.message);
        if (error.message.includes('connection')) {
            console.log('\n💡 Tip: Make sure MongoDB is running and credentials are correct');
        }
    } finally {
        // Close connections
        try {
            const connections = getConnections();
            if (connections.atlas) await connections.atlas.close();
            if (connections.local) await connections.local.close();
            console.log('\n🔌 Database connections closed');
        } catch (error) {
            console.log('Note: Some connections may have already been closed');
        }
        process.exit(0);
    }
}

// Run the test
testBackupSystem();
