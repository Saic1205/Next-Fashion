// app/layout.tsx

import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar";
import { ToastContainer } from "./components/toastifty";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";

const inter = Roboto_Condensed({ subsets: ["cyrillic-ext"] });

export const metadata: Metadata = {
  title: "Next Gallery",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        <CartProvider>
          <header className="pb-16">
            <Navbar />
          </header>
          {children}
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}
