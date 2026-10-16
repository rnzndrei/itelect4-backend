import type { Types } from "mongoose";

// ===== FROM SESSION 1: The Core Interfaces =====
export interface User {
  id: number;
  name: string;
  email: string;
  role: "MEMBER" | "LIBRARIAN";
  isActive: boolean;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  total_copies: number;
  available_copies: number;
  description: string;
}

export interface Transaction {
  id: number;
  userId: number;
  bookId: number;
  status: "REQUESTED" | "APPROVED" | "BORROWED" | "RETURNED" | "OVERDUE";
  requestDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  notes?: string;
}

// ===== BACKEND DERIVED TYPES =====

// What the database actually stores for a User.
// MongoDB uses ObjectIds, not numbers. We also add 'password' here.
export type UserDoc = Omit<User, "id"> & {
  password: string;
};

// Omit "id" because MongoDB generates _id automatically
export type BookDoc = Omit<Book, "id">;

// What the database actually stores for a Transaction.
// userId is an ObjectId pointing to a User document.
export type TransactionDoc = Omit<Transaction, "id" | "userId" | "requestDate" | "dueDate" | "returnDate"> & {
  userId: Types.ObjectId;
  requestDate: Date;
  dueDate: Date;
  returnDate: Date | null;
};

// The body a client sends to create a transaction.
// No id, no userId (server reads that off the token), dates are generated server-side.
export type NewTransactionBody = Pick<Transaction, "bookId" | "notes">;