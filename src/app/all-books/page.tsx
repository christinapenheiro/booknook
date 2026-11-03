import { Suspense } from "react";
import { getAllBooks, getBooksServer } from "@/lib/books-server";
import AllBooksClient from "./AllBooksClient";
import { Metadata } from "next";
import { publicBooks } from "@/lib/public_books";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Books | BookNook Library",
  description:
    "Browse the entire BookNook online catalog. Find fiction, science, history, and more to borrow.",
};

export default async function AllBooksPage() {
  const books = await publicBooks()

  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-20 text-center text-neutral-500 font-medium">
          Loading catalog...
        </div>
      }
    >
      <AllBooksClient initialBooks={books} />
    </Suspense>
  );
}
