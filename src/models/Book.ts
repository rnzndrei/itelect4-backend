import { Schema, model } from "mongoose";
import type { BookDoc } from "../types/index";

const bookSchema = new Schema<BookDoc>({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, required: true, unique: true },
  total_copies: { type: Number, required: true, min: 1 },
  available_copies: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
});

bookSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Book = model<BookDoc>("Book", bookSchema);