"use client";

import { useState, useMemo } from "react";
import { Book } from "@/types/book";
import BookCard from "@/components/BookCard";
import { Search, SlidersHorizontal, BookOpen, Sparkles, Filter } from "lucide-react";

interface AllBooksClientProps {
  _id: string;
  book_title: string;
  author_name: string;
  category: string;
  book_image: string;
  short_description: string;
  rating: number;
  copies_left: number;
  added_by: string;
}

export default function AllBooksClient({ initialBooks }:  { initialBooks: AllBooksClientProps[]}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "rating" | "title" | "copies">("featured");


  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(initialBooks.map((b) => b.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [initialBooks]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {

    return initialBooks
      .filter((book) => {
        const matchesCat =
          selectedCategory === "All" ||
          book.category.toLowerCase() === selectedCategory.toLowerCase();

        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          book.book_title.toLowerCase().includes(query) ||
          book.author_name.toLowerCase().includes(query) ||
          book.category.toLowerCase().includes(query) ||
          (book.short_description && book.short_description.toLowerCase().includes(query));

        return matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === "title") {
          return a.book_title.localeCompare(b.book_title);
        }
        if (sortBy === "copies") {
          return (b.copies_left || 0) - (a.copies_left || 0);
        }
        return 0; // featured/original
      });
  }, [initialBooks, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D99950]/10 border border-[#D99950]/30 text-[#D99950] text-xs font-semibold tracking-wider uppercase mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Complete Library Shelves</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-neutral-900 tracking-tight">
            Explore All Books
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-3 max-w-2xl mx-auto">
            Browse our entire collection of {initialBooks.length} books. Discover stories, borrow with one click, or add to your personal reading list.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-neutral-200/80 shadow-xs mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by book title, author, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-[#D99950]" />
              <span className="text-xs font-medium text-neutral-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-800 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 outline-none transition-all cursor-pointer"
              >
                <option value="featured">Featured / Default</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Title (A - Z)</option>
                <option value="copies">Most Copies Available</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-[#D99950]" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[#D99950] text-white shadow-xs font-semibold"
                    : "bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Showing <strong className="text-neutral-900">{filteredBooks.length}</strong> of {initialBooks.length} books
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-xs font-semibold text-[#D99950] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-12 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#D99950]/10 text-[#D99950] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-serif text-neutral-900 mb-1">
              No books found
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6">
              We couldn&apos;t find any books matching your search or filters. Try adjusting your query or resetting filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-5 py-2.5 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-xs font-semibold transition-all shadow-sm"
            >
              View All Books
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
