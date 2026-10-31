"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  UserPlus,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    imageUrl: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password criteria checkers
  const hasMinLength = formData.password.length >= 6;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return "Email address is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address (e.g. name@example.com).";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required.";
    }
    const errors: string[] = [];
    if (password.length < 6) {
      errors.push("at least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("a lowercase letter");
    }

    if (errors.length > 0) {
      return `Password must contain ${errors.join(", ")}.`;
    }
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value }));
    if (emailError) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));
    if (passwordError) {
      setPasswordError(validatePassword(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(formData.email);
    const passwordErr = validatePassword(formData.password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    // If either email or password is invalid, do not register
    if (emailErr || passwordErr) {
      return;
    }
    setIsSubmitting(true);
    const { data, error } = await authClient.signUp.email({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      image: formData.imageUrl || undefined,
    });

    if (error) {
      setIsSubmitting(false);
      console.log(error)
      return;
    }

    if (data) {
      router.push("/");
    }

  };

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
          Create your account
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Join thousands of readers borrowing and sharing books for free
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-neutral-200/90 shadow-sm space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Jane Doe"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="jane@example.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${emailError
                    ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20"
                  }`}
              />
              {emailError && (
                <div className="text-xs text-rose-600 flex items-center gap-1.5 mt-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{emailError}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="At least 6 characters"
                  className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all ${passwordError
                      ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {passwordError && (
                <div className="text-xs text-rose-600 flex items-center gap-1.5 mt-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Password criteria checklist */}
              {/* <div className="mt-2.5 p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 space-y-1.5 text-xs">
                <p className="font-semibold text-neutral-600 text-[11px] uppercase tracking-wider">
                  Password Requirements:
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors ${hasMinLength
                        ? "bg-emerald-500 text-white"
                        : "bg-neutral-200 text-neutral-500"
                      }`}
                  >
                    {hasMinLength ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : "•"}
                  </div>
                  <span
                    className={
                      hasMinLength
                        ? "text-emerald-700 font-medium"
                        : "text-neutral-500"
                    }
                  >
                    At least 6 characters
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors ${hasUppercase
                        ? "bg-emerald-500 text-white"
                        : "bg-neutral-200 text-neutral-500"
                      }`}
                  >
                    {hasUppercase ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : "•"}
                  </div>
                  <span
                    className={
                      hasUppercase
                        ? "text-emerald-700 font-medium"
                        : "text-neutral-500"
                    }
                  >
                    At least one uppercase letter (A-Z)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors ${hasLowercase
                        ? "bg-emerald-500 text-white"
                        : "bg-neutral-200 text-neutral-500"
                      }`}
                  >
                    {hasLowercase ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : "•"}
                  </div>
                  <span
                    className={
                      hasLowercase
                        ? "text-emerald-700 font-medium"
                        : "text-neutral-500"
                    }
                  >
                    At least one lowercase letter (a-z)
                  </span>
                </div>
              </div> */}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1.5">
                Image URL*
              </label>
              <input
                type="text"
                required
                name="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                }
                placeholder="image url"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 text-sm outline-none transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#D99950] hover:bg-[#c6853a] active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-md shadow-[#D99950]/20 flex items-center justify-center gap-2 text-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create BookNook Account</span>
              </button>
            </div>
          </form>

          <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#D99950] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
