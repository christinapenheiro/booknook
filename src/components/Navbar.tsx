"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  LogIn,
  UserPlus,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const mobileMenuOpen = mobileMenuPath === pathname;
  const [dropdownOpenPath, setDropdownOpenPath] = useState<string | null>(null);
  const dropdownOpen = dropdownOpenPath === pathname;
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/all-books" },
    { name: "Add Book", href: "/add-book" },
    { name: "My Books", href: "/my-books" },
    { name: "My Borrows", href: "/my-borrows" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Reset image error if user avatar changes without triggering infinite effect loops
  const [prevUserImage, setPrevUserImage] = useState(user?.image);
  if (user?.image !== prevUserImage) {
    setPrevUserImage(user?.image);
    setImageError(false);
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpenPath((prev) => (prev !== null ? null : prev));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully.");
      setDropdownOpenPath(null);
      setMobileMenuPath(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 border-b border-[#D99950]/20 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Name on Left */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#D99950] to-[#E8B67B] flex items-center justify-center text-white shadow-md shadow-[#D99950]/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-1 font-serif">
                Book<span className="text-[#D99950]">Nook</span>
              </span>
              <span className="text-[11px] font-medium uppercase tracking-widest text-[#D99950] -mt-1">
                Online Library
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "text-[#D99950] bg-[#D99950]/10 font-semibold"
                      : "text-neutral-600 hover:text-[#D99950] hover:bg-neutral-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons: User Profile / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isPending ? (
              <div className="w-10 h-10 rounded-full bg-neutral-200/70 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/my-profile"
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    pathname === "/my-profile"
                      ? "bg-[#D99950] text-white shadow-xs"
                      : "bg-neutral-100 hover:bg-[#D99950]/15 text-neutral-700 hover:text-[#D99950] border border-neutral-200/80"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() =>
                      setDropdownOpenPath(dropdownOpen ? null : pathname)
                    }
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-neutral-100/80 transition-all focus:outline-none cursor-pointer border border-neutral-200/80 hover:border-[#D99950]/40"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    {user.image && !imageError ? (
                      <Image
                        src={user.image}
                        width={36}
                        height={36}
                        unoptimized
                        alt={user.name || "User profile"}
                        referrerPolicy="no-referrer"
                        onError={() => setImageError(true)}
                        className="w-9 h-9 rounded-full object-cover border border-[#D99950]/50 shadow-xs"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D99950] to-[#E8B67B] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {user.name ? (
                          user.name.charAt(0).toUpperCase()
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180 text-[#D99950]" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-neutral-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-sm font-semibold text-neutral-900 truncate">
                          {user.name || "Reader"}
                        </p>
                        {user.email && (
                          <p className="text-xs text-neutral-500 truncate mt-0.5">
                            {user.email}
                          </p>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          href="/my-profile"
                          onClick={() => setDropdownOpenPath(null)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:text-[#D99950] hover:bg-[#D99950]/10 transition-colors"
                        >
                          <User className="w-4 h-4 text-neutral-500" />
                          <span>My Profile</span>
                        </Link>
                      </div>

                      <div className="border-t border-neutral-100 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-[#D99950] hover:bg-[#D99950]/10 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#D99950] hover:bg-[#c6853a] shadow-sm hover:shadow-md hover:shadow-[#D99950]/25 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-neutral-200/70 animate-pulse" />
            ) : user ? (
              <div className="flex items-center">
                {user.image && !imageError ? (
                  <img
                    src={user.image}
                    alt={user.name || "User profile"}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-8 h-8 rounded-full object-cover border border-[#D99950]/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D99950] to-[#E8B67B] text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                )}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() =>
                setMobileMenuPath(mobileMenuOpen ? null : pathname)
              }
              className="p-2 rounded-lg text-neutral-700 hover:text-[#D99950] hover:bg-neutral-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D99950]/20 bg-white/95 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuPath(null)}
                className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                  active
                    ? "text-[#D99950] bg-[#D99950]/10 font-semibold"
                    : "text-neutral-700 hover:text-[#D99950] hover:bg-neutral-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {isPending ? (
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-center py-4">
              <div className="w-8 h-8 rounded-full bg-neutral-200/70 animate-pulse" />
            </div>
          ) : user ? (
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <div className="flex items-center gap-3 px-2 py-1">
                {user.image && !imageError ? (
                  <img
                    src={user.image}
                    alt={user.name || "User profile"}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-10 h-10 rounded-full object-cover border border-[#D99950]/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D99950] to-[#E8B67B] text-white flex items-center justify-center font-bold text-sm">
                    {user.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">
                    {user.name || "Reader"}
                  </p>
                  {user.email && (
                    <p className="text-xs text-neutral-500 truncate">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              <Link
                href="/my-profile"
                onClick={() => setMobileMenuPath(null)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:text-[#D99950] hover:bg-[#D99950]/10 transition-colors"
              >
                <User className="w-4 h-4 text-neutral-500" />
                <span>My Profile</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuPath(null)}
                className="w-full text-center py-2.5 rounded-lg text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-[#D99950]/10 hover:text-[#D99950] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuPath(null)}
                className="w-full text-center py-2.5 rounded-lg text-sm font-medium text-white bg-[#D99950] hover:bg-[#c6853a] transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
