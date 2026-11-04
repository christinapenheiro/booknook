import Link from "next/link";
// import { getBooksServer } from "@/lib/books-server";
import HeroSlider from "@/components/HeroSlider";
import BookCard from "@/components/BookCard";
import {
  ArrowRight,
  Sparkles,
  BookPlus,
  BookOpenCheck,
  Undo2,
  Compass,
  Star,
  CheckCircle2,
  ShieldCheck,
  Clock,
  HeartHandshake,
} from "lucide-react";
import { UploadedBook } from "@/types/uploadedBook";

export default async function HomePage() {
  const url = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const arrivals = await fetch(`${url}/featured`);
  const newArrivals: UploadedBook[] = await arrivals.json();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section with Carousel Slider */}
      <HeroSlider />

      {/* 2. Core Value Banner: "Add a book, borrow a book, return a book" */}
      <section className="bg-neutral-50 border-b border-neutral-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D99950]">
              The Core Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900 mt-1">
              How BookNook Works
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              Simple, accessible, and community-driven reading experience for
              everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Add a book */}
            <div className="relative p-6 rounded-2xl bg-white border border-neutral-200/70 hover:border-[#D99950]/50 transition-all hover:shadow-md group">
              <div className="w-12 h-12 rounded-xl bg-[#D99950]/10 text-[#D99950] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookPlus className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#D99950] uppercase tracking-wider">
                Step 01
              </span>
              <h3 className="text-lg font-bold font-serif text-neutral-900 mt-1 mb-2">
                Add a Book
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Contribute your cherished books to our catalog. Share
                information, upload cover art, and expand the library shelves
                for other members.
              </p>
            </div>

            {/* Step 2: Borrow a book */}
            <div className="relative p-6 rounded-2xl bg-white border border-[#D99950]/40 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#D99950] text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md shadow-[#D99950]/30">
                <BookOpenCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#D99950] uppercase tracking-wider">
                Step 02
              </span>
              <h3 className="text-lg font-bold font-serif text-neutral-900 mt-1 mb-2">
                Borrow a Book
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Found something captivating? Reserve and borrow the book for a
                few days with one click, completely free of charge.
              </p>
            </div>

            {/* Step 3: Return a book */}
            <div className="relative p-6 rounded-2xl bg-white border border-neutral-200/70 hover:border-[#D99950]/50 transition-all hover:shadow-md group">
              <div className="w-12 h-12 rounded-xl bg-[#D99950]/10 text-[#D99950] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Undo2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#D99950] uppercase tracking-wider">
                Step 03
              </span>
              <h3 className="text-lg font-bold font-serif text-neutral-900 mt-1 mb-2">
                Return a Book
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Finished reading? Return the book through your dashboard so the
                next reader can immerse themselves in the adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. New Arrivals Section (First 6 books from API) */}
      <section
        id="new-arrivals"
        className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D99950]/10 border border-[#D99950]/30 text-[#D99950] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh On The Shelves</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-neutral-900">
              New Arrivals
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base mt-2 max-w-xl">
              Check out the newest additions to BookNook. Borrow any title to
              dive straight into your next unforgettable journey.
            </p>
          </div>

          <Link
            href="/all-books"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-[#D99950] hover:text-[#c6853a] transition-colors"
          >
            <span>Explore full catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
          {newArrivals.map((book: UploadedBook) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>

        {/* User Required: "See All Books" button below the cards in New Arrivals section */}
        <div className="mt-14 text-center">
          <Link
            href="/all-books"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white font-semibold text-base shadow-md hover:shadow-lg hover:shadow-[#D99950]/30 transition-all group"
          >
            <span>See All Books</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <p className="text-xs text-neutral-500 mt-2.5">
            Discover all 30+ titles across fiction, science, history, and
            philosophy
          </p>
        </div>
      </section>

      {/* 4. Reading Sanctuary Featurette */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white py-16 sm:py-20 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D99950]">
                Why Readers Love BookNook
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">
                A Library Designed Around People, Not Red Tape.
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                We believe reading should be frictionless, welcoming, and
                enriching. Whether you are looking for timeless classics or
                contemporary breakthroughs, BookNook keeps your reading queue
                filled.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D99950] shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-300">
                    <strong className="text-white">
                      Instant Online Borrowing:
                    </strong>{" "}
                    No complicated library cards or waiting in line.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D99950] shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-300">
                    <strong className="text-white">Community Driven:</strong>{" "}
                    Add your favorite titles and see what your neighbors
                    recommend.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D99950] shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-300">
                    <strong className="text-white">Hassle-Free Returns:</strong>{" "}
                    Return books whenever you are ready with transparent
                    tracking.
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/"
                  className="px-6 py-3 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white font-semibold text-sm transition-all shadow-md shadow-[#D99950]/20"
                >
                  Join the Community
                </Link>
                <Link
                  href="/all-books"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 backdrop-blur-xs">
                <Compass className="w-8 h-8 text-[#D99950] mb-3" />
                <h4 className="text-2xl font-bold font-serif text-white">4+</h4>
                <p className="text-xs text-neutral-400 mt-1">Rich Categories</p>
                <p className="text-[11px] text-neutral-500 mt-2">
                  Fiction, Science, History & more
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 backdrop-blur-xs">
                <ShieldCheck className="w-8 h-8 text-[#D99950] mb-3" />
                <h4 className="text-2xl font-bold font-serif text-white">
                  100%
                </h4>
                <p className="text-xs text-neutral-400 mt-1">Open Access</p>
                <p className="text-[11px] text-neutral-500 mt-2">
                  Zero subscription fees
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 backdrop-blur-xs">
                <Clock className="w-8 h-8 text-[#D99950] mb-3" />
                <h4 className="text-2xl font-bold font-serif text-white">
                  7 Days
                </h4>
                <p className="text-xs text-neutral-400 mt-1">Lending Window</p>
                <p className="text-[11px] text-neutral-500 mt-2">
                  Flexible renewal options
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 backdrop-blur-xs">
                <HeartHandshake className="w-8 h-8 text-[#D99950] mb-3" />
                <h4 className="text-2xl font-bold font-serif text-white">
                  30+
                </h4>
                <p className="text-xs text-neutral-400 mt-1">Curated Books</p>
                <p className="text-[11px] text-neutral-500 mt-2">
                  Constantly updated collection
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
