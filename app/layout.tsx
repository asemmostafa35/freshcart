import type { Metadata } from "next";
import { Exo } from "next/font/google";
import "./globals.css";
import Footer from "./_component/footer/page";
import { cn } from "@/lib/utils";
import { Navbar } from "./_component/navbar/page";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "./_component/ReduxProvider/ReduxProvider";

const geistSans = Exo({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
  variable: "--font-exo",
});
export const metadata: Metadata = {
  title: "Fresh Cart - E-commerce Store",
  description:
    "FreshCart is your one-stop online shop for fresh groceries, daily essentials, and premium quality products delivered directly to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, "font-sans")}
    >
      <body>
        <ReduxProvider>
          <Navbar />
          <Toaster position="top-right" reverseOrder={false} />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
