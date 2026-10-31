import { UploadedBook } from "@/types/uploadedBook";

export async function getAllBooks(): Promise<UploadedBook[]> {
  try {
    const apiUrl = process.env.GET_BOOKS_API;
    if(!apiUrl){
      throw new Error("GET_BOOKS_API environment variable is not defined.");
    }
    const res = await fetch (apiUrl);

    if(!res.ok){
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const books: UploadedBook[] = await res.json()
    return books;
  } catch (error) {
    console.error("Failed to load books:", error);
    return [];
  }
}

export async function getFirstNBooks(count: number = 6): Promise<UploadedBook[]> {
  const books = await getAllBooks();
  return books.slice(0, count);
}

export async function getBookById(id: string): Promise<UploadedBook | undefined> {
  const books = await getAllBooks();
  return books.find((book) => book._id === id);
}
