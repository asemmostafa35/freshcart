"use client";
import { payCash } from "@/app/api/payment/paycash.action";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormValues } from "./checkout.schema";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface CheckoutFormProps {
  cartId: string;
}
export const CHECKOUT_FORM_ID = "checkout-form";
export default function CheckoutForm({ cartId }: CheckoutFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      details: "",
      phone: "",
      city: "",
      postalCode: "",
    },
  });

  async function onSubmit(values: CheckoutFormValues) {
    try {
      const response = await payCash(cartId, values);
      console.log("Success:", response);
      toast.success("Order created successfully!");

      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/MyOrders");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <form
      id={CHECKOUT_FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Shipping Address
        </h2>

        {/* City Input */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-semibold text-gray-800">
            City <span className="text-red-500">*</span>
          </label>
          <input
            {...register("city")}
            placeholder="e.g. Cairo, Alexandria, Giza"
            className={`w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition ${
              errors.city
                ? "border-red-500 focus:border-red-500 bg-red-50/30"
                : "border-gray-200 focus:border-green-500"
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-xs font-semibold text-red-500 flex items-center gap-1">
              <span>⚠️</span> {errors.city.message}
            </p>
          )}
        </div>

        {/* Postal Code Input */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-semibold text-gray-800">
            Postal Code{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            {...register("postalCode")}
            placeholder="e.g. 12345"
            className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Street Address Input */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-semibold text-gray-800">
            Street Address <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("details")}
            placeholder="Street name, building number, floor, apartment..."
            rows={2}
            className={`w-full resize-none rounded-xl border px-3.5 py-3 text-sm outline-none transition ${
              errors.details
                ? "border-red-500 focus:border-red-500 bg-red-50/30"
                : "border-gray-200 focus:border-green-500"
            }`}
          />
          {errors.details && (
            <p className="mt-1 text-xs font-semibold text-red-500 flex items-center gap-1">
              <span>⚠️</span> {errors.details.message}
            </p>
          )}
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-800">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            {...register("phone")}
            placeholder="01xxxxxxxxx"
            className={`w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition ${
              errors.phone
                ? "border-red-500 focus:border-red-500 bg-red-50/30"
                : "border-gray-200 focus:border-green-500"
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-xs font-semibold text-red-500 flex items-center gap-1">
              <span>⚠️</span> {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-green-600 py-3.5 text-center text-sm font-bold text-white transition hover:bg-green-700"
      >
        Pay
      </button>
    </form>
  );
}
