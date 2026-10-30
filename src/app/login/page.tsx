"use client";

import Link from "next/link";
import { BookOpen, LogIn, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D99950] to-[#E8B67B] flex items-center justify-center text-white shadow-md shadow-[#D99950]/30 group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-3xl font-bold tracking-tight text-neutral-900 font-serif">
            Book<span className="text-[#D99950]">Nook</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold font-serif text-neutral-900">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Sign in to borrow, return, and review library books
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-neutral-200/90 shadow-sm space-y-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                defaultValue="reader@booknook.org"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                defaultValue="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-neutral-600">
                <input type="checkbox" defaultChecked className="rounded text-[#D99950] focus:ring-[#D99950]" />
                <span>Remember me</span>
              </label>
              <a href="#" className="font-semibold text-[#D99950] hover:underline">
                Forgot password?
              </a>
            </div>

            <div className="pt-2">
              <Link
                href="/all-books"
                className="w-full py-3.5 px-4 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white font-semibold text-sm transition-all shadow-md shadow-[#D99950]/20 flex items-center justify-center gap-2 text-center"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to BookNook</span>
              </Link>
            </div>
          </form>

          <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-semibold text-[#D99950] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
