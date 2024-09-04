"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "./context/CartContext";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { cartCount, cartTotal } = useCart();
  const [scrollPosition, setScrollPosition] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextFashionOpacity = Math.max(1 - scrollPosition / 100, 0);
  const pathOpacity = Math.min(scrollPosition / 100, 1);
  const gradientOpacity = Math.min(scrollPosition / 100, 1);

  const pathName = pathname.slice(1);
  const capitalizedPathName =
    pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <nav
      className="navbar fixed top-0 z-50 transition-all duration-300 rounded-bottom"
      style={{
        backgroundColor: `rgba(24, 24, 27, ${1 - gradientOpacity})`,
        backgroundImage: `linear-gradient(to right, rgba(14, 165, 233, ${gradientOpacity}), rgba(139, 92, 246, ${gradientOpacity}))`,
      }}
    >
      <div className="navbar-start">
        <div className="btn btn-ghost">
          <Link
            href="/"
            className="normal-case text-xl text-white"
            style={{ opacity: pathOpacity }}
          >
            Next Fashion
          </Link>
        </div>
      </div>
      <div className="navbar-center">
        <h1
          className="text-2xl font-bold absolute left-0 right-0 text-center transition-opacity duration-300"
          style={{ opacity: nextFashionOpacity }}
        >
          Next Fashion
        </h1>
        <h1
          className="text-2xl font-bold absolute left-0 right-0 text-center text-white transition-opacity duration-300"
          style={{ opacity: pathOpacity }}
        >
          {capitalizedPathName}
        </h1>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke={cartCount > 0 ? "white" : "currentColor"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="badge badge-sm indicator-item">{cartCount}</span>
            </div>
          </label>
          <div
            tabIndex={0}
            className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg">{cartCount} Items</span>
              <span className="text-info">
                Subtotal: ₹{Number(cartTotal).toFixed(2)} 
              </span>
              <div className="card-actions">
                <Link href="/cart" className="btn btn-primary btn-block">
                  View cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
