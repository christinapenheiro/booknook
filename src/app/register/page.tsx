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
import { createAuthClient } from "better-auth/react";
import { toast } from "react-toastify";

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    const authClient = createAuthClient()
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error("Google sign up failed:", err);
      setIsGoogleLoading(false);
    }
  };

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
      toast.error(emailErr || passwordErr);
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
      const msg = error.message || "Failed to create account.";
      toast.error(msg);
      console.log(error);
      return;
    }

    if (data) {
      toast.success("Account created successfully! Welcome to BookNook.");
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
                Image URL
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

          {/* Social Sign-in Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-neutral-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3 px-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/80 active:scale-[0.99] font-medium text-sm text-neutral-700 transition-all flex items-center justify-center gap-3 shadow-xs cursor-pointer disabled:opacity-60"
          >
            <GoogleIcon className="w-5 h-5" />
            <span>
              {isGoogleLoading ? "Connecting to Google..." : "Sign up with Google"}
            </span>
          </button>

          <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#D99950] hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
