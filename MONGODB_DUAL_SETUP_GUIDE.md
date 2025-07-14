# MongoDB Dual Connection & Backup Setup Guide

This guide will help you set up a MongoDB system with concurrent connections to both MongoDB Atlas and local MongoDB, with automatic backup functionality.

## Prerequisites

1. **MongoDB Atlas Account**: Create a cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. **Local MongoDB**: Install MongoDB locally or use Docker
3. **MongoDB Database Tools**: Required for backup/restore operations
4. **Node.js**: Version 16 or higher

## Step 1: Install MongoDB Database Tools

### Ubuntu/Debian
```bash
# Import the public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install database tools
sudo apt-get update
sudo apt-get install mongodb-database-tools
```

### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-database-tools
```

### Windows
Download from: https://www.mongodb.com/try/download/database-tools

## Step 2: Set Up MongoDB Atlas

1. **Create Atlas Cluster**:
   - Go to MongoDB Atlas
   - Create a new cluster (Free tier is fine for development)
   - Choose a region closest to your location

2. **Create Database User**:
   - Go to Database Access
   - Add a new database user with read/write permissions
   - Note the username and password

3. **Configure Network Access**:
   - Go to Network Access
   - Add IP address (0.0.0.0/0 for development, or your specific IP)

4. **Get Connection String**:
   - Go to Database > Connect
   - Choose "Connect your application"
   - Copy the connection string

## Step 3: Set Up Local MongoDB

### Using Docker (Recommended)
```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d \
  --name mongodb-local \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongodb_data:/data/db \
  mongo:latest
```

### Native Installation
Follow the official MongoDB installation guide for your operating system:
- [Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
- [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
- [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

## Step 4: Configure Environment Variables

Update your `.env` file with the following configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
# Replace with your actual Atlas connection string
MONGO_URI_ATLAS=mongodb+srv://username:password@cluster0.mongodb.net/artisan_management?retryWrites=true&w=majority

# Local MongoDB Connection
MONGO_URI_LOCAL=mongodb://localhost:27017/artisan_management

# Database Backup Configuration
BACKUP_ENABLED=true
BACKUP_INTERVAL_HOURS=6
BACKUP_PATH=./backups
AUTO_IMPORT_TO_LOCAL=true

# Your existing configuration...
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
# ... rest of your config
```

### Important Notes:
- Replace `username:password` with your actual Atlas credentials
- Replace `cluster0.mongodb.net` with your actual cluster URL
- Adjust `BACKUP_INTERVAL_HOURS` as needed (1-24 hours recommended)

## Step 5: Install Dependencies

```bash
cd /workspaces/Backend
npm install node-cron
```

## Step 6: Test the Setup

Run the backup system test:

```bash
node test-backup-system.js
```

Expected output:
```
🔄 Testing MongoDB Backup System...

Test 1: Testing database connections...
MongoDB Connected (Atlas): cluster0-shard-00-00.mongodb.net
MongoDB Connected (Local): localhost
Atlas Connection: ✅ Connected
Local Connection: ✅ Connected

Test 2: Initializing backup service...
✅ Backup service initialized

Test 3: Checking backup status...
Backup Configuration:
- Enabled: true
- Interval: 6 hours
- Auto Import: true
- Backup Path: ./backups
- Existing Backups: 0

✅ Backup system test completed successfully!
```

## Step 7: Start the Server

```bash
npm start
# or for development
npm run dev
```

Server should start with output:
```
✅ Connected to MongoDB databases successfully
🔄 Backup service initialized
🚀 Server is running on port 3000
📱 API available at: http://localhost:3000
🔍 Health check: http://localhost:3000/api/health
💾 Backup management: http://localhost:3000/api/backups
```

## Step 8: Test API Endpoints

### Check Backup Status (Admin required)
```bash
curl -X GET http://localhost:3000/api/backups/status \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Test Database Connections
```bash
curl -X GET http://localhost:3000/api/backups/test-connections \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Create Manual Backup
```bash
curl -X POST http://localhost:3000/api/backups/create \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

## Step 9: Verify Backup Functionality

1. **Check Backup Directory**:
   ```bash
   ls -la ./backups/
   ```

2. **Monitor Server Logs**:
   - Look for "Running scheduled backup..." messages
   - Check for any error messages

3. **Verify Local Database**:
   ```bash
   # Connect to local MongoDB
   mongosh mongodb://localhost:27017/artisan_management
   
   # List collections
   show collections
   
   # Check data
   db.users.countDocuments()
   ```

## Backup Schedule

The system will automatically:
1. Create backups every 6 hours (configurable)
2. Store backups in `./backups/` directory
3. Import backups to local MongoDB if `AUTO_IMPORT_TO_LOCAL=true`
4. Log all backup operations

## Troubleshooting

### Connection Issues

1. **Atlas Connection Failed**:
   - Verify credentials in connection string
   - Check network access settings in Atlas
   - Ensure IP is whitelisted

2. **Local Connection Failed**:
   - Ensure MongoDB is running locally
   - Check port 27017 is not blocked
   - Verify MongoDB service status

### Backup Issues

1. **mongodump Command Not Found**:
   - Install MongoDB Database Tools
   - Add tools to system PATH

2. **Permission Denied on Backup Directory**:
   ```bash
   mkdir -p ./backups
   chmod 755 ./backups
   ```

3. **Backup Failed with Authentication Error**:
   - Verify Atlas user has backup permissions
   - Check connection string format

### Import Issues

1. **mongorestore Command Failed**:
   - Ensure local MongoDB is running
   - Check local database permissions
   - Verify backup file integrity

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files to version control
2. **Network Security**: Use IP whitelisting in Atlas
3. **Authentication**: Use strong passwords and rotate credentials regularly
4. **Backup Security**: Secure backup directory with appropriate permissions
5. **Admin Access**: Restrict backup API endpoints to admin users only

## Monitoring and Maintenance

1. **Log Monitoring**: Check server logs for backup success/failure
2. **Disk Space**: Monitor backup directory size
3. **Connection Health**: Use `/api/backups/test-connections` endpoint
4. **Backup Cleanup**: Regularly clean old backups to save space

```bash
# Clean old backups (keep last 5)
curl -X POST http://localhost:3000/api/backups/clean \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"keepCount": 5}'
```

## Production Considerations

1. **Backup Frequency**: Adjust based on data change rate
2. **Storage**: Consider external storage for large backups
3. **Monitoring**: Set up alerts for backup failures
4. **Recovery Testing**: Regularly test backup restoration
5. **Documentation**: Keep recovery procedures documented

Your MongoDB dual connection and backup system is now ready for use!
