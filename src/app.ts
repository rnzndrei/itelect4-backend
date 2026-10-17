import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { authRouter } from "./routes/auth";
import { transactionRouter } from "./routes/transactions";
import { bookRouter } from "./routes/books";

export const app = express();

// CORS: Only allow specific origins
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN ?? "").split(",").map((o) => o.trim()).filter((o) => o !== "");
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

// Middleware: Wait for DB connection before routes run
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/books", bookRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
});

// Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ message: "Validation failed", errors: Object.values(err.errors).map((e) => e.message) }); return;
  }
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: `"${err.value}" is not a valid id` }); return;
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

// Vercel needs this!
export default app;