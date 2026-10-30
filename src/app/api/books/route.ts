import { NextResponse } from "next/server";
import { getAllBooks } from "@/lib/books";

export async function GET() {
  const books = getAllBooks();
  return NextResponse.json(books);
}
