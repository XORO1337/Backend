const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async (mongo_URI) => {
    try {
        const conn = await mongoose.connect(mongo_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;

// LocalHost and MongoDB Atlas DB on both can be used