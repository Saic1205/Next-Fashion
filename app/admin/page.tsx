"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Product } from "../types/types";
import AddProductModal from "../components/AddProductModal";
import {
  getProducts,
  updateProductStatus,
  updateProductSale,
} from "../actions/adminActions";
import { ProductStatus } from "@prisma/client";
import Image from "next/image";
import AdminProductDetails from "../components/adminProductDetails";
import {
  Package2Icon,
  HomeIcon,
  ShoppingCartIcon,
  PackageIcon,
  UsersIcon,
  LineChartIcon,
} from "../components/IconComponents";

type FilterType = {
  productType: "all" | "garment" | "fabric";
  status: "all" | "listed" | "unlisted";
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  //const [totalProducts, setTotalProducts] = useState(0);
  //const [totalGarments, setTotalGarments] = useState(0);
  //const [totalFabrics, setTotalFabrics] = useState(0);
  //const [listedGarments, setListedGarments] = useState(0); //optimized by using stats object
  //const [unlistedGarments, setUnlistedGarments] = useState(0);
  //const [listedFabrics, setListedFabrics] = useState(0);
  //const [unlistedFabrics, setUnlistedFabrics] = useState(0);
  //const [totalCarts, setTotalCarts] = useState(0);
  //const [totalCartItems, setTotalCartItems] = useState(0);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalGarments: 0,
    totalFabrics: 0,
    listedGarments: 0,
    unlistedGarments: 0,
    listedFabrics: 0,
    unlistedFabrics: 0,
    totalCarts: 0,
    totalCartItems: 0,
  });
  const [filter, setFilter] = useState<FilterType>({
    productType: "all",
    status: "all",
  });

  const fetchProducts = useCallback(async () => {
    try {
      const result = await getProducts(currentPage, 10, filter);
      setProducts(result.products);
      setTotalPages(result.totalPages);
      setStats(result.stats);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    fetchProducts();
  }, [filter, fetchProducts]);

  const handleAddProductModalClose = () => setIsAddProductModalOpen(false);
  const handleAddProductModalOpen = () => setIsAddProductModalOpen(true);

  const handleToggleSale = async (
    productId: string,
    currentSaleStatus: boolean,
    productType: "Garment" | "Fabric"
  ) => {
    try {
      await updateProductSale(
        parseInt(productId),
        !currentSaleStatus,
        productType
      );
      fetchProducts();
    } catch (error) {
      console.error("Failed to update sale status:", error);
    }
  };

  const handleToggleStatus = async (
    productId: string,
    currentStatus: ProductStatus,
    productType: "Garment" | "Fabric"
  ) => {
    try {
      const newStatus =
        currentStatus === ProductStatus.LISTED
          ? ProductStatus.UNLISTED
          : ProductStatus.LISTED;
      await updateProductStatus(parseInt(productId), newStatus, productType);
      fetchProducts();
    } catch (error) {
      console.error("Failed to update product status:", error);
    }
  };

  const handleProductClick = (product: Product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);
  const handleProductUpdate = fetchProducts;

  const handleFilterChange = (newFilter: Partial<FilterType>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
    setCurrentPage(1);
  };
  //console.log("Total pages:", totalPages);
  return (
    <div className="min-h-screen bg-base-300">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <main className="p-4 bg-base-800 flex-grow">
            <div className="stats shadow my-4 w-full">
              <div className="stat">
                <div className="stat-title">Total Products</div>
                <div className="stat-value">{stats.totalProducts}</div>
                <div className="stat-desc">
                  listed: {stats.listedGarments + stats.listedFabrics} |
                  unlisted: {stats.unlistedGarments + stats.unlistedFabrics}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Garments</div>
                <div className="stat-value">{stats.totalGarments}</div>
                <div className="stat-desc">
                  listed: {stats.listedGarments} | unlisted:{" "}
                  {stats.unlistedGarments}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Fabrics</div>
                <div className="stat-value">{stats.totalFabrics}</div>
                <div className="stat-desc">
                  listed: {stats.listedFabrics} | unlisted:{" "}
                  {stats.unlistedFabrics}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Cart</div>
                <div className="stat-value">{stats.totalCarts}</div>
                <div className="stat-desc">
                  total items added in all carts: {stats.totalCartItems}
                </div>
              </div>
            </div>
            <div className="card bg-base-100/80 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <div className="tabs tabs-boxed">
                    <a
                      className={`tab ${
                        activeTab === "products" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("products")}
                    >
                      Products
                    </a>
                    <a
                      className={`tab btn-disabled${
                        activeTab === "orders" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("orders")}
                    >
                      Orders
                    </a>
                    <a
                      className={`tab btn-disabled ${
                        activeTab === "customers" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("customers")}
                    >
                      Customers
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-sm m-1">
                        Filter
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        <li>
                          <a
                            className={
                              filter.productType === "all" &&
                              filter.status === "all"
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              handleFilterChange({
                                productType: "all",
                                status: "all",
                              })
                            }
                          >
                            All Products
                          </a>
                        </li>
                        <li>
                          <a
                            className={
                              filter.productType === "garment" ? "active" : ""
                            }
                            onClick={() =>
                              handleFilterChange({ productType: "garment" })
                            }
                          >
                            Garments
                          </a>
                        </li>
                        <li>
                          <a
                            className={
                              filter.productType === "fabric" ? "active" : ""
                            }
                            onClick={() =>
                              handleFilterChange({ productType: "fabric" })
                            }
                          >
                            Fabrics
                          </a>
                        </li>
                        <li>
                          <a
                            className={
                              filter.status === "listed" ? "active" : ""
                            }
                            onClick={() =>
                              handleFilterChange({ status: "listed" })
                            }
                          >
                            Listed
                          </a>
                        </li>
                        <li>
                          <a
                            className={
                              filter.status === "unlisted" ? "active" : ""
                            }
                            onClick={() =>
                              handleFilterChange({ status: "unlisted" })
                            }
                          >
                            Unlisted
                          </a>
                        </li>
                      </ul>
                    </div>
                    <button className="btn btn-sm btn-outline btn-disabled">
                      Export
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={handleAddProductModalOpen}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {activeTab === "products" && (
                  <>
                    <div className="overflow-x-auto">
                      <table className="table table-zebra">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Sale</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Color</th>
                            <th>Collection</th>
                            <th>Designer</th>
                            <th>Pattern</th>
                            <th>Material</th>
                            <th>Created at</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr
                              key={`${product.type}-${product.id}`}
                              onDoubleClick={() => handleProductClick(product)}
                              className="cursor-pointer hover:bg-base-200"
                            >
                              <td>
                                <div className="avatar">
                                  <div className="w-12 h-12">
                                    <Image
                                      src={product.url}
                                      alt={product.name}
                                      width={360}
                                      height={480}
                                      className="h-full w-full object-cover object-top"
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>{product.name}</td>
                              <td>{product.type}</td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="toggle toggle-success-error"
                                  checked={
                                    product.status === ProductStatus.LISTED
                                  }
                                  onChange={() =>
                                    handleToggleStatus(
                                      product.id,
                                      product.status,
                                      product.type
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="toggle toggle-primary"
                                  checked={product.sale}
                                  onChange={() =>
                                    handleToggleSale(
                                      product.id,
                                      product.sale,
                                      product.type
                                    )
                                  }
                                />
                              </td>
                              <td className={product.sale ? "text-error" : ""}>
                                ₹
                                {product.sale && product.sale_price
                                  ? product.sale_price.toFixed(2)
                                  : product.price.toFixed(2)}
                              </td>
                              <td>{product.category}</td>
                              <td>{product.color}</td>
                              <td>
                                {product.type === "Garment"
                                  ? product.collection
                                  : "N/A"}
                              </td>
                              <td>
                                {product.type === "Garment"
                                  ? product.designer
                                  : "N/A"}
                              </td>
                              <td>
                                {product.type === "Fabric"
                                  ? product.pattern
                                  : "N/A"}
                              </td>
                              <td>{product.material}</td>
                              <td>
                                {new Date(product.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-center mt-4">
                      {totalPages > 1 && (
                        <div className="btn-group">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`btn btn-sm ${
                                pageNum === currentPage ? "btn-active" : ""
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "orders" && <p>Orders content here</p>}
                {activeTab === "customers" && <p>Customers content here</p>}
              </div>
            </div>
          </main>
        </div>

        {/* Sidebar */}
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-30 h-full bg-base-200 text-base-content">
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-2 text-xl font-semibold mb-4"
              >
                <Package2Icon className="h-6 w-6" />
                Admin Panel
              </Link>
            </li>
            <li>
              <Link href="admin">
                <HomeIcon className="h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="#" className="btn-disabled">
                <ShoppingCartIcon className="h-5 w-5" />
                Orders
              </Link>
            </li>
            <li>
              <Link href="#">
                <PackageIcon className="h-5 w-5" />
                Products
              </Link>
            </li>
            <li>
              <Link href="#" className="btn-disabled">
                <UsersIcon className="h-5 w-5" />
                Customers
              </Link>
            </li>
            <li>
              <Link href="#" className="btn-disabled">
                <LineChartIcon className="h-5 w-5" />
                Analytics
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onRequestClose={handleAddProductModalClose}
        onProductAdded={fetchProducts}
      />
      {selectedProduct && (
        <AdminProductDetails
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
          onUpdate={handleProductUpdate}
        />
      )}
    </div>
  );
}
