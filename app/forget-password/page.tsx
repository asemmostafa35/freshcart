"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiMail,
  HiLockClosed,
  HiKey,
  HiCheck,
  HiShieldCheck,
  HiOutlineShieldCheck,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiArrowLeft,
} from "react-icons/hi";
import {
  forgotPassword,
  VerifyResetCode,
  ResetPassword,
} from "@/app/api/frogetpassword/forget";
import TrustBadges from "../_component/TrustBadges/TrustBadges";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step state: 1 = Email, 2 = Verify Code, 3 = Reset Password
  const [step, setStep] = useState<number>(1);

  // Form states
  const [email, setEmail] = useState<string>("");
  const [resetCode, setResetCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // UI state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successToast, setSuccessToast] = useState<string>("");

  // 1️⃣ Step 1: Send Reset Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    try {
      await forgotPassword({ email });
      setStep(2);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2️⃣ Step 2: Verify Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    try {
      await VerifyResetCode({ resetCode });
      setSuccessToast("Code verified successfully!");
      setTimeout(() => setSuccessToast(""), 4000);
      setStep(3);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Invalid verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3️⃣ Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await ResetPassword({ email, newPassword });
      router.push("/login");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: is the connector segment before `circleIndex` completed (green)?
  // segment 1 sits between circle 1 & 2, segment 2 between circle 2 & 3
  const segmentColor = (segmentIndex: 1 | 2) =>
    step > segmentIndex ? "bg-green-600" : "bg-slate-200";

  return (
    <>
      <div className="min-h-[calc(100vh-120px)] w-full bg-white flex items-center justify-center py-10 px-4 md:px-8 font-sans relative">
        {/* Success Notification Toast */}
        {successToast && (
          <div className="fixed top-6 right-6 bg-white border border-green-100 shadow-xl rounded-2xl p-4 flex items-center gap-3 z-50 animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center">
              <HiCheck className="w-4 h-4" />
            </div>
            <span className="text-gray-800 text-sm font-medium">
              {successToast}
            </span>
            <button
              onClick={() => setSuccessToast("")}
              className="text-gray-400 hover:text-gray-600 ml-4 text-xs font-semibold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Content Grid Container */}
        <div className="w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start my-auto">
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-6 flex-col items-center text-center hidden lg:flex">
            {/* Top Light Green Illustration Container */}
            <div className="w-full bg-green-50 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Scattered ambient circles (match screenshot positions) */}
              <span className="absolute top-8 left-10 w-20 h-20 rounded-full bg-green-100/70 blur-[2px] pointer-events-none"></span>
              <span className="absolute top-14 right-10 w-16 h-16 rounded-full bg-green-100/70 blur-[2px] pointer-events-none"></span>
              <span className="absolute bottom-8 right-12 w-36 h-36 rounded-full bg-green-100/60 blur-[2px] pointer-events-none"></span>

              {/* Cards Container with Hover Wiggle */}
              <div className="relative flex items-center justify-center my-6 py-4">
                {/* Left Floating Mail Card */}
                <div className="w-16 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center -rotate-12 -mr-3 z-0">
                  <HiMail className="w-7 h-7 text-green-600" />
                </div>

                {/* Center Main Lock Card */}
                <div className="group relative w-28 h-32 bg-white rounded-3xl shadow-md flex items-center justify-center z-10 p-2 cursor-pointer">
                  <div className="w-full h-full bg-green-50 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                    <HiLockClosed className="w-10 h-10 text-green-600 transition-transform duration-300 ease-in-out group-hover:rotate-6" />
                  </div>
                </div>

                {/* Right Floating Shield Card */}
                <div className="w-16 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center rotate-12 -ml-3 z-0">
                  <HiShieldCheck className="w-7 h-7 text-green-600" />
                </div>
              </div>

              {/* Slider Dots Indicator */}
              <div className="flex items-center gap-1.5 mt-2 relative">
                <span className="w-2 h-2 rounded-full bg-green-200"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                <span className="w-2 h-2 rounded-full bg-green-200"></span>
              </div>
            </div>

            {/* Bottom Section (White Background) */}
            <div className="w-full pt-8 pb-4 px-4 flex flex-col items-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                Reset Your Password
              </h2>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed mb-8">
                Don&apos;t worry, it happens to the best of us. We&apos;ll help you get
                back into your account in no time.
              </p>

              {/* Feature Items Row */}
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 pt-4 border-t border-slate-100 w-full max-w-md text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <HiMail className="w-4 h-4 text-green-600" />
                  <span>Email Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Secure Reset</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiLockClosed className="w-4 h-4 text-green-600" />
                  <span>Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (Form Card) ================= */}
          <div className="lg:col-span-6 flex justify-center col-span-1">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10 flex flex-col">
              {/* FreshCart Wordmark */}
              <h1 className="text-2xl font-extrabold text-center mb-4 tracking-tight">
                <span className="text-slate-900">Fresh</span>
                <span className="text-green-600">Cart</span>
              </h1>

              {/* Stepper Header */}
              <div className="flex items-center justify-between w-full max-w-xs mx-auto mb-8">
                {/* Step 1 Circle */}
                <div
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors shrink-0 ${
                    step > 1
                      ? "bg-green-600 text-white"
                      : step === 1
                        ? "bg-green-600 text-white ring-4 ring-green-50"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > 1 ? (
                    <HiCheck className="w-5 h-5" />
                  ) : (
                    <HiMail className="w-4 h-4" />
                  )}
                </div>

                <span
                  className={`h-[2px] flex-1 mx-1 transition-colors ${segmentColor(1)}`}
                ></span>

                {/* Step 2 Circle */}
                <div
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors shrink-0 ${
                    step > 2
                      ? "bg-green-600 text-white"
                      : step === 2
                        ? "bg-green-600 text-white ring-4 ring-green-50"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > 2 ? (
                    <HiCheck className="w-5 h-5" />
                  ) : (
                    <HiKey className="w-4 h-4" />
                  )}
                </div>

                <span
                  className={`h-[2px] flex-1 mx-1 transition-colors ${segmentColor(2)}`}
                ></span>

                {/* Step 3 Circle */}
                <div
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors shrink-0 ${
                    step === 3
                      ? "bg-green-600 text-white ring-4 ring-green-50"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <HiLockClosed className="w-4 h-4" />
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium text-center">
                  {errorMsg}
                </div>
              )}

              {/* ---------------- STEP 1: Email Form ---------------- */}
              {step === 1 && (
                <form onSubmit={handleSendCode} className="flex flex-col">
                  <h3 className="text-xl font-bold text-center text-slate-900 mb-1">
                    Forgot Password?
                  </h3>
                  <p className="text-slate-500 text-xs text-center mb-6">
                    No worries, we&apos;ll send you a reset code
                  </p>

                  <label className="text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative mb-5">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <HiMail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-slate-400 text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-60 mb-6"
                  >
                    {isLoading ? "Sending Code..." : "Send Reset Code"}
                  </button>

                  <div className="text-center text-xs mb-6">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1 text-green-600 font-semibold hover:underline"
                    >
                      <HiArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                    </Link>
                  </div>

                  <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-green-600 font-semibold hover:underline"
                    >
                      Sign In
                    </Link>
                  </div>
                </form>
              )}

              {/* ---------------- STEP 2: Verify Code Form ---------------- */}
              {step === 2 && (
                <form onSubmit={handleVerifyCode} className="flex flex-col">
                  <h3 className="text-xl font-bold text-center text-slate-900 mb-1">
                    Check Your Email
                  </h3>
                  <p className="text-slate-500 text-xs text-center mb-6 leading-relaxed">
                    Enter the 6-digit code sent to
                    <br />
                    <span className="font-semibold text-slate-800">
                      {email || "your email"}
                    </span>
                  </p>

                  <label className="text-xs font-semibold text-slate-700 mb-1.5">
                    Verification Code
                  </label>
                  <div className="relative mb-3">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="• • • • • •"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm tracking-[0.5em] text-center font-semibold focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all text-slate-800 placeholder:text-slate-300"
                    />
                  </div>

                  <HiOutlineShieldCheck className="w-4 h-4 text-slate-300 mb-3" />

                  <div className="text-center text-xs mb-6">
                    <span className="text-slate-500">
                      Didn&apos;t receive the code?{" "}
                    </span>
                    <button
                      type="button"
                      onClick={handleSendCode}
                      className="text-green-600 font-semibold hover:underline"
                    >
                      Resend Code
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-60 mb-6"
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </button>

                  <div className="text-center text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1 hover:text-slate-700 transition-colors"
                    >
                      <HiArrowLeft className="w-3.5 h-3.5" /> Change email
                      address
                    </button>
                  </div>
                </form>
              )}

              {/* ---------------- STEP 3: Reset Password Form ---------------- */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="flex flex-col">
                  <h3 className="text-xl font-bold text-center text-slate-900 mb-1">
                    Create New Password
                  </h3>
                  <p className="text-slate-500 text-xs text-center mb-6">
                    Your new password must be different from previous passwords.
                  </p>

                  {/* New Password Input */}
                  <label className="text-xs font-semibold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative mb-4">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <HiLockClosed className="w-5 h-5" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all text-slate-800 placeholder:text-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff className="w-5 h-5" />
                      ) : (
                        <HiOutlineEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Confirm Password Input */}
                  <label className="text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative mb-6">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <HiLockClosed className="w-5 h-5" />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all text-slate-800 placeholder:text-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <HiOutlineEyeOff className="w-5 h-5" />
                      ) : (
                        <HiOutlineEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-60"
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <TrustBadges />
    </>
  );
}
