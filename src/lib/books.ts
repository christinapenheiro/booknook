import fs from "fs";
import path from "path";
import { Book } from "@/types/book";

export function getAllBooks(): Book[] {
  try {
    const filePath = path.join(process.cwd(), "public", "api.txt");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const books: Book[] = JSON.parse(fileContent);
    return books;
  } catch (error) {
    console.error("Failed to load books from public/api.txt:", error);
    return [];
  }
}

export function getFirstNBooks(count: number = 6): Book[] {
  const books = getAllBooks();
  return books.slice(0, count);
}

export function getBookById(id: string): Book | undefined {
  const books = getAllBooks();
  return books.find((book) => book._id === id);
}
