"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changeUserPassword } from "@/app/api/actions/userApi";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // حالة للرسالة الحمراء فوق لو مش متطابقين زي الصورة
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: changeUserPassword,
    onSuccess: () => {
      toast.success("Password changed successfully! 🎉");
      setErrorMessage("");
      setCurrentPassword("");
      setPassword("");
      setRePassword("");
    },
    onError: (err) => {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== rePassword) {
      setErrorMessage("New passwords do not match");
      return;
    }

    mutate({
      currentPassword,
      password,
      rePassword,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl my-6">
      {/* Header with Icon Box */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#fef3c7] p-3 rounded-xl text-[#d97706]">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
          <p className="text-sm text-gray-500">Update your account password</p>
        </div>
      </div>

      {/* Error Alert Box (مطابق للصورة) */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-[#fdf2f2] border border-[#f5c6cb] text-[#ff001a] rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-800 focus:outline-none focus:border-green-500 transition shadow-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showCurrent ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-800 focus:outline-none focus:border-green-500 transition shadow-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showNew ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <span className="text-xs text-gray-400 mt-1.5 block">
            Must be at least 6 characters
          </span>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-800 focus:outline-none focus:border-green-500 transition shadow-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-fit bg-[#d97706] hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          {isPending ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
