"use client";

import React, { useState } from "react";
import { addAddress, deleteAddress } from "@/app/api/actions/useraddress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast, { Toaster } from "react-hot-toast";
import {
  MapPin,
  Settings,
  Plus,
  Trash2,
  User,
  X,
  Phone,
  Building2,
  ChevronRight,
  Loader2,
} from "lucide-react";

// 1. Zod Validation Schema in English
const addressSchema = z.object({
  name: z.string().min(2, "Please enter an address name (e.g. Home)"),
  details: z.string().min(5, "Please enter full address details"),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Invalid phone number (must be Egyptian)"),
  city: z.string().min(2, "Please enter city name"),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface Address {
  _id?: string;
  id?: string;
  name?: string;
  details?: string;
  phone?: string;
  city?: string;
}

export default function AddressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // State for Delete Confirmation Modal
  const [addressToDelete, setAddressToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const queryClient = useQueryClient();

  // 1. React Hook Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  // 2. Fetch Addresses Query
  const {
    data: addressesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await fetch("/api/addresses");
      if (!res.ok) {
        throw new Error("Failed to fetch addresses");
      }
      const data = await res.json();
      return data.data || data;
    },
  });

  const addresses: Address[] = Array.isArray(addressesData)
    ? addressesData
    : [];

  // 3. Add Address Mutation
  const addMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added successfully! 🎉");
      handleCloseModal();
    },
    onError: (error) => {
      console.error("Error adding address:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add address");
    },
  });

  // 4. Delete Address Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address removed successfully 🗑️");
      setDeletingId(null);
      setAddressToDelete(null);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to remove address");
      setDeletingId(null);
    },
  });

  // Open Modal for Add
  const handleOpenModal = () => {
    reset({
      name: "",
      details: "",
      phone: "",
      city: "",
    });
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset({
      name: "",
      details: "",
      phone: "",
      city: "",
    });
  };

  const onSubmit = (data: AddressFormData) => {
    addMutation.mutate(data);
  };

  const handleConfirmDelete = () => {
    if (addressToDelete) {
      deleteMutation.mutate(addressToDelete.id);
    }
  };

  const isSubmitting = addMutation.isPending;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans" dir="ltr">
      {/* Toast Container on the top-right side */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Hero Header */}
      <div className="bg-[#1CBA5C] text-white pt-8 pb-16 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/90 text-sm mb-6 font-medium">
            Home / <span className="text-white font-semibold">My Account</span>
          </p>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0">
              <User className="w-8 h-8" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                My Account
              </h1>
              <p className="text-white/90 text-sm font-normal">
                Manage your addresses and account settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">
              My Account
            </h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#EAF8F1] text-[#1CBA5C] font-semibold text-sm transition cursor-pointer">
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#1CBA5C] text-white flex items-center justify-center shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </span>
                  My Addresses
                </span>
                <ChevronRight className="w-4 h-4 text-[#1CBA5C]" />
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-600 font-medium text-sm transition cursor-pointer">
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </span>
                  Settings
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-9">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                My Addresses
              </h2>
              <p className="text-gray-500 text-sm">
                Manage your saved delivery addresses
              </p>
            </div>

            <button
              onClick={handleOpenModal}
              className="bg-[#1CBA5C] hover:bg-[#16A34A] text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-xs cursor-pointer text-sm w-fit"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Address
            </button>
          </div>

          {/* List Cards */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 flex items-center justify-center gap-2 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading addresses...
              </div>
            ) : isError ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-red-500">
                Failed to load addresses. Please try again.
              </div>
            ) : addresses.length > 0 ? (
              addresses.map((addr, index) => {
                const targetId = addr._id || addr.id || "";
                return (
                  <div
                    key={targetId || index}
                    className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 relative flex items-start justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#EAF8F1] text-[#1CBA5C] flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 fill-current" />
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          {addr.name || "Address"}
                        </h3>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {addr.details || "No details provided"}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mt-4 text-xs text-gray-600 font-medium">
                          {addr.phone && (
                            <span className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-gray-500" />
                              {addr.phone}
                            </span>
                          )}
                          {addr.city && (
                            <span className="flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 text-gray-500" />
                              {addr.city}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          targetId &&
                          setAddressToDelete({
                            id: targetId,
                            name: addr.name || "this address",
                          })
                        }
                        disabled={deletingId === targetId}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 flex items-center justify-center transition cursor-pointer disabled:opacity-50"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
                No addresses found. Click &quot;Add Address&quot; to add your first
                address.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal (Matching Provided Image Design) */}
      {addressToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-[420px] p-8 relative flex flex-col items-center text-center">
            {/* Red Circle Icon */}
            <div className="w-16 h-16 rounded-full bg-red-100/70 text-[#FF3B30] flex items-center justify-center mb-5">
              <Trash2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            {/* Modal Title & Text */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Remove Address?
            </h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Remove{" "}
              <span className="font-semibold text-gray-800">
                {addressToDelete.name}
              </span>{" "}
              from your addresses?
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setAddressToDelete(null)}
                disabled={deleteMutation.isPending}
                className="w-1/2 bg-[#F1F3F5] hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl transition cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="w-1/2 bg-[#FF3B30] hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-2xl transition cursor-pointer text-sm flex justify-center items-center gap-2"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Add New Address
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Address Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Home, Office"
                  {...register("name")}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#1CBA5C] text-sm text-gray-800 placeholder-gray-400`}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Address
                </label>
                <textarea
                  placeholder="Street, building, apartment..."
                  rows={3}
                  {...register("details")}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    errors.details ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#1CBA5C] text-sm text-gray-800 placeholder-gray-400 resize-none`}
                />
                {errors.details && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.details.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="01XXXXXXXXX"
                    {...register("phone")}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#1CBA5C] text-sm text-gray-800 placeholder-gray-400`}
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Cairo"
                    {...register("city")}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#1CBA5C] text-sm text-gray-800 placeholder-gray-400`}
                  />
                  {errors.city && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.city.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full sm:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition cursor-pointer text-sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-1/2 bg-[#1CBA5C] hover:bg-[#16A34A] disabled:bg-gray-400 text-white font-medium py-2.5 rounded-xl transition cursor-pointer text-sm flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Address"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
