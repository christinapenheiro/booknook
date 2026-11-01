"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UploadedBook } from "@/types/uploadedBook";
import { authClient } from "@/lib/auth-client";
import {
  Pencil,
  Trash2,
  ArrowRight,
  X,
  AlertTriangle,
  Loader2,
  BookOpen,
  Check,
  LogIn,
} from "lucide-react";

interface MyBooksClientProps {
  initialBooks?: UploadedBook[];
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

export default function MyBooksClient({ initialBooks }: MyBooksClientProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Use primitive string dependencies to completely prevent infinite re-render loops
  const userEmail = user?.email || "";
  const userName = user?.name || "";

  const [books, setBooks] = useState<UploadedBook[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  // Edit modal state
  const [editingBook, setEditingBook] = useState<UploadedBook | null>(null);
  const [editForm, setEditForm] = useState({
    book_title: "",
    author_name: "",
    category: "Fiction",
    copies_left: 1,
    rating: 4.5,
    short_description: "",
    book_image: "",
  });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete modal state
  const [deletingBook, setDeletingBook] = useState<UploadedBook | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const serverBaseUrl =
    process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:8000";

  // Fetch user's books from the server /my-books API
  // Using primitive dependencies (isPending, userEmail, userName, serverBaseUrl) prevents infinite loops
  useEffect(() => {
    // While authentication is pending, do not trigger fetch yet
    if (isPending) return;

    // If there is no logged-in user, clear books and exit loading
    if (!userEmail && !userName) {
      setBooks([]);
      setIsLoadingBooks(false);
      return;
    }

    let isMounted = true;
    setIsLoadingBooks(true);

    const loadBooks = async () => {
      try {
        const params = new URLSearchParams();
        if (userEmail) params.set("email", userEmail);
        if (userName) params.set("added_by", userName);

        const res = await fetch(
          `${serverBaseUrl}/my-books?${params.toString()}`,
          { cache: "no-store" }
        );

        if (res.ok) {
          const data: UploadedBook[] = await res.json();
          if (isMounted) {
            setBooks(data);
          }
        } else {
          if (isMounted) {
            setBooks([]);
          }
        }
      } catch (err) {
        console.error("Error fetching my-books from server:", err);
        if (isMounted) {
          setBooks([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingBooks(false);
        }
      }
    };

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, [isPending, userEmail, userName, serverBaseUrl]);

  // Helper to re-fetch user's books after update or delete
  const refreshBooks = async () => {
    if (!userEmail && !userName) return;
    try {
      const params = new URLSearchParams();
      if (userEmail) params.set("email", userEmail);
      if (userName) params.set("added_by", userName);

      const res = await fetch(
        `${serverBaseUrl}/my-books?${params.toString()}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data: UploadedBook[] = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error("Error refreshing my-books:", err);
    }
  };

  // Handle opening edit modal
  const handleOpenEdit = (book: UploadedBook) => {
    setEditingBook(book);
    setEditForm({
      book_title: book.book_title || "",
      author_name: book.author_name || "",
      category: book.category || "Fiction",
      copies_left: Number(book.copies_left) || 1,
      rating: Number(book.rating) || 4.5,
      short_description: book.short_description || "",
      book_image: book.book_image || "",
    });
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingBook(null);
        setDeletingBook(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle Edit form submission
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("book_title", editForm.book_title);
      formData.append("author_name", editForm.author_name);
      formData.append("category", editForm.category);
      formData.append("copies_left", String(editForm.copies_left));
      formData.append("rating", String(editForm.rating));
      formData.append("short_description", editForm.short_description);

      if (editImageFile) {
        formData.append("book_image", editImageFile);
      } else {
        formData.append("book_image", editForm.book_image);
      }

      const res = await fetch(`${serverBaseUrl}/books/${editingBook._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to update book on server.");
      }

      let serverUpdatedBook: UploadedBook | null = null;
      try {
        serverUpdatedBook = await res.json();
      } catch {
        // ignore JSON parse error
      }

      const finalBook: UploadedBook = {
        ...editingBook,
        book_title: editForm.book_title,
        author_name: editForm.author_name,
        category: editForm.category,
        copies_left: Number(editForm.copies_left),
        rating: Number(editForm.rating),
        short_description: editForm.short_description,
        book_image:
          serverUpdatedBook?.book_image ||
          editImagePreview ||
          editForm.book_image,
      };

      // Immediately update local state so card reflects changes in 0ms
      setBooks((prev) =>
        prev.map((b) =>
          String(b._id) === String(editingBook._id) ? finalBook : b
        )
      );

      setEditingBook(null);
      router.refresh();

      // Background re-fetch to ensure complete sync with database
      await refreshBooks();
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Delete confirmation
  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${serverBaseUrl}/books/${deletingBook._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete book.");
      }

      // Immediately update state
      setBooks((prev) =>
        prev.filter((b) => String(b._id) !== String(deletingBook._id))
      );
      setDeletingBook(null);
      router.refresh();

      await refreshBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 1. While waiting for auth session or server book check, render loading skeleton
  if (isPending || (user && isLoadingBooks)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col sm:flex-row gap-5 animate-pulse"
          >
            <div className="w-24 h-34 rounded-xl bg-neutral-200/80 shrink-0 mx-auto sm:mx-0" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-neutral-200/80 rounded w-1/3" />
              <div className="h-5 bg-neutral-200/80 rounded w-3/4" />
              <div className="h-3 bg-neutral-200/80 rounded w-1/2" />
              <div className="h-3 bg-neutral-200/80 rounded w-1/4 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. If there is no active session: show NO books at my-books
  if (!user) {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#D99950]/10 text-[#D99950] flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold font-serif text-neutral-900">
          Sign In to View Your Books
        </h3>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          You need an active session to view your contributed books. Sign in to your BookNook account.
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-xs font-semibold transition-all shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to BookNook</span>
          </Link>
        </div>
      </div>
    );
  }

  // 3. User is logged in, but added books count is 0: show no added books
  if (books.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#D99950]/10 text-[#D99950] flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold font-serif text-neutral-900">
          No Contributed Books Yet
        </h3>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          You haven&apos;t added any books to BookNook yet. Fill out the add book form to share your first book!
        </p>
        <div className="pt-2">
          <Link
            href="/add-book"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-xs font-semibold transition-all shadow-sm"
          >
            Add Your First Book
          </Link>
        </div>
      </div>
    );
  }

  // 4. Render books contributed by this user
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col sm:flex-row gap-5 hover:border-[#D99950]/50 transition-all group"
          >
            <div className="relative w-24 h-34 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200 mx-auto sm:mx-0">
              <Image
                src={getImageUrl(book.book_image)}
                alt={book.book_title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="96px"
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#D99950] uppercase tracking-wider">
                    {book.category}
                  </span>
                  <span className="text-xs text-neutral-600 font-semibold bg-neutral-100 px-2 py-0.5 rounded-full">
                    ★ {book.rating ? Number(book.rating).toFixed(1) : "4.5"}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-neutral-900 truncate mt-0.5">
                  {book.book_title}
                </h3>
                <p className="text-xs text-neutral-500 truncate">
                  by {book.author_name}
                </p>

                <div className="pt-1.5 text-xs text-neutral-600 flex items-center gap-2">
                  <span>
                    Copies available:{" "}
                    <strong className="text-neutral-900">
                      {book.copies_left}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Actions: View Public Page, Edit and Delete buttons */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 flex-wrap">
                <Link
                  href={`/books/${book._id}`}
                  className="text-xs font-semibold text-[#D99950] hover:underline inline-flex items-center gap-1"
                >
                  <span>View Public Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(book)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-[#D99950] hover:bg-[#D99950]/10 text-neutral-700 hover:text-[#D99950] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Edit Book Details"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingBook(book)}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-600 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Delete Book"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT BOOK POPUP DIALOG */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-xl font-bold font-serif text-neutral-900">
                  Edit Book Details
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update the information for this contributed book.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1.5">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.book_title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, book_title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1.5">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.author_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, author_name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all bg-white"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1.5">
                    Copies Left *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editForm.copies_left}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        copies_left: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1.5">
                    Rating (1-5) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    required
                    value={editForm.rating}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        rating: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1.5">
                  Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-18 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0">
                    <Image
                      src={
                        editImagePreview || getImageUrl(editForm.book_image)
                      }
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEditImageFile(file);
                          setEditImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#D99950]/15 file:text-[#D99950] hover:file:bg-[#D99950]/25 cursor-pointer"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Leave empty to keep the existing book cover image.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1.5">
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editForm.short_description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      short_description: e.target.value,
                    })
                  }
                  placeholder="Overview of the book..."
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all resize-none"
                />
              </div>

              {/* Bottom Buttons with Update button */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-[#D99950] hover:bg-[#c6853a] active:scale-[0.99] text-white text-xs font-semibold transition-all shadow-md shadow-[#D99950]/20 flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Update Book</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE RECONFIRMATION DIALOG */}
      {deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 mx-auto flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold font-serif text-neutral-900">
                Delete Book?
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <strong className="text-neutral-900">
                  &ldquo;{deletingBook.book_title}&rdquo;
                </strong>
                ? This action will remove it from the BookNook community library.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white text-xs font-semibold transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
