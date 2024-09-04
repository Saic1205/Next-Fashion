"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "../lib/utils";
import Footer from "../components/Footer";
import ProductDetails from "../components/ProductDetails";
import { Product } from "../types/types";
import { useCart } from "../context/CartContext";
import Divider from "../components/Divider";
import { loadMoreProducts  } from "../actions/loadMoreProducts";
import CategoriesDrawer from "../components/CategoriesDrawer";

interface ProductsProps {
  initialProducts: Product[];
  productType: "garment" | "fabric";
}

const PRODUCTS_PER_PAGE = 10;

const Products: React.FC<ProductsProps> = ({
  initialProducts,
  productType,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { cartItems, toggleItem } = useCart();
  const observer = useRef<IntersectionObserver | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<{
    categories: string[];
    priceRanges: string[];
    colors: string[];
    sizes: string[];
    brands: string[];
  }>({
    categories: [],
    priceRanges: [],
    colors: [],
    sizes: [],
    brands: [],
  });
  const [uniqueValues, setUniqueValues] = useState<{
    categories: string[];
    priceRanges: string[];
    colors: string[];
    sizes: string[];
    brands: string[];
    materials: string[];
    patterns: string[];
  }>({
    categories: [],
    priceRanges: [],
    colors: [],
    sizes: [],
    brands: [],
    materials: [],
    patterns: [],
  });

  const loadMoreProductsFromServer = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newProducts = await loadMoreProducts(
        page + 1,
        PRODUCTS_PER_PAGE,
        productType
      );

      if (newProducts.length > 0) {
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, productType]);

  const lastProductElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore || !node) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreProductsFromServer();
          }
        },
        { threshold: 0.7 }
      );

      observer.current.observe(node);
    },
    [loading, hasMore, loadMoreProductsFromServer]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (products.length === 0) {
      loadMoreProductsFromServer();
    }
  }, [products.length, loadMoreProductsFromServer]);

  const headingOpacity = Math.max(1 - scrollPosition / 100, 0);

  const applyGrayscaleEffect = useCallback(() => {
    productRefs.current.forEach((ref, index) => {
      if (ref && products[index].id !== selectedProduct?.id) {
        ref.style.filter = "grayscale(100%)";
      }
    });
  }, [products, selectedProduct]);

  const removeGrayscaleEffect = useCallback(() => {
    productRefs.current.forEach((ref) => {
      if (ref) {
        ref.style.filter = "";
      }
    });
  }, []);

  const openModal = useCallback(
    (product: Product) => {
      setSelectedProduct(product);
      setIsModalOpen(true);
      applyGrayscaleEffect();
    },
    [applyGrayscaleEffect]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    removeGrayscaleEffect();
  }, [removeGrayscaleEffect]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            const target = entry.target as HTMLElement;
            const productId = target.getAttribute("data-id");

            if (
              !isModalOpen ||
              (isModalOpen && productId === selectedProduct?.id)
            ) {
              if (ratio > 0.8) {
                target.style.filter = "grayscale(0%)";
              } else {
                const grayscaleValue = 100 - (ratio / 0.8) * 100;
                target.style.filter = `grayscale(${grayscaleValue}%)`;
              }
            } else if (isModalOpen && productId !== selectedProduct?.id) {
              target.style.filter = "grayscale(100%)";
            }
          } else if (!isModalOpen) {
            entry.target.setAttribute("style", "filter: grayscale(100%)");
          }
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        rootMargin: "0px 0px -20% 0px",
      }
    );

    const currentProductRefs = productRefs.current;

    currentProductRefs.forEach((ref, index) => {
      if (ref) {
        ref.setAttribute("data-id", products[index].id);
        observer.observe(ref);
      }
    });

    return () => {
      currentProductRefs.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [isModalOpen, selectedProduct, products]);

const filterProducts = useCallback(
  (products: Product[]) => {
    return products.filter((product) => {
      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);

      const priceRangeMatch = filters.priceRanges.every((range) => {
        const [min, max] = range.split("-").map(Number);
        const productPrice = product.sale_price && product.sale? product.sale_price : product.price;
          

        // Handle ranges like "5000+"
        if (isNaN(max)) {
          return productPrice >= min;
        }

        return productPrice >= min && productPrice <= max;
      });

      const colorMatch =
        filters.colors.length === 0 || filters.colors.includes(product.color);
      const sizeMatch =
        filters.sizes.length === 0 ||
        (product.type === "Garment" &&
          filters.sizes.includes(product.size || ""));
      const brandMatch =
        filters.brands.length === 0 ||
        (product.type === "Garment" &&
          filters.brands.includes(product.brand || ""));

      return (
        categoryMatch &&
        priceRangeMatch &&
        colorMatch &&
        sizeMatch &&
        brandMatch
      );
    });
  },
  [filters]
);

  const filteredProducts = filterProducts(products);

  const handleToggleItem = useCallback(
    async (product: Product, e: React.MouseEvent) => {
      e.stopPropagation();
      
      await toggleItem(product);
    
    },
    [toggleItem]
  );
  const isProductInCart = useCallback(
    (productId: string) => {
      
      const isInCart = cartItems.some(
        (item) => String(item.id) === String(productId)
      );
     
      return isInCart;
    },
    [cartItems]
  );

  useEffect(() => {
    console.log("Cart items updated:", cartItems);
  }, [cartItems]);

  

  return (
    <div className="min-h-screen bg-base-800">
      <div
        className="p-2 sm:p-4 glass  transition-opacity duration-300 sticky top-0 z-20"
        style={{ opacity: headingOpacity }}
      >
        <div className="flex justify-center items-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            {productType === "garment" ? "Garments" : "Fabrics"}
          </h1>
        </div>
      </div>

      <div className="flex">
        <CategoriesDrawer
          isOpen={isDrawerOpen}
          toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
          onFilterChange={setFilters}
          productType={productType}
          
        />

        <div
          className={`flex-grow transition-all duration-300 ${
            isDrawerOpen ? "ml-0" : "-ml-64"
          }`}
        >
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
              isDrawerOpen ? "xl:grid-cols-4" : "xl:grid-cols-5"
            } gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 m-2 sm:m-3 md:m-5`}
          >
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={cn(
                  "bg-white rounded-md p-1 overflow-hidden relative group",
                  "transition-all duration-500 transform cursor-pointer"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => openModal(product)}
                ref={
                  index === filteredProducts.length - 1
                    ? lastProductElementRef
                    : (el) => {
                        if (el) productRefs.current[index] = el;
                      }
                }
                data-id={product.id}
              >
                <div className="absolute top-2 right-2 z-10">
                  <div
                    className="stat-figure text-primary cursor-pointer"
                    onClick={(e) => handleToggleItem(product, e)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline-block h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={
                        isProductInCart(product.id) ? "currentColor" : "grey"
                      }
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                {product.sale && (
                  <div className="badge badge-error absolute top-2 left-2 z-10">
                    Sale
                  </div>
                )}
                <div className="relative w-full pb-[133.33%]">
                  <Image
                    alt="Product"
                    src={hoveredIndex === index ? product.url2 : product.url}
                    fill
                    className="rounded-md transition-all duration-500 transform group-hover:scale-105 object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-2 p-2 transition-opacity duration-300">
                  {hoveredIndex === index ? (
                    <>
                      <p className="font-bold text-sm sm:text-base md:text-lg text-center">
                        {"collection" in product
                          ? product.collection
                          : product.material}
                      </p>
                      <p className="font-normal text-xs sm:text-sm text-center">
                        {"designer" in product
                          ? product.designer
                          : product.pattern}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-sm sm:text-base md:text-lg text-center">
                        {product.name}
                      </p>
                      <p className="font-normal text-xs sm:text-sm text-center">
                        {"designer" in product ? (
                          product.sale ? (
                            <>
                              <span className="line-through mr-2">
                                ₹{product.price.toFixed(2)}
                              </span>
                              <span className="text-error">
                                ₹
                                {product.sale_price
                                  ? (product.sale_price ?? 0).toFixed(2)
                                  : ""}
                              </span>
                            </>
                          ) : (
                            `₹${product.price.toFixed(2)}`
                          )
                        ) : product.sale ? (
                          <>
                            <span className="line-through mr-2">
                              ₹{product.price.toFixed(2)}/m
                            </span>
                            <span className="text-error">
                              ₹
                              {product.sale_price
                                ? (product.sale_price ?? 0).toFixed(2)
                                : ""}
                              /m
                            </span>
                          </>
                        ) : (
                          `₹${product.price.toFixed(2)}/m`
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </div>

      {!hasMore && products.length > 0 && <Divider />}
      <Footer />

      {selectedProduct && isModalOpen && (
        <ProductDetails
          product={selectedProduct}
          onClose={closeModal}
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
};
export default Products;

//bg-gradient-to-r from-sky-500/70 to-violet-500/70