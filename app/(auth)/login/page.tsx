"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { loginSchema, loginFormValues } from "./loginSchema";
import { signIn } from "next-auth/react";
export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: loginFormValues) => {
    setApiError(null);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.error) {
        const message = "Invalid email or password";
        setApiError(message);
        toast.error(message);
        return;
      } else {
        toast.success("Logged in successfully!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* الجزء الأيسر */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="relative w-full h-64 mb-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-black text-gray-900">FreshCart</h3>
              <p className="text-sm text-gray-500 mt-2 font-semibold">
                Your One-Stop Shop for Fresh Products
              </p>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            FreshCart - Your One-Stop Shop for{" "}
            <span className="text-[#00c758]">Fresh Products</span>
          </h1>
          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            Join thousands of happy customers who trust FreshCart for their
            daily grocery needs.
          </p>

          <div className="mt-8 flex items-center gap-6 text-xs font-semibold text-gray-500">
            <span className="flex items-center gap-1.5 text-green-600">
              ✓ Free Delivery
            </span>
            <span className="flex items-center gap-1.5 text-green-600">
              ✓ Secure Payment
            </span>
            <span className="flex items-center gap-1.5 text-green-600">
              ✓ 24/7 Support
            </span>
          </div>
        </div>

        {/* الجزء الأيمن: الفورم */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900">Welcome Back!</h2>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to continue your fresh shopping experience
            </p>
          </div>

          {/* أزرار السوشيال */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm"
            >
              <span className="text-red-500 font-black text-base">G</span>{" "}
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm"
            >
              <span className="text-blue-600 font-black text-base">f</span>{" "}
              Continue with Facebook
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-4 text-xs font-semibold text-gray-400 absolute uppercase tracking-wider">
              or continue with email
            </span>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl font-medium">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full pl-11 pr-4 py-3.5 border rounded-2xl text-base focus:outline-none transition ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-200 focus:border-[#00c758]"
                  }`}
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-gray-800">
                  Password
                </label>
                <Link
                  href="/forget-password"
                  className="text-xs font-bold text-[#00c758] hover:underline"
                >
                  Forget Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3.5 border rounded-2xl text-base focus:outline-none transition ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-200 focus:border-[#00c758]"
                  }`}
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Keep me signed in Checkbox */}
            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-gray-300 text-[#00c758] focus:ring-[#00c758] cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Keep me signed in
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-md bg-[#00c758] hover:bg-green-600 text-white shadow-green-100 hover:shadow-lg active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="text-center mt-8 text-sm text-gray-600">
            New to FreshCart?{" "}
            <Link
              href="/register"
              className="text-[#00c758] font-extrabold hover:underline"
            >
              Create an account
            </Link>
          </div>

          {/* Badges footer inside card */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-around text-xs text-gray-400 font-medium">
            <span>🔒 SSL Secured</span>
            <span>👥 50K+ Users</span>
            <span>⭐ 4.9 Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}
