import { z } from "zod";

// What the user sends to the AI
export const aiRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Describe your research need in at least 20 characters.")
    .max(2000, "Keep the description under 2000 characters."),
});

// What Gemini must send back (Adapted for Library System)
export const reviewSchema = z.object({
  summary: z
    .string()
    .describe("One sentence summarizing the user's research need."),
  strengths: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("Why this is a good topic for research."),
  improvements: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("Suggestions to broaden or improve their book search."),
  urgency: z
    .enum(["urgent", "normal", "low"])
    .describe("How urgently they likely need this book."),
});

export type Review = z.infer<typeof reviewSchema>;

// This converts the Zod schema to JSON Schema for Gemini
export const reviewJsonSchema = z.toJSONSchema(reviewSchema);