import { Metadata } from "next";
import Link from "next/link";
import { Library, PlusCircle } from "lucide-react";
import MyBooksClient from "./MyBooksClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Books | BookNook Library",
  description: "Manage the books you have contributed to BookNook.",
};

export default function MyBooksPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D99950]/15 text-[#D99950] text-xs font-semibold uppercase tracking-wider mb-2">
              <Library className="w-3.5 h-3.5" />
              <span>Personal Shelf</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-neutral-900">
              My Contributed Books
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Books you have added to the BookNook community collection. Edit or manage their copies and details.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-xs font-semibold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Book</span>
          </Link>
        </div>

        <MyBooksClient />
      </div>
    </div>
  );
}
