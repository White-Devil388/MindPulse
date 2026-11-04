import mongoose from 'mongoose';
import dns from 'dns';

// Ensure reliable SRV DNS resolution for MongoDB Atlas across local ISP DNS blockers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not allowed in specific environment
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindpulse';
  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 20, // Maintain up to 20 socket connections for high concurrency
      minPoolSize: 5,  // Maintain minimum 5 warm connections
      serverSelectionTimeoutMS: 5000, // Timeout fast after 5s instead of hanging
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name}) [Pool: 5-20]`);
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    console.log('[Database Warning] Continuing in standalone/offline mode. DB operations will require MongoDB running.');
  }
};
