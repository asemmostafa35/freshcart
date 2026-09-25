"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TrustBadges from "../TrustBadges/TrustBadges";
import {
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  MapPin,
  Receipt,
  Eye,
  Lock,
} from "lucide-react";

interface OrderItem {
  _id?: string;
  count?: number;
  price?: number;
  product?: {
    imageCover?: string;
    title?: string;
  };
}

interface Order {
  id?: string;
  _id?: string;
  totalOrderPrice?: number;
  shippingPrice?: number;
  createdAt?: string;
  isDelivered?: boolean;
  cartItems?: OrderItem[];
  shippingAddress?: {
    city?: string;
    details?: string;
    phone?: string;
  };
}

const OrderCard = ({ order }: { order: Order }) => {
  const [isOpen, setIsOpen] = useState(false);

  const orderId = order?.id || order?._id;
  const totalPrice = order?.totalOrderPrice?.toLocaleString() || "0";
  const date = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const cartItems = order?.cartItems || [];
  const itemsCount =
    cartItems.reduce((acc, item) => acc + (item.count || 1), 0) ||
    cartItems.length;
  const city = order?.shippingAddress?.city || "N/A";
  const firstItemImage = cartItems[0]?.product?.imageCover || "";
  const status = order?.isDelivered ? "Delivered" : "Processing";

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 mb-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* الجزء العلوي للكارت */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        {/* التفاصيل والصورة */}
        <div className="flex items-center gap-5">
          {/* صورة المنتج والـ Badge */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2.5 relative overflow-hidden">
              <Image
                src={firstItemImage}
                alt="Product"
                fill
                unoptimized
                className="object-contain p-2.5"
              />
            </div>
            {cartItems.length > 1 && (
              <div className="absolute -top-2 -right-2 bg-[#0f172a] text-white w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-bold border-2 border-white shadow-sm">
                +{cartItems.length - 1}
              </div>
            )}
          </div>

          {/* بيانات الطلب */}
          <div className="space-y-1.5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#fef3c7] text-[#d97706]">
                <Clock size={13} />
                {status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              # {orderId}
            </h3>

            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {date}
              </span>
              <span className="text-gray-300">•</span>
              <span>{itemsCount} items</span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {city}
              </span>
            </div>

            <div className="pt-0.5">
              <span className="text-xl font-bold text-gray-900">
                {totalPrice}{" "}
              </span>
              <span className="text-xs font-semibold text-gray-400">EGP</span>
            </div>
          </div>
        </div>

        {/* الأزرار اليمين (تم تكبيرهم ووضوح الخط) */}
        <div className="flex md:flex-col justify-between items-end w-full md:w-auto h-full gap-3.5">
          <button className="w-11 h-11 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-700 transition-colors">
            <Eye size={20} />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-6 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all ${
              isOpen
                ? "bg-[#0aad51] text-white shadow-md shadow-green-200/50"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {isOpen ? "Hide" : "Details"}
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-6 pt-5 border-t border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-[#0aad51] font-bold text-sm">
            <Receipt size={16} />
            Order Items
          </div>

          <div className="space-y-2.5">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 p-1 shrink-0 relative overflow-hidden">
                    <Image
                      src={item.product?.imageCover || ""}
                      alt={item.product?.title || "Product"}
                      fill
                      unoptimized
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {item.product?.title}
                    </h4>
                    <p className="text-xs font-semibold text-gray-400 mt-0.5">
                      {item.count} × {item.price} EGP
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-gray-900">
                    {(item.count ?? 0) * (item.price ?? 0)}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400 block">
                    EGP
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 border border-gray-100 rounded-2xl bg-white">
              <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs mb-1.5">
                <MapPin size={15} /> Delivery Address
              </div>
              <h5 className="text-sm font-bold text-gray-900">
                {order?.shippingAddress?.city}
              </h5>
              <p className="text-xs font-semibold text-gray-700 mt-1">
                {order?.shippingAddress?.details}
              </p>
              <p className="text-xs font-semibold text-gray-500 mt-1.5">
                📞 {order?.shippingAddress?.phone}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fef8e6] border border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs mb-2">
                <Clock size={15} /> Order Summary
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Subtotal</span>
                <span className="font-extrabold text-gray-900">
                  {(
                    (order?.totalOrderPrice || 0) - (order?.shippingPrice || 0)
                  ).toLocaleString()}{" "}
                  EGP
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Shipping</span>
                <span className="font-extrabold text-gray-900">
                  {order?.shippingPrice ? `${order.shippingPrice} EGP` : "Free"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-amber-200">
                <span>Total</span>
                <span>{order?.totalOrderPrice?.toLocaleString()} EGP</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// المكون الرئيسي
export default function OrderComp() {
  const { data: orderResponse } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/allorders", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
  });

  const ordersList = Array.isArray(orderResponse)
    ? orderResponse
    : orderResponse?.data || [];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="text-xs md:text-sm text-gray-500 mb-6 flex items-center gap-2 font-semibold">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">My Orders</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-[#0aad51] rounded-2xl flex items-center justify-center shadow-md shadow-green-100">
              <ShoppingBag className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                My Orders
              </h1>
              <p className="text-xs md:text-sm font-semibold text-gray-500 mt-0.5">
                Track and manage your {ordersList.length} orders
              </p>
            </div>
          </div>

          <a
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-[#0aad51] hover:text-green-700 font-semibold text-xs md:text-sm transition-colors"
          >
            <Lock size={15} />
            Continue Shopping
          </a>
        </div>

        {/* Orders List */}
        <div>
          {ordersList.map((order: Order) => (
            <OrderCard key={order._id || order.id} order={order} />
          ))}
        </div>

        <div className="mt-12">
          <TrustBadges />
        </div>
      </div>
    </div>
  );
}
