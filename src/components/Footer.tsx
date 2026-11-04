import Link from "next/link";
import {
  BookOpen,
  Heart,
  Mail,
  MapPin,
  Phone,
  Globe,
  Share2,
} from "lucide-react";
import React from "react";
import { FaGoogle, FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D99950] to-[#E8B67B] flex items-center justify-center text-white shadow-md shadow-[#D99950]/20">
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white font-serif">
                  Book<span className="text-[#D99950]">Nook</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-[#D99950]">
                  Online Community Library
                </span>
              </div>
            </Link>

            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              BookNook is your friendly digital library built on a simple
              philosophy:
              <span className="text-[#D99950] font-medium block mt-1">
                “Add a book, borrow a book, return a book.”
              </span>
              Enjoy reading without boundaries.
            </p>

            <div className="pt-2 flex items-center gap-3 text-neutral-400">
              <span className="text-xs">Follow our literary journey:</span>
              {/* <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-[#D99950] hover:text-white flex items-center justify-center transition-colors text-neutral-300"
                aria-label="Community Globe"
              >
                <Globe className="w-4 h-4" />
              </a> */}
              {/* <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-[#D99950] hover:text-white flex items-center justify-center transition-colors text-neutral-300"
                aria-label="Share Library"
              >
                <Share2 className="w-4 h-4" />
              </a> */}
              <div className="flex items-center gap-4 rounded-lg p-4 text-white">
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Google"
                  className="transition-opacity hover:opacity-80"
                >
                  <FaGoogle className="h-4 w-4" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition-opacity hover:opacity-80"
                >
                  <FaInstagram className="h-4 w-4" />
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="transition-opacity hover:opacity-80"
                >
                  <FaXTwitter className="h-4 w-4" />
                </a>

                <a
                  href="https://meta.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Meta"
                  className="transition-opacity hover:opacity-80"
                >
                  <FaFacebook className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#D99950] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/all-books"
                  className="hover:text-[#D99950] transition-colors"
                >
                  All Books
                </Link>
              </li>
              <li>
                <Link
                  href="/add-book"
                  prefetch={false}
                  className="hover:text-[#D99950] transition-colors"
                >
                  Add Book
                </Link>
              </li>
              <li>
                <Link
                  href="/my-books"
                  prefetch={false}
                  className="hover:text-[#D99950] transition-colors"
                >
                  My Books
                </Link>
              </li>
              <li>
                <Link
                  href="/my-borrows"
                  prefetch={false}
                  className="hover:text-[#D99950] transition-colors"
                >
                  My Borrows
                </Link>
              </li>
            </ul>
          </div>

          {/* Book Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link
                  href="/all-books?category=Fiction"
                  className="hover:text-[#D99950] transition-colors"
                >
                  Fiction & Classics
                </Link>
              </li>
              <li>
                <Link
                  href="/all-books?category=Science"
                  className="hover:text-[#D99950] transition-colors"
                >
                  Science & Cosmos
                </Link>
              </li>
              <li>
                <Link
                  href="/all-books?category=History"
                  className="hover:text-[#D99950] transition-colors"
                >
                  History & Biographies
                </Link>
              </li>
              <li>
                <Link
                  href="/all-books?category=Philosophy"
                  className="hover:text-[#D99950] transition-colors"
                >
                  Philosophy & Ideas
                </Link>
              </li>
            </ul>
          </div>

          {/* Library Hours & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Library Support
            </h4>
            <div className="space-y-2 text-sm text-neutral-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D99950] shrink-0" />
                <span>Reading Room, Nook Street</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D99950] shrink-0" />
                <span>librarian@booknook.org</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D99950] shrink-0" />
                <span>+1 (800) 555-NOOK</span>
              </p>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-[#D99950]/20 text-[#D99950] border border-[#D99950]/30 font-medium">
                  Digital Library Open 24/7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 BookNook Library. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with{" "}
            <Heart className="w-3.5 h-3.5 text-[#D99950] fill-[#D99950]" /> for
            book lovers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
