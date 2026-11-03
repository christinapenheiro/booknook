import { UploadedBook } from "@/types/uploadedBook";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function getBookById(
  id: string,
): Promise<UploadedBook | undefined> {
  try {
    let token: string | undefined = undefined;
    try {
      const jwtToken = await auth.api.getToken({
        headers: await headers(),
      });
      token = jwtToken?.token;
    } catch {
      // Unauthenticated
    }

    const apiUrl = process.env.GET_BOOKS_API;
    if (!apiUrl) {
      throw new Error("GET_BOOKS_API environment variable is not defined.");
    }
    const cleanUrl = apiUrl.replace(/\/$/, "");
    const headersInit: Record<string, string> = {};
    if (token) {
      headersInit.authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${cleanUrl}/${id}`, {
      headers: headersInit,
      cache: "no-store",
    });

    if (!res.ok) {
      return undefined;
    }
    const book: UploadedBook = await res.json();
    return book || undefined;
  } catch (error) {
    console.error(`Failed to load book with id ${id}:`, error);
    return undefined;
  }
}

export async function getBooksServer(): Promise<UploadedBook[]> {
  try {
    let token: string | undefined = undefined;
    try {
      const jwtToken = await auth.api.getToken({
        headers: await headers(),
      });
      token = jwtToken?.token;
    } catch {
      // Public access without session
    }

    const apiUrl = process.env.GET_BOOKS_API;
    if (!apiUrl) {
      throw new Error("GET_BOOKS_API environment variable is not defined.");
    }

    const headersInit: Record<string, string> = {};
    if (token) {
      headersInit.authorization = `Bearer ${token}`;
    }

    const res = await fetch(apiUrl, {
      headers: headersInit,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const books: UploadedBook[] = await res.json();
    return books;
  } catch (error) {
    console.error("Failed to load books:", error);
    return [];
  }
}

export { getBooksServer as getAllBooks };
