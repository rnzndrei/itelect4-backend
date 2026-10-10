import { Schema, model } from "mongoose";
import type { TransactionDoc } from "../types/index";

const transactionSchema = new Schema<TransactionDoc>(
  {
    // Rule 1: Required ObjectId referencing the User collection
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    bookId: {
      type: Number,
      required: true,
    },

    // Rule 2: Enum validation
    status: {
      type: String,
      enum: ["REQUESTED", "APPROVED", "BORROWED", "RETURNED", "OVERDUE"],
      default: "REQUESTED",
    },

    requestDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },

    // Rule 3: Min/Max length validation (matches your Session 8 Zod schema!)
    notes: {
      type: String,
      minlength: 10,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

// Transform the document for JSON responses
transactionSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    // Convert ObjectIds to strings if they exist in the response
    if (ret.userId) {
      ret.userId = String(ret.userId);
    }
    return ret;
  },
});

export const Transaction = model<TransactionDoc>("Transaction", transactionSchema);