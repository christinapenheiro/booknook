import { Metadata } from "next";
import { Suspense } from "react";
import { getAllBooks } from "@/lib/books";
import AllBooksClient from "./AllBooksClient";

export const metadata: Metadata = {
  title: "All Books | BookNook Library",
  description: "Browse the entire BookNook online catalog. Find fiction, science, history, and more to borrow.",
};

export default async function AllBooksPage() {
  const books = await getAllBooks();

  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center text-neutral-500">Loading catalog...</div>}>
      <AllBooksClient initialBooks={books} />
    </Suspense>
  );
}
