import mongoose from 'mongoose';
let isConnected = false;
let connectionPromise = null;
const connectDB = async () => {
    try {
        // If already connected, return early
        if (mongoose.connection.readyState >= 1) {
            isConnected = true;
            return;
        }
        // If a connection is already in progress, wait for it
        if (connectionPromise) {
            return connectionPromise;
        }
        // Check if MONGODB_URI is set
        if (!process.env.MONGODB_URI) {
            const error = new Error('MONGODB_URI is not set in environment variables');
            console.error(error.message);
            isConnected = false;
            throw error;
        }
        // Create connection promise
        connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            socketTimeoutMS: 45000,
        }).then((conn) => {
            isConnected = true;
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            connectionPromise = null;
        }).catch((error) => {
            isConnected = false;
            connectionPromise = null;
            console.error('MongoDB connection error:', error.message);
            throw error;
        });
        return connectionPromise;
    }
    catch (error) {
        isConnected = false;
        connectionPromise = null;
        console.error('MongoDB connection error:', error.message);
        throw error;
    }
};
// Export a function to check connection status
export const checkConnection = () => {
    return mongoose.connection.readyState >= 1;
};
export default connectDB;
