"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpenCheck, RotateCcw, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

interface BorrowedItem {
  id: string;
  book_title: string;
  author_name: string;
  book_image: string;
  borrowed_date: string;
  due_date: string;
  days_left: number;
}

const initialBorrows: BorrowedItem[] = [
  {
    id: "6ae4cdb196a7294beb70f8ac",
    book_title: "To Kill a Mockingbird",
    author_name: "Harper Lee",
    book_image: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
    borrowed_date: "Oct 24, 2026",
    due_date: "Nov 02, 2026",
    days_left: 3,
  },
  {
    id: "6ae4cdb196a7294beb70f8b1",
    book_title: "The Hobbit",
    author_name: "J.R.R. Tolkien",
    book_image: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
    borrowed_date: "Oct 27, 2026",
    due_date: "Nov 05, 2026",
    days_left: 6,
  },
];

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState<BorrowedItem[]>(initialBorrows);
  const [returnedMsg, setReturnedMsg] = useState<string | null>(null);

  const handleReturn = (id: string, title: string) => {
    setBorrows((prev) => prev.filter((b) => b.id !== id));
    setReturnedMsg(`"${title}" has been successfully returned to BookNook!`);
    setTimeout(() => {
      setReturnedMsg(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D99950]/15 text-[#D99950] text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>Active Loans</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-neutral-900">
              My Borrowed Books
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Keep track of books you are reading and return them when finished.
            </p>
          </div>

          <Link
            href="/all-books"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-xs font-semibold transition-all shadow-sm"
          >
            <span>Borrow More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {returnedMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{returnedMsg}</span>
          </div>
        )}

        {borrows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {borrows.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex gap-5 items-center"
              >
                <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                  <Image
                    src={item.book_image}
                    alt={item.book_title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-serif font-bold text-base text-neutral-900 truncate">
                    {item.book_title}
                  </h3>
                  <p className="text-xs text-[#D99950] font-medium truncate">{item.author_name}</p>

                  <div className="pt-2 text-xs text-neutral-500 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Borrowed: {item.borrowed_date}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-medium text-neutral-700">{item.days_left} days remaining</span>
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => handleReturn(item.id, item.book_title)}
                      className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-[#D99950] text-neutral-700 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Return Book</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-12 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D99950]/10 text-[#D99950] flex items-center justify-center mx-auto">
              <BookOpenCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-serif text-neutral-900">
              No Active Borrows
            </h3>
            <p className="text-sm text-neutral-500">
              You haven&apos;t borrowed any books yet, or all your books have been returned.
            </p>
            <div className="pt-2">
              <Link
                href="/all-books"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-xs font-semibold transition-all shadow-sm"
              >
                <span>Browse All Books</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
