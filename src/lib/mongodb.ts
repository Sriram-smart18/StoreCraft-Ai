import mongoose from 'mongoose';

// Ensure no client-side execution
if (typeof window !== 'undefined') {
  throw new Error('This module should only be used on the server');
}

const MONGODB_URI = process.env.MONGODB_URI;

// Add debugging safety check temporarily:
console.log("MongoDB URI loaded:", process.env.MONGODB_URI?.substring(0, 20));

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  throw new Error('Invalid scheme, expected connection string to start with mongodb:// or mongodb+srv://');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      family: 4,
    };

    const uri = process.env.MONGODB_URI!;
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If the promise rejected previously (or now), clear the cache so it retries on next call
    cached.promise = null;
    cached.conn = null;
    
    // Also clear the global cache completely
    (global as any).mongoose = { conn: null, promise: null };
    
    throw e;
  }
  
  return cached.conn;
}

export default connectToDatabase;
