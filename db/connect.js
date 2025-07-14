const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Store multiple connections
const connections = {
    atlas: null,
    local: null
};

const connectDB = async (mongo_URI, connectionName = 'default') => {
    try {
        const conn = await mongoose.createConnection(mongo_URI);

        console.log(`MongoDB Connected (${connectionName}): ${conn.host}`);
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB (${connectionName}): ${error.message}`);
        throw error;
    }
};

// Connect to both Atlas and Local MongoDB
const connectDualDB = async () => {
    try {
        // Connect to Atlas MongoDB
        if (process.env.MONGO_URI_ATLAS) {
            connections.atlas = await connectDB(process.env.MONGO_URI_ATLAS, 'Atlas');
        }

        // Connect to Local MongoDB
        if (process.env.MONGO_URI_LOCAL) {
            connections.local = await connectDB(process.env.MONGO_URI_LOCAL, 'Local');
        }

        console.log('Dual MongoDB connections established successfully');
        return connections;
    } catch (error) {
        console.error('Error establishing dual MongoDB connections:', error);
        throw error;
    }
};

// Get specific connection
const getConnection = (type = 'atlas') => {
    return connections[type];
};

// Get all connections
const getConnections = () => {
    return connections;
};

module.exports = {
    connectDB,
    connectDualDB,
    getConnection,
    getConnections
};