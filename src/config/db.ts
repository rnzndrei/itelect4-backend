import mongoose from "mongoose";

// Keep one connection promise. Vercel calls this on every request,
// but we only want to connect ONCE per instance.
let connection: Promise<typeof mongoose> | null = null;

export function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing.");
  }

  if (connection === null) {
    connection = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 5000 })
      .then((m) => {
        console.log("MongoDB connected:", m.connection.name);
        return m;
      })
      .catch((err: unknown) => {
        connection = null; // Reset so next request can try again
        throw err;
      });
  }

  return connection;
}