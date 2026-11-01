"use client";

import { useState } from "react";
import { BookPlus, Sparkles, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function AddBookPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const serverBaseUrl =
    process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:8000";
  const url = `${serverBaseUrl}/books`;
  const [formData, setFormData] = useState({
    book_title: "",
    author_name: "",
    category: "Fiction",
    book_image: null as File | null,
    short_description: "",
    rating: "4.5",
    copies_left: "",
    added_by: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      console.error("Failed to fetch API because API url is not working.");
      return;
    }
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value);
      }
    });
    data.set("added_by", user?.name || user?.email || "Anonymous");
    data.set("email", user?.email || "");
    data.set("date", new Date().toISOString());
    console.log(data)
    try {
      const res = await fetch(url, {
        method: "POST",
        body: data,
      });
      if (!res.ok) {
        throw new Error("Failed to upload book");
      }
      setSubmitted(true);
      toast.success(`"${formData.book_title}" added successfully!`);
    } catch (error) {
      console.error("Error submitting Form:", error);
      toast.error("Failed to add book. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D99950]/15 text-[#D99950] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Shelves</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-neutral-900">
            Add a New Book
          </h1>
          <p className="text-sm text-neutral-600 mt-2">
            Contribute to BookNook and share great literature with our growing
            reading circle.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-10">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-neutral-900">
                Book Added to BookNook!
              </h3>
              <p className="text-sm text-neutral-600 max-w-md mx-auto">
                Thank you for contributing{" "}
                <strong>&ldquo;{formData.book_title}&rdquo;</strong>. Other
                readers can now find and borrow this book.
              </p>
              <div className="pt-4 flex items-center justify-center gap-4">
                <Link
                  href="/all-books"
                  className="px-6 py-3 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white font-semibold text-sm transition-all shadow-sm"
                >
                  View All Books
                </Link>
                <button
                  // onClick={() => {
                  //   setSubmitted(false);
                  //   setFormData({
                  //     book_title: "",
                  //     author_name: "",
                  //     category: "Fiction",
                  //     book_image: ,
                  //     short_description: "",
                  //     rating: "4.5",
                  //     copies_left: "5",
                  //     added_by: "Me",
                  //   });
                  // }}
                  className="px-6 py-3 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-sm font-semibold transition-colors"
                >
                  Add Another Book
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-2">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Midnight Library"
                    value={formData.book_title}
                    onChange={(e) =>
                      setFormData({ ...formData, book_title: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Matt Haig"
                    value={formData.author_name}
                    onChange={(e) =>
                      setFormData({ ...formData, author_name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all bg-white"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-2">
                    Copies *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={formData.copies_left}
                    onChange={(e) =>
                      setFormData({ ...formData, copies_left: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-700 mb-2">
                  Cover Image URL*
                </label>
                <input
                  type="file"
                  name="book_image"
                  accept="image/*"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, book_image: file });
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-700 mb-2">
                  Short Description*
                </label>
                <textarea
                  rows={4}
                  placeholder="A brief overview of the plot, themes, or insights..."
                  value={formData.short_description}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white font-semibold text-sm transition-all shadow-md shadow-[#D99950]/20 flex items-center justify-center gap-2 group"
                >
                  <BookPlus className="w-5 h-5" />
                  <span>Add Book</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
