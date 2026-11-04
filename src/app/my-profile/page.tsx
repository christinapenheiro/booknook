"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Camera,
  Check,
  AlertCircle,
  Loader2,
  LogIn,
  BookOpen,
  BookOpenCheck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Upload,
  Link as LinkIcon,
} from "lucide-react";

const PRESET_AVATARS = [
  {
    name: "Classic Reader",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Cozy Scholar",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Literature Fan",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Book Explorer",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
  },
];

export default function MyProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageInputMode, setImageInputMode] = useState<"url" | "presets">("presets");
  const [urlInput, setUrlInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Sync form when user session loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      const userImg = user.image || "";
      setImage(userImg);
      setUrlInput(userImg);
      setImageError(false);
    }
  }, [user?.name, user?.image]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      const msg = "Please select a valid image file (PNG, JPG, WebP).";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      const msg = "Image file size should be less than 2MB.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        setUrlInput("");
        setImageError(false);
        setErrorMessage(null);
        toast.info("Image loaded! Click 'Save Changes' to update your profile.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setImage(urlInput.trim());
    setImageError(false);
    setErrorMessage(null);
    toast.info("Avatar URL set. Click 'Save Changes' to update your profile.");
  };

  const handleSelectPreset = (url: string) => {
    setImage(url);
    setUrlInput(url);
    setImageError(false);
    setErrorMessage(null);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please provide a name.");
      toast.error("Please provide a name.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (error) {
        throw new Error(error.message || "Failed to update profile.");
      }

      setSuccessMessage("Profile updated successfully!");
      toast.success("Profile updated successfully!");

      if (refetch) {
        await refetch();
      }

      router.refresh();

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetForm = () => {
    if (user) {
      setName(user.name || "");
      const userImg = user.image || "";
      setImage(userImg);
      setUrlInput(userImg);
      setImageError(false);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  };

  const hasChanges =
    user && (name !== (user.name || "") || image !== (user.image || ""));

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D99950]/15 text-[#D99950] text-xs font-semibold uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Reader Account</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-neutral-900">
            My Profile
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage your personal profile details, avatar, and library reader credentials.
          </p>
        </div>

        {/* State Conditional Rendering */}
        {isPending ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-16 text-center shadow-xs flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#D99950]" />
            <p className="text-sm font-medium text-neutral-500">
              Loading your profile information...
            </p>
          </div>
        ) : !user ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-12 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto">
              <LogIn className="w-8 h-8 text-[#D99950]" />
            </div>
            <h3 className="text-xl font-bold font-serif text-neutral-900">
              Sign In to View Profile
            </h3>
            <p className="text-sm text-neutral-500">
              You must have an active session to view and update your BookNook profile.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-sm"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Success & Error alerts */}
            {successMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Profile Overview Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar Display */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-neutral-100 border-2 border-[#D99950]/30 shadow-md relative">
                    {image && !imageError ? (
                      <Image
                        src={image}
                        alt={name || "User Avatar"}
                        fill
                        unoptimized
                        className="object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-[#D99950] to-[#E8B67B] text-white flex items-center justify-center font-bold font-serif text-3xl">
                        {name ? name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-neutral-900 text-white shadow-md hover:bg-neutral-800 transition-all hover:scale-105 cursor-pointer"
                    title="Upload new photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Identity Information */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-2xl font-bold font-serif text-neutral-900">
                        {user.name || "BookNook Reader"}
                      </h2>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-neutral-500 mt-1">
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 self-center sm:self-start">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Reader</span>
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 pt-2 leading-relaxed">
                    Personalize how other members and librarians identify your book reviews,
                    contributions, and borrow reservations across BookNook.
                  </p>

                  {/* Quick Shortcuts */}
                  <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <Link
                      href="/my-books"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-[#D99950]/15 text-neutral-700 hover:text-[#D99950] text-xs font-semibold transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>My Books</span>
                    </Link>
                    <Link
                      href="/my-borrows"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-[#D99950]/15 text-neutral-700 hover:text-[#D99950] text-xs font-semibold transition-colors"
                    >
                      <BookOpenCheck className="w-3.5 h-3.5" />
                      <span>My Borrows</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Edit Form */}
            <form
              onSubmit={handleUpdateProfile}
              className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs p-6 sm:p-8 space-y-6"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h3 className="text-lg font-bold font-serif text-neutral-900">
                  Edit Profile Information
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update your display name and profile picture using Better-Auth.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Full Name Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 block">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm text-neutral-900 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 outline-none transition-all"
                  />
                </div>

                {/* Email Field (Read-only credential) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 block flex items-center justify-between">
                    <span>Email Address:</span>
                    <span className="text-[11px] text-neutral-400 font-normal">
                      Primary sign-in email
                    </span>
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email || ""}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-100/70 text-sm text-neutral-500 cursor-not-allowed outline-none"
                  />
                </div>

                {/* Profile Image Customization */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-700 block">
                      Profile Picture / Avatar:
                    </label>
                    <div className="inline-flex rounded-lg bg-neutral-100 p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setImageInputMode("presets")}
                        className={`px-3 py-1 rounded-md font-medium transition-all ${
                          imageInputMode === "presets"
                            ? "bg-white text-neutral-900 shadow-2xs"
                            : "text-neutral-500 hover:text-neutral-900"
                        }`}
                      >
                        Presets
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode("url")}
                        className={`px-3 py-1 rounded-md font-medium transition-all ${
                          imageInputMode === "url"
                            ? "bg-white text-neutral-900 shadow-2xs"
                            : "text-neutral-500 hover:text-neutral-900"
                        }`}
                      >
                        Custom URL
                      </button>
                    </div>
                  </div>

                  {imageInputMode === "presets" ? (
                    <div className="space-y-2">
                      <p className="text-xs text-neutral-500">
                        Choose a curated reader avatar or upload your own photo:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PRESET_AVATARS.map((preset) => {
                          const isSelected = image === preset.url;
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => handleSelectPreset(preset.url)}
                              className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                                isSelected
                                  ? "border-[#D99950] bg-[#D99950]/10 ring-2 ring-[#D99950]/20"
                                  : "border-neutral-200 hover:border-neutral-300 bg-white"
                              }`}
                            >
                              <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0 border border-neutral-200">
                                <Image
                                  src={preset.url}
                                  alt={preset.name}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-xs font-semibold text-neutral-800 truncate">
                                {preset.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                          <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm text-neutral-900 focus:border-[#D99950] focus:ring-2 focus:ring-[#D99950]/20 outline-none transition-all"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyUrl}
                          className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors"
                        >
                          Apply URL
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload button alternative */}
                  {/* <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo from Computer</span>
                    </button>
                    {image && (
                      <button
                        type="button"
                        onClick={() => {
                          setImage("");
                          setUrlInput("");
                        }}
                        className="text-xs text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove Avatar
                      </button>
                    )}
                  </div> */}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                {/* <button
                  type="button"
                  onClick={handleResetForm}
                  disabled={!hasChanges || isSaving}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-semibold transition-colors disabled:opacity-40"
                >
                  Cancel / Revert
                </button> */}

                <button
                  type="submit"
                  disabled={!hasChanges || isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#D99950] hover:bg-[#c6853a] text-white text-xs font-semibold transition-all shadow-sm hover:shadow-md hover:shadow-[#D99950]/25 flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating via Better-Auth...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

