import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_OPTIONS = {
  bufferCommands: true,
  maxPoolSize: 10,
}

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    mongoose.connect(MONGODB_URI, DB_OPTIONS).then(() => mongoose.connection);
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}
