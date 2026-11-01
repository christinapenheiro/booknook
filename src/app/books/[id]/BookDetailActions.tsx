"use client";

import { useState, useEffect } from "react";
import { Book } from "@/types/book";
import {
  BookMarked,
  Check,
  Calendar,
  AlertCircle,
  LogIn,
  Loader2,
  BookOpenCheck,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

interface BookDetailActionsProps {
  book: Book;
}

export default function BookDetailActions({ book }: BookDetailActionsProps) {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const user = session?.user;

  // Primitive strings to avoid unnecessary effect triggers
  const userEmail = user?.email || "";
  const userName = user?.name || "";

  const serverBaseUrl =
    process.env.NEXT_PUBLIC_SERVER_BASE_URL as string;

  const [availableCopies, setAvailableCopies] = useState<number>(
    Number(book.copies_left) || 0
  );
  const [borrowed, setBorrowed] = useState(false);
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [isCheckingBorrow, setIsCheckingBorrow] = useState(false);
  const [returnDays, setReturnDays] = useState("7");
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync availableCopies if book prop updates
  useEffect(() => {
    setAvailableCopies(Number(book.copies_left) || 0);
  }, [book.copies_left]);

  // Check if current user has an active, unreturned loan for this book
  useEffect(() => {
    if (isSessionPending) return;

    if (!userEmail) {
      setAlreadyBorrowed(false);
      return;
    }

    let isMounted = true;
    setIsCheckingBorrow(true);

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `${serverBaseUrl}/my-borrows/check/${book._id}?email=${encodeURIComponent(
            userEmail
          )}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setAlreadyBorrowed(Boolean(data.alreadyBorrowed));
          }
        }
      } catch (err) {
        console.error("Failed to check active borrowed book status:", err);
      } finally {
        if (isMounted) {
          setIsCheckingBorrow(false);
        }
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [userEmail, isSessionPending, book._id, serverBaseUrl]);

  const handleOpenBorrowModal = () => {
    setErrorMessage(null);
    setShowModal(true);
  };

  const handleBorrow = async () => {
    if (!userEmail) {
      setErrorMessage("Please sign in to borrow books.");
      toast.error("Please sign in to borrow books.");
      return;
    }

    setIsBorrowing(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${serverBaseUrl}/my-borrows/${book._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          user_name: userName || "Reader",
          return_days: Number(returnDays) || 7,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.alreadyBorrowed) {
          setAlreadyBorrowed(true);
        }
        throw new Error(
          data.error || "Failed to process borrow request from server."
        );
      }

      // Successfully borrowed
      setBorrowed(true);
      setAlreadyBorrowed(true);
      if (typeof data.copies_left === "number") {
        setAvailableCopies(data.copies_left);
      } else {
        setAvailableCopies((prev) => Math.max(0, prev - 1));
      }
      setShowModal(false);
      toast.success(`Successfully borrowed "${book.book_title}"!`);

      // Refresh server components to re-fetch updated copies_left from MongoDB
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to borrow book.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsBorrowing(false);
    }
  };

  const isBookUnavailable = availableCopies <= 0;

  return (
    <div className="pt-4 border-t border-neutral-100 space-y-4">
      {/* Session pending loader */}
      {isSessionPending ? (
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center gap-2 text-neutral-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-[#D99950]" />
          <span>Verifying reader status...</span>
        </div>
      ) : borrowed ? (
        /* Freshly Borrowed Success State */
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-sm text-emerald-800">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Successfully Borrowed!</span>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed">
            You have borrowed <strong>{book.book_title}</strong> for{" "}
            {returnDays} days. The library inventory has been updated (
            {availableCopies} copies remaining). Please remember to return it
            when you are finished so fellow readers can enjoy it!
          </p>
          <div className="pt-1 flex items-center gap-3">
            <Link
              href="/my-borrows"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
            >
              <BookOpenCheck className="w-4 h-4" />
              <span>Go to My Borrows</span>
            </Link>
            <Link
              href="/all-books"
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              Browse other books
            </Link>
          </div>
        </div>
      ) : (
        /* Standard Action Section */
        <div className="space-y-3">
          {/* Active loan reminder for logged-in user */}
          {alreadyBorrowed && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#D99950] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-950">
                  You have already borrowed this book
                </p>
                <p className="text-amber-800/90 leading-relaxed">
                  BookNook single-loan policy: You can borrow one copy of a
                  title at a time. Return your current copy to borrow it again.
                </p>
                <div className="pt-1">
                  <Link
                    href="/my-borrows"
                    className="inline-flex items-center gap-1 font-bold text-amber-900 hover:text-amber-950 underline"
                  >
                    <span>View in My Borrows</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Prompt to sign in if not authenticated */}
          {!user && (
            <div className="p-3.5 rounded-2xl bg-neutral-100/80 border border-neutral-200 text-neutral-700 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-[#D99950] shrink-0" />
                <span>
                  You must be signed in with an active session to borrow.
                </span>
              </div>
              <Link
                href="/login"
                className="px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs whitespace-nowrap transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {alreadyBorrowed ? (
              <button
                disabled
                className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm bg-neutral-200 text-neutral-500 cursor-not-allowed flex items-center justify-center gap-2 shadow-2xs"
              >
                <BookOpenCheck className="w-4 h-4" />
                <span>Already Borrowed</span>
              </button>
            ) : isBookUnavailable ? (
              <button
                disabled
                className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm bg-neutral-200 text-neutral-500 cursor-not-allowed flex items-center justify-center gap-2 shadow-2xs"
              >
                <BookMarked className="w-4 h-4" />
                <span>Currently Unavailable (0 Copies Left)</span>
              </button>
            ) : (
              <button
                onClick={handleOpenBorrowModal}
                disabled={isCheckingBorrow}
                className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm bg-[#D99950] hover:bg-[#c6853a] text-white transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-[#D99950]/25 active:scale-[0.99] disabled:opacity-70"
              >
                {isCheckingBorrow ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking Availability...</span>
                  </>
                ) : (
                  <>
                    <BookMarked className="w-4 h-4" />
                    <span>Borrow This Book</span>
                  </>
                )}
              </button>
            )}

            <Link
              href="/all-books"
              className="py-3.5 px-6 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-semibold text-sm text-center transition-colors shadow-2xs"
            >
              Browse More
            </Link>
          </div>
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
              <h3 className="text-xl font-bold font-serif text-neutral-900 leading-tight">
                Borrow &ldquo;{book.book_title}&rdquo;
              </h3>
              <p className="text-xs text-neutral-500">
                by {book.author_name} • {availableCopies} copies currently in
                library
              </p>
            </div>

            {/* Error Message inside modal if borrow failed */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!user ? (
              /* Require Login View */
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">
                  You need an active reader account to borrow books from
                  BookNook.
                </p>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-100 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <Link
                    href="/login"
                    className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold transition-all shadow-sm"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            ) : (
              /* Authenticated Borrow Form */
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5 justify-between">
                    <div className="flex">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <span>Select Borrow Duration:</span>
                    </div>
                    <div>
                      <p>{userName}</p>
                      <p>{userEmail}</p>
                    </div>
                  </label>
                  <select
                    value={returnDays}
                    onChange={(e) => setReturnDays(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm text-neutral-800 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 outline-none transition-all"
                  >
                    <option value="3">3 Days (Quick Read)</option>
                    <option value="7">7 Days (1 Week - Recommended)</option>
                    <option value="14">14 Days (2 Weeks)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#D99950] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong>Rule:</strong> Each reader can hold 1 copy of this
                    title at a time. Please return your borrowed book within {returnDays}{" "}
                    days.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={isBorrowing}
                    className="px-4 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-100 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBorrow}
                    disabled={isBorrowing}
                    className="px-6 py-2.5 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-sm font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-70"
                  >
                    {isBorrowing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Borrowing...</span>
                      </>
                    ) : (
                      <span>Confirm Borrow</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
