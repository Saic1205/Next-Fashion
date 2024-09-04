import React, { useRef, useEffect, useState, useCallback } from "react";
import MagnifyImage from "./MagnifyImage";
import { Product } from "../types/types";
import { useCart } from "../context/CartContext";

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  isOpen: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onClose,
  isOpen,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { cartItems, toggleItem } = useCart();
  const [isInCart, setIsInCart] = useState(false);

  const checkIfInCart = useCallback(() => {
    const inCart = cartItems.some(
      (item) => String(item.id) === String(product.id)
    );
    console.log(
      "Checking if in cart:",
      inCart,
      "Product ID:",
      product.id,
      "Cart Items:",
      cartItems
    );
    setIsInCart(inCart);
  }, [cartItems, product.id]);

  useEffect(() => {
    checkIfInCart();
  }, [checkIfInCart, cartItems]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const renderPrice = () => {
    const pricePerUnit = product.type === "Fabric" ? "/m" : "";
    if (product.sale) {
      return (
        <>
          <span className="line-through mr-2">
            ₹{product.price.toFixed(2)}
            {pricePerUnit}
          </span>
          <span className="text-error">
            ₹{product.sale_price ? (product.sale_price ?? 0).toFixed(2) : ""}
            {pricePerUnit}
          </span>
        </>
      );
    } else {
      return `₹${product.price.toFixed(2)}${pricePerUnit}`;
    }
  };

  const handleToggleCart = async () => {
    await toggleItem(product);
    checkIfInCart();
  };

  if (!isOpen) return null;
  console.log(isInCart, "cart");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-base-200/80 rounded-lg p-6 max-w-2xl w-full mx-4 relative"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-2/5 mb-4 sm:mb-0 sm:pr-4">
            <MagnifyImage
              src={product.url}
              alt={product.name}
              width={200}
              height={300}
            />
          </div>

          <div className="sm:w-3/5 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-xl font-semibold text-error mb-2">
                {renderPrice()}
              </p>
              {product.type === "Garment" ? (
                <>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Collection:</span>{" "}
                    {product.collection}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Designer:</span>{" "}
                    {product.designer}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Size:</span> {product.size}
                  </p>
                  <p className="text-sm mb-4">
                    <span className="font-semibold">Brand:</span>{" "}
                    {product.brand}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Material:</span>{" "}
                    {product.material}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Pattern:</span>{" "}
                    {product.pattern}
                  </p>
                  {product.length && (
                    <p className="text-sm mb-4">
                      <span className="font-semibold">Length:</span>{" "}
                      {product.length} meters
                    </p>
                  )}
                </>
              )}
              <p className="text-sm mb-1">
                <span className="font-semibold">Category:</span>{" "}
                {product.category}
              </p>
              <p className="text-sm mb-4">
                <span className="font-semibold">Color:</span> {product.color}
              </p>
            </div>
            <div className="flex justify-end items-end space-x-3 mt-auto">
              <button
                className={`btn ${
                  isInCart ? "btn-error" : "btn-primary"
                } btn-outline w-full sm:w-auto rounded-md text-sm px-6 py-2`}
                onClick={handleToggleCart}
              >
                {isInCart ? "Remove from Cart" : "Add to Cart"}
              </button>
              <button className="btn btn-error btn-outline w-full sm:w-auto rounded-md text-sm px-6 py-2">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
