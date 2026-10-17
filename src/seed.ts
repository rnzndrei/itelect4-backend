import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { Book } from "./models/Book";
import { BOOKS } from "./data/books";

async function seed() {
  await connectDB();
  for (const book of BOOKS) {
    await Book.updateOne({ isbn: book.isbn }, book, { upsert: true });
  }
  console.log(`${BOOKS.length} books in ${mongoose.connection.name}`);
  await mongoose.disconnect();
}
seed().catch((err: unknown) => { console.error("Seed failed:", err); process.exit(1); });