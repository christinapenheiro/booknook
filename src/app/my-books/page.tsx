import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllBooks } from "@/lib/books";
import { Library, PlusCircle, ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "My Books | BookNook Library",
  description: "Manage the books you have contributed to BookNook.",
};

export default async function MyBooksPage() {
  const books = await getAllBooks();
  // Filter books added by user or sample contributed books
  const myBooks = books.slice(0, 4);

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D99950]/15 text-[#D99950] text-xs font-semibold uppercase tracking-wider mb-2">
              <Library className="w-3.5 h-3.5" />
              <span>Personal Shelf</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-neutral-900">
              My Contributed Books
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Books you have added to the BookNook community collection.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-xs font-semibold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Book</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex gap-5 items-center hover:border-[#D99950]/50 transition-all"
            >
              <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                <Image
                  src={book.book_image}
                  alt={book.book_title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[11px] font-semibold text-[#D99950] uppercase">
                  {book.category}
                </span>
                <h3 className="font-serif font-bold text-base text-neutral-900 truncate">
                  {book.book_title}
                </h3>
                <p className="text-xs text-neutral-500 truncate">{book.author_name}</p>

                <div className="pt-2 text-xs text-neutral-600 flex items-center gap-3">
                  <span>Copies: <strong>{book.copies_left}</strong></span>
                  <span>•</span>
                  <span>Rating: <strong>★ {book.rating}</strong></span>
                </div>

                <div className="pt-3">
                  <Link
                    href={`/books/${book._id}`}
                    className="text-xs font-semibold text-[#D99950] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Public Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
