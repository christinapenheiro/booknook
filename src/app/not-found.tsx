"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Home,
  ArrowLeft,
  Compass,
  Library,
  BookMarked,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-neutral-50/50">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Visual Badge & Cozy Book Icon */}
        <div className="relative inline-block mx-auto">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-[#D99950]/20 via-[#D99950]/10 to-amber-50 border border-[#D99950]/30 shadow-lg flex items-center justify-center text-[#D99950] mx-auto relative group">
            <BookOpen className="w-14 h-14 sm:w-16 sm:h-16 stroke-[1.75] transition-transform duration-300 group-hover:scale-110" />

            {/* 404 floating badge */}
            <span className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-[#D99950] text-white text-xs font-bold tracking-wider shadow-md uppercase">
              404
            </span>
          </div>

          <div className="absolute -bottom-2 -left-2 p-2 rounded-xl bg-white shadow-md border border-neutral-100 text-[#D99950]">
            <Compass className="w-4 h-4" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D99950]/15 text-[#D99950] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lost in the Stacks</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-neutral-900 tracking-tight">
            This Page Has Turned Missing
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-md mx-auto leading-relaxed">
            The chapter or shelf you are searching for might have been moved, checked out by another reader, or never penned in our catalog.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:shadow-[#D99950]/25 active:scale-95 inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Library Home</span>
          </Link>
        </div>

        {/* Helpful Popular Sections */}
        <div className="pt-8 border-t border-neutral-200/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            Or browse our popular library corners:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <Link
              href="/all-books"
              className="p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-[#D99950]/40 hover:bg-amber-50/40 transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D99950]/10 text-[#D99950] group-hover:scale-105 transition-transform">
                  <Library className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#D99950] transition-colors">
                    All Books
                  </h4>
                  <p className="text-[11px] text-neutral-500">Explore full library</p>
                </div>
              </div>
            </Link>

            <Link
              href="/my-borrows"
              className="p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-[#D99950]/40 hover:bg-amber-50/40 transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D99950]/10 text-[#D99950] group-hover:scale-105 transition-transform">
                  <BookMarked className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#D99950] transition-colors">
                    My Borrows
                  </h4>
                  <p className="text-[11px] text-neutral-500">Check active loans</p>
                </div>
              </div>
            </Link>

            <Link
              href="/my-books"
              className="p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-[#D99950]/40 hover:bg-amber-50/40 transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D99950]/10 text-[#D99950] group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#D99950] transition-colors">
                    My Shelf
                  </h4>
                  <p className="text-[11px] text-neutral-500">Your contributions</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

