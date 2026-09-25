"use client";
import React, { useState, useEffect, useRef } from "react";
import logo from "../../../assets/images/freshcart-logo.svg";
import {
  Truck,
  Gift,
  Phone,
  Mail,
  User,
  Search,
  ChevronDown,
  Headphones,
  Heart,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Package,
  MapPin,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    localStorage.removeItem("userToken");
    await signOut({ callbackUrl: "/login" });
  };

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 0,
  });

  const cartItemCount = (() => {
    if (!cartData) return 0;
    if (typeof cartData.numOfCartItems === "number") {
      return cartData.numOfCartItems;
    }
    if (typeof cartData?.data?.numOfCartItems === "number") {
      return cartData.data.numOfCartItems;
    }
    if (Array.isArray(cartData?.data?.products)) {
      return cartData.data.products.reduce(
        (total: number, item: { count?: number; quantity?: number }) =>
          total + (item.count ?? item.quantity ?? 1),
        0,
      );
    }
    return 0;
  })();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting open menus on route change
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="w-full font-sans relative">
      <div
        className="hidden lg:block transition-all duration-200"
        style={{ height: isScrolled ? "76px" : "116px" }}
      />
      <div className="lg:hidden" style={{ height: "70px" }} />

      <div className="fixed top-0 left-0 w-full z-40">
        {/* Top Bar */}
        <div
          className={`hidden lg:block bg-[#f8f9fa] text-sm text-gray-600 overflow-hidden transition-all duration-200 ${
            isScrolled
              ? "max-h-0 py-0 opacity-0 border-b-0"
              : "max-h-20 py-2.5 opacity-100 border-b border-gray-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-600" /> Free Shipping on
                Orders 500 EGP
              </span>
              <span className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-green-600" /> New Arrivals Daily
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="tel:+18001234567"
                className="flex items-center gap-1.5 hover:text-green-600 transition"
              >
                <Phone className="w-4 h-4" /> +1 (800) 123-4567
              </a>
              <a
                href="mailto:support@freshcart.com"
                className="flex items-center gap-1.5 hover:text-green-600 transition"
              >
                <Mail className="w-4 h-4" /> support@freshcart.com
              </a>
              <div className="flex items-center gap-4 pl-4 border-l border-gray-300 h-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition text-gray-700 font-semibold"
                    >
                      <User className="w-4 h-4 text-green-600" />
                      <span className="truncate">
                        {session?.user?.name || "Profile"}
                      </span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1.5 py-1 px-2 rounded-lg text-red-600 hover:text-red-700 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition text-gray-700"
                    >
                      <User className="w-4 h-4 text-green-600" /> Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition text-gray-700"
                    >
                      <User className="w-4 h-4 text-green-600" /> Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <header className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 lg:gap-6">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="relative w-[130px] h-[35px]">
                <Image
                  src={logo}
                  alt="FreshCart Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            <div className="hidden lg:flex flex-1 max-w-lg relative">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full pl-5 pr-14 py-3 bg-white border border-gray-200 rounded-full text-base text-gray-700 focus:outline-none focus:border-green-600 transition-colors"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-green-600 text-white px-5 rounded-full hover:bg-green-700 transition flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
            </div>

            <nav className="hidden lg:flex items-center gap-7 text-base font-normal text-gray-700">
              <Link href="/" className="hover:text-green-600 transition">
                Home
              </Link>
              <Link href="/shop" className="hover:text-green-600 transition">
                Shop
              </Link>

              <div
                className="relative py-2"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-green-600 transition text-gray-700">
                  Categories{" "}
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isCategoriesOpen ? "rotate-180 text-green-600" : ""
                    }`}
                  />
                </button>
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 flex flex-col text-base font-normal text-gray-700">
                    <Link
                      href="/categories"
                      className="px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition"
                    >
                      All Categories
                    </Link>
                    <Link
                      href="/categories/electronics"
                      className="px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition"
                    >
                      Electronics
                    </Link>
                    <Link
                      href="/categories/womens-fashion"
                      className="px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition"
                    >
                      Women&apos;s Fashion
                    </Link>
                    <Link
                      href="/categories/mens-fashion"
                      className="px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition"
                    >
                      Men&apos;s Fashion
                    </Link>
                    <Link
                      href="/categories/beauty"
                      className="px-4 py-2.5 hover:bg-green-50 hover:text-green-600 transition"
                    >
                      Beauty & Health
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/brands" className="hover:text-green-600 transition">
                Brands
              </Link>
            </nav>

            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden xl:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f0fdf4] flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 text-xs">Support</p>
                  <p className="font-normal text-gray-700 leading-none text-sm">
                    24/7 Help
                  </p>
                </div>
              </div>

              <div className="hidden lg:block w-px h-8 bg-gray-200 mx-1"></div>

              <Link
                href="/wishlist"
                className="p-1 text-gray-600 hover:text-green-600 transition"
              >
                <Heart className="w-6 h-6" strokeWidth={1.5} />
              </Link>

              <Link
                href="/cart"
                className="p-1 text-gray-600 hover:text-green-600 transition relative"
              >
                <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
                {isAuthenticated && cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white box-content shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Profile Icon & Animated Dropdown Modal */}
              {isAuthenticated ? (
                <div className="relative hidden lg:block" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="p-1 text-gray-600 hover:text-green-600 transition rounded-full focus:outline-none cursor-pointer"
                    aria-label="User Profile"
                  >
                    <User className="w-6 h-6" strokeWidth={1.5} />
                  </button>

                  {/* Animated Dropdown Menu */}
                  <div
                    className={`absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 transform transition-all duration-200 origin-top-right ${
                      isProfileMenuOpen
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="px-4 py-2 flex items-center gap-3 border-b border-gray-100 pb-3 mb-1">
                      <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {session?.user?.name || "User"}
                        </p>
                        {session?.user?.email && (
                          <p className="text-xs text-gray-400 truncate">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-2 space-y-0.5 font-medium text-sm text-gray-600">
                      <Link
                        href="/MyOrders"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition"
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        My Orders
                      </Link>

                      <Link
                        href="/wishlist"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition"
                      >
                        <Heart className="w-4 h-4 text-gray-400" />
                        My Wishlist
                      </Link>

                      <Link
                        href="/addresses"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        Addresses
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition"
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        Settings
                      </Link>
                    </div>

                    <div className="pt-2 mt-1 border-t border-gray-100 px-2">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleSignOut();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden lg:flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full text-base font-normal hover:bg-green-700 transition ml-1"
                >
                  <User className="w-4 h-4" /> Sign In
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden bg-green-600 text-white p-1.5 rounded-md hover:bg-green-700 transition ml-2 cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white z-50 shadow-2xl transition-transform duration-300 ease-out transform lg:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <Link href="/" className="relative w-[110px] h-[30px]">
            <Image
              src={logo}
              alt="FreshCart Logo"
              fill
              className="object-contain"
            />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-full text-base text-gray-700 focus:outline-none focus:border-green-600"
            />
            <button className="absolute right-1 top-1 bottom-1 bg-green-600 text-white px-4 rounded-full text-base flex items-center justify-center">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 font-normal text-base text-gray-700">
            <Link
              href="/"
              className="py-2.5 px-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="py-2.5 px-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition"
            >
              Shop
            </Link>
            <Link
              href="/categories"
              className="py-2.5 px-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition"
            >
              Categories
            </Link>
            <Link
              href="/brands"
              className="py-2.5 px-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition"
            >
              Brands
            </Link>
          </nav>

          <div className="my-6 border-t border-gray-100" />

          <div className="flex flex-col gap-2 font-normal text-base text-gray-700">
            <Link
              href="/wishlist"
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-red-50 hover:text-red-500 transition"
            >
              <Heart className="w-5 h-5 text-red-500" strokeWidth={1.5} />{" "}
              Wishlist
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart
                  className="w-5 h-5 text-green-600"
                  strokeWidth={1.5}
                />{" "}
                Cart
              </div>
              {isAuthenticated && cartItemCount > 0 && (
                <span className="bg-green-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full text-left font-normal cursor-pointer"
              >
                <LogOut className="w-5 h-5" /> Sign Out ({session?.user?.name})
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition"
              >
                <User className="w-5 h-5 text-green-600" /> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
