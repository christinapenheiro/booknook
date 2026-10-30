import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getBookById, getAllBooks } from "@/lib/books";
import { Star, ArrowLeft, Layers, ShieldCheck, Clock } from "lucide-react";
import BookDetailActions from "./BookDetailActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const books = getAllBooks();
  return books.map((book) => ({
    id: book._id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const book = getBookById(id);
  if (!book) return { title: "Book Not Found | BookNook" };
  return {
    title: `${book.book_title} | BookNook`,
    description: book.short_description || `Borrow ${book.book_title} by ${book.author_name} at BookNook.`,
  };
}

export default function BookDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-20 text-center text-neutral-500 font-medium">
          Loading book details...
        </div>
      }
    >
      <BookDetailContent params={params} />
    </Suspense>
  );
}

async function BookDetailContent({ params }: PageProps) {
  const { id } = await params;
  const book = getBookById(id);

  if (!book) {
    notFound();
  }

  // Related books from same category
  const allBooks = getAllBooks();
  const relatedBooks = allBooks
    .filter((b) => b._id !== book._id && b.category === book.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-8">
          <Link
            href="/all-books"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#D99950] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Books</span>
          </Link>
        </div>

        {/* Main Book Card */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12">
            {/* Left Cover Image */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 bg-neutral-100 group">
                <Image
                  src={book.book_image}
                  alt={book.book_title}
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D99950]" /> Verified Book Edition
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#D99950]" /> 7 Days Standard Borrow
                </span>
              </div>
            </div>

            {/* Right Information & Borrow Actions */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & Rating */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#D99950]/15 text-[#D99950] border border-[#D99950]/30">
                    {book.category}
                  </span>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800">
                    <Star className="w-3.5 h-3.5 fill-[#D99950] text-[#D99950]" />
                    <span>{book.rating ? Number(book.rating).toFixed(1) : "4.5"} / 5.0</span>
                  </div>
                  <span className="text-xs text-neutral-400">
                    Added by <strong className="text-neutral-700 capitalize">{book.added_by || "Librarian"}</strong>
                  </span>
                </div>

                {/* Title & Author */}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold font-serif text-neutral-900 leading-tight">
                    {book.book_title}
                  </h1>
                  <p className="text-lg text-[#D99950] font-medium mt-1">
                    by {book.author_name}
                  </p>
                </div>

                {/* Copies Left */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#D99950] border border-neutral-200 shadow-2xs">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Inventory Status</p>
                      <p className="text-sm font-semibold text-neutral-900">
                        {book.copies_left > 0 ? `${book.copies_left} copies available in library` : "Currently all copies borrowed"}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    book.copies_left > 0
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {book.copies_left > 0 ? "Available" : "Waitlist"}
                  </span>
                </div>

                {/* Synopsis / Description */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                    About This Book
                  </h3>
                  <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                    {book.short_description || "A wonderful addition to our library collection. Borrow to read the full work."}
                  </p>
                </div>
              </div>

              {/* Borrow and Actions Component */}
              <BookDetailActions book={book} />
            </div>
          </div>
        </div>

        {/* Related Books in same category */}
        {relatedBooks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-serif text-neutral-900">
                More in {book.category}
              </h2>
              <Link
                href={`/all-books`}
                className="text-xs font-semibold text-[#D99950] hover:underline"
              >
                View all books
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedBooks.map((rel) => (
                <Link
                  key={rel._id}
                  href={`/books/${rel._id}`}
                  className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-[#D99950]/50 hover:shadow-md transition-all flex items-center gap-4 group"
                >
                  <div className="relative w-16 h-22 rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200">
                    <Image
                      src={rel.book_image}
                      alt={rel.book_title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold font-serif text-neutral-900 group-hover:text-[#D99950] transition-colors truncate">
                      {rel.book_title}
                    </h4>
                    <p className="text-xs text-[#D99950] truncate">{rel.author_name}</p>
                    <p className="text-[11px] text-neutral-500 mt-1">{rel.copies_left} copies left</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
