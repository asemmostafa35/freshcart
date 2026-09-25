"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import toastHot from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Star,
  Truck,
  ShieldCheck,
  UserPlus,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import { registerSchema, RegisterFormValues } from "./registerSchema";
import { registerUser } from "@/app/api/actions/auth.actions";
import TrustBadges from "@/app/_component/TrustBadges/TrustBadges";

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
      terms: false,
    },
  });

  const passwordValue = watch("password") || "";
  const isTermsAccepted = watch("terms");

  const getPasswordStrength = (pass: string) => {
    if (!pass) {
      return {
        label: "Weak",
        width: "w-0",
        color: "bg-gray-300",
        textColor: "text-gray-400",
      };
    }

    let score = 0;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;

    switch (score) {
      case 1:
        return {
          label: "Weak",
          width: "w-1/4",
          color: "bg-red-400",
          textColor: "text-red-500",
        };
      case 2:
        return {
          label: "Fair",
          width: "w-2/4",
          color: "bg-orange-500",
          textColor: "text-orange-500",
        };
      case 3:
        return {
          label: "Good",
          width: "w-3/4",
          color: "bg-blue-600",
          textColor: "text-blue-600",
        };
      case 4:
        return {
          label: "Strong",
          width: "w-full",
          color: "bg-[#00c758]",
          textColor: "text-[#00c758]",
        };
      default:
        return {
          label: "Weak",
          width: "w-0",
          color: "bg-gray-300",
          textColor: "text-gray-400",
        };
    }
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude `terms` from the payload
    const { terms, ...payload } = data;

    try {
      await registerUser(payload);
      toastHot.success("Account created successfully!");

      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      if (message.toLowerCase().includes("account already exists")) {
        setError("email", {
          message: "Account already exists with this email",
        });
      } else {
        setApiError(message);
        toastHot.error(message);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Section Left */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Welcome to <span className="text-[#00c758]">FreshCart</span>
            </h1>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Join thousands of happy customers who enjoy fresh groceries
              delivered right to their doorstep.
            </p>

            <div className="mt-10 space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6 text-[#00c758] fill-[#00c758]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Premium Quality
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Premium quality products sourced from trusted suppliers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6 text-[#00c758]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Fast Delivery
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Same-day delivery available in most areas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#00c758]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Secure Shopping
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Your data and payments are completely secure
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#8bc34a] flex items-center justify-center shrink-0">
                  <span className="text-white font-extrabold text-base">
                    SJ
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    Sarah Johnson
                  </h4>
                  <div className="flex items-center text-yellow-400 text-sm mt-0.5">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm italic text-gray-600 leading-relaxed">
                &ldquo;FreshCart has transformed my shopping experience. The
                quality of the products is outstanding, and the delivery is
                always on time. Highly recommend!&rdquo;
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900">
                Create Your Account
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Start your fresh journey with us today
              </p>
            </div>

            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl font-medium">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Ali"
                  className={`w-full px-4 py-3.5 border rounded-2xl text-base focus:outline-none transition ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-200 focus:border-[#00c758]"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="ali@example.com"
                  className={`w-full px-4 py-3.5 border rounded-2xl text-base focus:outline-none transition ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-200 focus:border-[#00c758]"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="create a strong password"
                    className={`w-full pl-4 pr-12 py-3.5 border rounded-2xl text-base focus:outline-none transition ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-200 focus:border-[#00c758]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Bar */}
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="h-1 bg-gray-100 rounded-full flex-1 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`}
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold min-w-[36px] text-right ${strength.textColor}`}
                  >
                    {strength.label}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("rePassword")}
                    type={showRePassword ? "text" : "password"}
                    placeholder="confirm your password"
                    className={`w-full pl-4 pr-12 py-3.5 border rounded-2xl text-base focus:outline-none transition ${
                      errors.rePassword
                        ? "border-red-500"
                        : "border-gray-200 focus:border-[#00c758]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRePassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showRePassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.rePassword && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">
                    {errors.rePassword.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  className={`w-full px-4 py-3.5 border rounded-2xl text-base focus:outline-none transition ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-200 focus:border-[#00c758]"
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    {...register("terms")}
                    type="checkbox"
                    id="terms"
                    className="w-5 h-5 rounded-md border-gray-300 text-[#00c758] focus:ring-[#00c758] cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-[#00c758] hover:underline font-bold"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#00c758] hover:underline font-bold"
                    >
                      Privacy Policy
                    </Link>{" "}
                    <span className="text-red-500">*</span>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">
                    {errors.terms.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isTermsAccepted || isSubmitting}
                className={`w-full mt-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                  !isTermsAccepted || isSubmitting
                    ? "bg-[#00c758] opacity-40 cursor-not-allowed text-white"
                    : "bg-[#00c758] hover:bg-green-600 text-white shadow-green-100 hover:shadow-lg active:scale-[0.99]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create My Account
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-8 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#00c758] font-extrabold hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <TrustBadges />
    </>
  );
}
