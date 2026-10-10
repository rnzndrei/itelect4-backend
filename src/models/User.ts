import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import type { UserDoc } from "../types/index";

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["MEMBER", "LIBRARIAN"],
      default: "MEMBER",
    },
    isActive: { type: Boolean, default: true },
    // select: false ensures the password is never returned in queries unless explicitly requested
    password: { type: String, required: true, minlength: 8, select: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Transform the document when it is converted to JSON (for API responses)
userSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Never send the password hash to the client
    return ret;
  },
});

export const User = model<UserDoc>("User", userSchema);