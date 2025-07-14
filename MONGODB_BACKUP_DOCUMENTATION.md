# MongoDB Backup System Documentation

This system provides automatic backup functionality for MongoDB Atlas to local MongoDB with scheduled backups and real-time synchronization.

## Features

- **Dual Database Connections**: Concurrent connections to MongoDB Atlas and local MongoDB
- **Automatic Backups**: Scheduled backups from Atlas to local storage using cron jobs
- **Auto Import**: Automatic import of Atlas backups to local MongoDB
- **Manual Backup**: On-demand backup creation via API
- **Backup Management**: List, clean, and manage backup files
- **Connection Testing**: Health check for both database connections

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```env
# Database Configuration
MONGO_URI_ATLAS=mongodb+srv://username:password@cluster.mongodb.net/artisan_management?retryWrites=true&w=majority
MONGO_URI_LOCAL=mongodb://localhost:27017/artisan_management

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_INTERVAL_HOURS=6
BACKUP_PATH=./backups
AUTO_IMPORT_TO_LOCAL=true
```

### Required Tools

Install MongoDB Database Tools for backup/restore functionality:

```bash
# Ubuntu/Debian
sudo apt-get install mongodb-database-tools

# macOS
brew install mongodb/brew/mongodb-database-tools

# Windows
# Download from: https://www.mongodb.com/try/download/database-tools
```

## API Endpoints

All backup endpoints require admin authentication.

### Get Backup Status
```
GET /api/backups/status
```

Returns backup configuration and list of existing backups.

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "interval": 6,
    "autoImport": true,
    "backupPath": "./backups",
    "backups": [
      {
        "name": "atlas-backup-2025-01-14T10-30-00-000Z",
        "path": "./backups/atlas-backup-2025-01-14T10-30-00-000Z",
        "created": "2025-01-14T10:30:00.000Z",
        "size": 1048576
      }
    ]
  }
}
```

### Create Manual Backup
```
POST /api/backups/create
```

Triggers immediate backup from Atlas to local storage.

**Response:**
```json
{
  "success": true,
  "message": "Manual backup completed successfully",
  "data": {
    "backupPath": "./backups/atlas-backup-2025-01-14T10-30-00-000Z",
    "imported": true
  }
}
```

### Import Backup to Local
```
POST /api/backups/import
```

**Request Body:**
```json
{
  "backupPath": "./backups/atlas-backup-2025-01-14T10-30-00-000Z",
  "databaseName": "artisan_management"
}
```

### Clean Old Backups
```
POST /api/backups/clean
```

**Request Body:**
```json
{
  "keepCount": 5
}
```

Removes old backups, keeping only the specified number of recent backups.

### Test Database Connections
```
GET /api/backups/test-connections
```

**Response:**
```json
{
  "success": true,
  "data": {
    "atlas": {
      "connected": true,
      "host": "cluster0-shard-00-00.mongodb.net"
    },
    "local": {
      "connected": true,
      "host": "localhost"
    }
  }
}
```

## Service Architecture

### MongoBackupService

Core service handling backup operations:

- **createBackup()**: Creates backup from Atlas using mongodump
- **importToLocal()**: Imports backup to local MongoDB using mongorestore
- **startAutomaticBackup()**: Initializes cron job for scheduled backups
- **getBackupStatus()**: Returns backup configuration and history
- **cleanOldBackups()**: Removes old backup files

### Database Connections

The system maintains separate connections:

- **Atlas Connection**: Primary connection to MongoDB Atlas
- **Local Connection**: Connection to local MongoDB instance

### Automatic Backup Process

1. Cron job runs every N hours (configurable)
2. Creates backup from Atlas using mongodump
3. Saves backup to local filesystem
4. If auto-import enabled, restores backup to local MongoDB
5. Logs success/failure for monitoring

## Usage Examples

### Starting the System

```javascript
const { connectDualDB } = require('./db/connect');
const MongoBackupService = require('./services/mongoBackupService');

// Initialize connections and backup service
await connectDualDB();
const backupService = new MongoBackupService();
```

### Manual Backup

```javascript
const result = await backupService.manualBackup();
console.log('Backup created:', result.backupPath);
```

### Check Connection Status

```javascript
const { getConnections } = require('./db/connect');
const connections = getConnections();

console.log('Atlas connected:', connections.atlas?.readyState === 1);
console.log('Local connected:', connections.local?.readyState === 1);
```

## Testing

Run the backup system test:

```bash
node test-backup-system.js
```

This will:
- Test database connections
- Initialize backup service
- Check configuration
- Validate environment variables

## Security Considerations

1. **Admin Access**: Backup endpoints require admin authentication
2. **Connection Strings**: Store MongoDB URIs securely in environment variables
3. **File Permissions**: Ensure backup directory has appropriate permissions
4. **Network Security**: Use secure connections (TLS) for MongoDB Atlas

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check MongoDB Atlas credentials
   - Verify network connectivity
   - Ensure IP whitelist includes your server

2. **Backup Failed**
   - Install MongoDB database tools
   - Check disk space in backup directory
   - Verify Atlas user has backup permissions

3. **Import Failed**
   - Ensure local MongoDB is running
   - Check local MongoDB permissions
   - Verify backup file integrity

### Error Messages

- `Atlas MongoDB URI not configured`: Set MONGO_URI_ATLAS in .env
- `Local MongoDB URI not configured`: Set MONGO_URI_LOCAL in .env
- `Database backup not found`: Check backup path and file existence
- `Invalid Atlas URI format`: Verify MongoDB Atlas connection string format

## Monitoring

The system provides logging for:
- Backup creation start/completion
- Import start/completion
- Scheduled backup execution
- Error conditions and failures

Monitor logs for backup health and investigate any failures promptly.

## Best Practices

1. **Regular Testing**: Test backup and restore procedures regularly
2. **Storage Management**: Clean old backups to manage disk space
3. **Monitoring**: Set up alerts for backup failures
4. **Security**: Rotate database credentials periodically
5. **Documentation**: Keep backup procedures documented and up-to-date
