// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   BookOpenCheck,
//   RotateCcw,
//   Calendar,
//   CheckCircle2,
//   ArrowRight,
//   Loader2,
//   LogIn,
// } from "lucide-react";
// import { authClient } from "@/lib/auth-client";

// interface BorrowedItem {
//   _id: string;
//   book_id: string;
//   book_title: string;
//   author_name: string;
//   book_image: string;
//   category?: string;
//   borrowed_date: string;
//   due_date: string;
//   days_left: number;
//   return_days?: number;
//   returned?: boolean;
// }

// function getImageUrl(imageSrc?: string) {
//   if (!imageSrc) return "/placeholder-book.jpg";
//   if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
//     return imageSrc;
//   }
//   const baseUrl =
//     process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:8000";
//   return `${baseUrl.replace(/\/$/, "")}${
//     imageSrc.startsWith("/") ? "" : "/"
//   }${imageSrc}`;
// }

// export default function MyBorrowsPage() {
//   const { data: session, isPending: isSessionPending } = authClient.useSession();
//   const user = session?.user;
//   const userEmail = user?.email || "";

//   const serverBaseUrl =
//     process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:8000";

//   const [borrows, setBorrows] = useState<BorrowedItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [returningId, setReturningId] = useState<string | null>(null);
//   const [returnedMsg, setReturnedMsg] = useState<string | null>(null);

//   useEffect(() => {
//     if (isSessionPending) return;

//     if (!userEmail) {
//       setBorrows([]);
//       setIsLoading(false);
//       return;
//     }

//     let isMounted = true;
//     setIsLoading(true);

//     const fetchBorrows = async () => {
//       try {
//         const res = await fetch(
//           `${serverBaseUrl}/my-borrows?email=${encodeURIComponent(userEmail)}`,
//           { cache: "no-store" }
//         );
//         if (res.ok) {
//           const data: BorrowedItem[] = await res.json();
//           if (isMounted) {
//             setBorrows(data);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to load borrowed books:", err);
//       } finally {
//         if (isMounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchBorrows();

//     return () => {
//       isMounted = false;
//     };
//   }, [userEmail, isSessionPending, serverBaseUrl]);

//   const handleReturn = async (id: string, title: string) => {
//     setReturningId(id);
//     try {
//       const res = await fetch(`${serverBaseUrl}/my-borrows/return/${id}`, {
//         method: "POST",
//       });

//       if (res.ok) {
//         setBorrows((prev) => prev.filter((b) => b._id !== id && b.book_id !== id));
//         setReturnedMsg(`"${title}" has been successfully returned! Library copies updated.`);
//         setTimeout(() => {
//           setReturnedMsg(null);
//         }, 5000);
//       } else {
//         alert("Failed to return book. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error returning book:", err);
//       alert("Error returning book. Please try again.");
//     } finally {
//       setReturningId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-neutral-50/50 py-12">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
//           <div>
//             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D99950]/15 text-[#D99950] text-xs font-semibold uppercase tracking-wider mb-2">
//               <BookOpenCheck className="w-3.5 h-3.5" />
//               <span>Active Loans</span>
//             </div>
//             <h1 className="text-3xl font-bold font-serif text-neutral-900">
//               My Borrowed Books
//             </h1>
//             <p className="text-sm text-neutral-600 mt-1">
//               Keep track of books you are reading and return them when finished.
//             </p>
//           </div>

//           <Link
//             href="/all-books"
//             className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-xs font-semibold transition-all shadow-sm"
//           >
//             <span>Borrow More</span>
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>

//         {returnedMsg && (
//           <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-sm">
//             <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
//             <span>{returnedMsg}</span>
//           </div>
//         )}

//         {isSessionPending || isLoading ? (
//           <div className="bg-white rounded-3xl border border-neutral-200 p-16 text-center shadow-xs flex flex-col items-center justify-center gap-3">
//             <Loader2 className="w-8 h-8 animate-spin text-[#D99950]" />
//             <p className="text-sm font-medium text-neutral-500">
//               Loading your active borrowed books...
//             </p>
//           </div>
//         ) : !user ? (
//           <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-12 shadow-xs space-y-4">
//             <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto">
//               <LogIn className="w-8 h-8 text-[#D99950]" />
//             </div>
//             <h3 className="text-xl font-bold font-serif text-neutral-900">
//               Sign In to View Loans
//             </h3>
//             <p className="text-sm text-neutral-500">
//               Please sign in with your BookNook account to see the books you have borrowed.
//             </p>
//             <div className="pt-2">
//               <Link
//                 href="/login"
//                 className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-sm"
//               >
//                 <span>Sign In</span>
//                 <ArrowRight className="w-4 h-4" />
//               </Link>
//             </div>
//           </div>
//         ) : borrows.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {borrows.map((item) => (
//               <div
//                 key={item._id || item.book_id}
//                 className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex gap-5 items-center"
//               >
//                 <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
//                   <Image
//                     src={getImageUrl(item.book_image)}
//                     alt={item.book_title}
//                     fill
//                     className="object-cover"
//                     sizes="80px"
//                   />
//                 </div>

//                 <div className="flex-1 min-w-0 space-y-1">
//                   <h3 className="font-serif font-bold text-base text-neutral-900 truncate">
//                     {item.book_title}
//                   </h3>
//                   <p className="text-xs text-[#D99950] font-medium truncate">
//                     {item.author_name}
//                   </p>

//                   <div className="pt-2 text-xs text-neutral-500 space-y-1">
//                     <p className="flex items-center gap-1.5">
//                       <Calendar className="w-3.5 h-3.5 text-neutral-400" />
//                       <span>Borrowed: {item.borrowed_date}</span>
//                     </p>
//                     <p className="flex items-center gap-1.5">
//                       <span className="w-2 h-2 rounded-full bg-emerald-500" />
//                       <span className="font-medium text-neutral-700">
//                         Due: {item.due_date} ({item.days_left || 7} days)
//                       </span>
//                     </p>
//                   </div>

//                   <div className="pt-3">
//                     <button
//                       onClick={() => handleReturn(item._id || item.book_id, item.book_title)}
//                       disabled={returningId === (item._id || item.book_id)}
//                       className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-[#D99950] text-neutral-700 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
//                     >
//                       {returningId === (item._id || item.book_id) ? (
//                         <>
//                           <Loader2 className="w-3.5 h-3.5 animate-spin" />
//                           <span>Returning...</span>
//                         </>
//                       ) : (
//                         <>
//                           <RotateCcw className="w-3.5 h-3.5" />
//                           <span>Return Book</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-12 shadow-xs space-y-4">
//             <div className="w-16 h-16 rounded-2xl bg-[#D99950]/10 text-[#D99950] flex items-center justify-center mx-auto">
//               <BookOpenCheck className="w-8 h-8" />
//             </div>
//             <h3 className="text-xl font-bold font-serif text-neutral-900">
//               No Active Borrows
//             </h3>
//             <p className="text-sm text-neutral-500">
//               You haven&apos;t borrowed any books yet, or all your books have been returned.
//             </p>
//             <div className="pt-2">
//               <Link
//                 href="/all-books"
//                 className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-xs font-semibold transition-all shadow-sm"
//               >
//                 <span>Browse All Books</span>
//                 <ArrowRight className="w-4 h-4" />
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpenCheck,
  RotateCcw,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Loader2,
  LogIn,
  Clock,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface BorrowedItem {
  _id: string;
  book_id: string;
  book_title: string;
  author_name: string;
  book_image: string;
  category?: string;
  borrowed_date: string;
  due_date: string;
  days_left?: number;
  return_days?: number;
  returned?: boolean;
}

function getImageUrl(imageSrc?: string) {
  if (!imageSrc) return "/placeholder-book.jpg";
  if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
    return imageSrc;
  }
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:8000";
  return `${baseUrl.replace(/\/$/, "")}${
    imageSrc.startsWith("/") ? "" : "/"
  }${imageSrc}`;
}

export default function MyBorrowsPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const user = session?.user;
  const userEmail = user?.email || "";

  const serverBaseUrl =
    process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:8000";

  const [borrows, setBorrows] = useState<BorrowedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [returnedMsg, setReturnedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isSessionPending) return;

    if (!userEmail) {
      setBorrows([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const fetchBorrows = async () => {
      try {
        const res = await fetch(
          `${serverBaseUrl}/my-borrows?email=${encodeURIComponent(userEmail)}`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const data: BorrowedItem[] = await res.json();
          if (isMounted) {
            setBorrows(data);
          }
        }
      } catch (err) {
        console.error("Failed to load borrowed books:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBorrows();

    return () => {
      isMounted = false;
    };
  }, [userEmail, isSessionPending, serverBaseUrl]);

  const handleReturn = async (id: string, title: string) => {
    setReturningId(id);
    try {
      const res = await fetch(`${serverBaseUrl}/my-borrows/return/${id}`, {
        method: "POST",
      });

      if (res.ok) {
        setBorrows((prev) =>
          prev.filter((b) => b._id !== id && b.book_id !== id),
        );
        setReturnedMsg(
          `"${title}" has been successfully returned! Library inventory updated.`,
        );
        setTimeout(() => {
          setReturnedMsg(null);
        }, 5000);
      } else {
        alert("Failed to return book. Please try again.");
      }
    } catch (err) {
      console.error("Error returning book:", err);
      alert("Error returning book. Please try again.");
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
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

        {/* Return Notification Alert */}
        {returnedMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{returnedMsg}</span>
          </div>
        )}

        {/* State Conditional Rendering */}
        {isSessionPending || isLoading ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-16 text-center shadow-xs flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#D99950]" />
            <p className="text-sm font-medium text-neutral-500">
              Loading your active borrowed books...
            </p>
          </div>
        ) : !user ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-12 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto">
              <LogIn className="w-8 h-8 text-[#D99950]" />
            </div>
            <h3 className="text-xl font-bold font-serif text-neutral-900">
              Sign In to View Loans
            </h3>
            <p className="text-sm text-neutral-500">
              Please sign in with your BookNook account to see the books you
              have borrowed.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-sm"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : borrows.length > 0 ? (
          /* Borrowed Books Table */
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 text-xs font-semibold uppercase tracking-wider">
                    <th scope="col" className="py-4 px-6 w-24">
                      Image
                    </th>
                    <th scope="col" className="py-4 px-6">
                      Title
                    </th>
                    <th scope="col" className="py-4 px-6 whitespace-nowrap">
                      Borrow Date
                    </th>
                    <th scope="col" className="py-4 px-6 whitespace-nowrap">
                      Return Date
                    </th>
                    <th
                      scope="col"
                      className="py-4 px-6 text-right whitespace-nowrap"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm">
                  {borrows.map((item) => {
                    const actionId = item._id || item.book_id;
                    const isReturning = returningId === actionId;

                    return (
                      <tr
                        key={actionId}
                        className="hover:bg-neutral-50/70 transition-colors"
                      >
                        {/* Image Column */}
                        <td className="py-4 px-6 align-middle">
                          <div className="relative w-14 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200 shadow-2xs">
                            <Image
                              src={getImageUrl(item.book_image)}
                              alt={item.book_title}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                        </td>

                        {/* Title & Author Column */}
                        <td className="py-4 px-6 align-middle">
                          <div className="space-y-1 max-w-xs sm:max-w-md">
                            <Link
                              href={`/books/${item.book_id}`}
                              className="font-serif font-bold text-neutral-900 hover:text-[#D99950] transition-colors line-clamp-1 text-base block"
                            >
                              {item.book_title}
                            </Link>
                            <p className="text-xs text-[#D99950] font-medium truncate">
                              by {item.author_name}
                            </p>
                            {item.category && (
                              <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                                {item.category}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Borrow Date Column */}
                        <td className="py-4 px-6 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-medium">
                            <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                            <span>{item.borrowed_date || "N/A"}</span>
                          </div>
                        </td>

                        {/* Return Date / Due Date Column */}
                        <td className="py-4 px-6 align-middle whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900">
                              <Clock className="w-4 h-4 text-[#D99950] shrink-0" />
                              <span>{item.due_date || "N/A"}</span>
                            </div>
                            {item.days_left !== undefined && (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>{item.days_left} days left</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Return Book Button Column */}
                        <td className="py-4 px-6 align-middle text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              handleReturn(actionId, item.book_title)
                            }
                            disabled={isReturning}
                            className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-[#D99950] text-neutral-700 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                          >
                            {isReturning ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Returning...</span>
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Return Book</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-12 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D99950]/10 text-[#D99950] flex items-center justify-center mx-auto">
              <BookOpenCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-serif text-neutral-900">
              No Active Borrows
            </h3>
            <p className="text-sm text-neutral-500">
              You haven&apos;t borrowed any books yet, or all your books have
              been returned.
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
