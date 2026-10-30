"use client";

import { useState } from "react";
import { Book } from "@/types/book";
import { BookMarked, Check, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";

interface BookDetailActionsProps {
  book: Book;
}

export default function BookDetailActions({ book }: BookDetailActionsProps) {
  const [borrowed, setBorrowed] = useState(false);
  const [returnDays, setReturnDays] = useState("7");
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleBorrow = () => {
    setIsBorrowing(true);
    setTimeout(() => {
      setIsBorrowing(false);
      setBorrowed(true);
      setShowModal(false);
    }, 600);
  };

  return (
    <div className="pt-4 border-t border-neutral-100 space-y-4">
      {borrowed ? (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-sm text-emerald-800">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>Successfully Borrowed!</span>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed">
            You have borrowed <strong>{book.book_title}</strong> for {returnDays} days. Please remember to return it when you are finished so other readers can enjoy it!
          </p>
          <div className="pt-1 flex items-center gap-3">
            <Link
              href="/my-borrows"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              View in My Borrows
            </Link>
            <button
              onClick={() => setBorrowed(false)}
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              Borrow Again / Undo
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowModal(true)}
            disabled={book.copies_left <= 0}
            className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
              book.copies_left > 0
                ? "bg-[#D99950] hover:bg-[#c6853a] text-white hover:shadow-md hover:shadow-[#D99950]/25 active:scale-[0.99]"
                : "bg-neutral-200 text-neutral-500 cursor-not-allowed"
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>{book.copies_left > 0 ? "Borrow This Book" : "Currently Unavailable"}</span>
          </button>
          <Link
            href="/all-books"
            className="py-3.5 px-6 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-semibold text-sm text-center transition-colors"
          >
            Browse More
          </Link>
        </div>
      )}

      {/* Borrow Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-neutral-100 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#D99950]">
                Confirm Borrowing
              </span>
              <h3 className="text-xl font-bold font-serif text-neutral-900">
                Borrow &ldquo;{book.book_title}&rdquo;
              </h3>
              <p className="text-xs text-neutral-500">
                You can keep this book in your library shelf for up to 14 days.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700 block">
                Select Borrow Duration:
              </label>
              <select
                value={returnDays}
                onChange={(e) => setReturnDays(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-sm text-neutral-800 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 outline-none"
              >
                <option value="3">3 Days (Quick Read)</option>
                <option value="7">7 Days (1 Week - Recommended)</option>
                <option value="14">14 Days (2 Weeks)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#D99950] shrink-0 mt-0.5" />
              <span>
                BookNook follows a community trust model: &ldquo;Borrow a book, return a book.&rdquo;
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-100 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBorrow}
                disabled={isBorrowing}
                className="px-6 py-2.5 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-sm font-semibold transition-all shadow-sm"
              >
                {isBorrowing ? "Confirming..." : "Confirm Borrow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
