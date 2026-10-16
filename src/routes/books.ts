import { Router, type Request, type Response } from "express";
import { Book } from "../models/Book";

export const bookRouter = Router();

// GET /api/books
bookRouter.get("/", async (_req: Request, res: Response) => {
  const books = await Book.find().sort({ title: 1 });
  res.json(books);
});

// GET /api/books/:id
bookRouter.get("/:id", async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404).json({ message: "No book found" });
    return;
  }
  res.json(book);
});