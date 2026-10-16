import type { BookDoc } from "../types/index";

export const BOOKS: BookDoc[] = [
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    total_copies: 5,
    available_copies: 3,
    description: "A handbook of agile software craftsmanship.",
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    isbn: "978-0135957059",
    total_copies: 4,
    available_copies: 1,
    description: "Your journey to mastery.",
  },
];