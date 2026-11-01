"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);


  const validateEmail = (mail: string) => {
    if (!mail.trim()) {
      return "Email address is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail.trim())) {
      return "Please enter a valid email address (e.g. name@example.com).";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: "/reset-password",
      });

      if (error) {
        setErrorMessage(error.message || "Failed to send reset link. Please try again.");
      } else {
        setIsSubmitted(true);
        console.log("If an account exists, a reset link has been sent.");
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
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
          Reset your password
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Enter your email and we&apos;ll send you instructions to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-neutral-200/90 shadow-sm space-y-6">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-serif text-neutral-900">
                  Reset link sent
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  We have sent a password reset link to{" "}
                  <span className="font-semibold text-neutral-900">{email}</span>. Please check your inbox and spam folder.
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <Link
                  href="/login"
                  className="w-full py-3 px-4 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white font-semibold text-sm transition-all shadow-md shadow-[#D99950]/20 flex items-center justify-center gap-2 text-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full py-2.5 text-xs font-medium text-neutral-600 hover:text-[#D99950] transition-colors"
                >
                  Didn&apos;t receive it? Try another email
                </button>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(validateEmail(e.target.value));
                      }}
                      placeholder="reader@booknook.org"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                        emailError
                          ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-neutral-200 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20"
                      }`}
                    />
                  </div>
                  {emailError && (
                    <div className="text-xs text-rose-600 flex items-center gap-1.5 mt-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#D99950] hover:bg-[#c6853a] active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-md shadow-[#D99950]/20 flex items-center justify-center gap-2 text-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Mail className="w-4 h-4" />
                    <span>
                      {isSubmitting ? "Sending reset link..." : "Send Reset Link"}
                    </span>
                  </button>
                </div>
              </form>

              <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#D99950] hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
