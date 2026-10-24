import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { authRouter } from "./routes/auth";
import { transactionRouter } from "./routes/transactions";
import { bookRouter } from "./routes/books";
import { aiRouter } from "./routes/ai"; // <-- Import is here

export const app = express();

// 1. CORS MUST come first
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN ?? "").split(",").map((o) => o.trim()).filter((o) => o !== "");
app.use(cors({ origin: ALLOWED_ORIGINS }));

// 2. JSON parsing MUST come before any routes
app.use(express.json());

// 3. Database connection middleware
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

// 4. Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

// 5. ALL ROUTES go here, AFTER cors and express.json()
app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/books", bookRouter);
app.use("/api/ai", aiRouter); // <-- MOVED DOWN HERE

// 6. 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
});

// 7. Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ message: "Validation failed", errors: Object.values(err.errors).map((e) => e.message) }); 
    return;
  }
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: `"${err.value}" is not a valid id` }); 
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

// Vercel needs this!
export default app;