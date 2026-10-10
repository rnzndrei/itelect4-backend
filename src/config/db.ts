import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing. Copy .env.example to .env and fill it in.");
  }

  // Fix: Cast the options object
  await mongoose.connect(uri, { 
    serverSelectionTimeoutMS: 5000 
  } as mongoose.ConnectOptions);
  
  console.log("MongoDB connected:", mongoose.connection.name);
}