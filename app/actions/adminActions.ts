"use server";
import { writeFile } from "fs/promises";
import path from "path";
import { ProductStatus, Garment, Fabric, Prisma } from "@prisma/client";
import prisma from "../../prisma/client";
import { Product } from "../types/types";

// Function to save an uploaded image
async function saveImage(image: File): Promise<string> {
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filepath = path.join(process.cwd(), "public", "uploads", image.name);
  await writeFile(filepath, buffer);
  return `/uploads/${image.name}`;
}

// Function to create a new product (garment or fabric)
export async function createProduct(
  formData: FormData
): Promise<Garment | Fabric> {
  const productType = formData.get("productType") as "garment" | "fabric";
  const frontImage = formData.get("frontImage") as File;
  const backImage = formData.get("backImage") as File;

  const frontImageUrl = await saveImage(frontImage);
  const backImageUrl = await saveImage(backImage);

  const commonData = {
    name: formData.get("name") as string,
    price: Number(formData.get("price")),
    sale_price: formData.get("sale_price")
      ? Number(formData.get("sale_price"))
      : null,
    status: ProductStatus.UNLISTED,
    sale: false,
    color: formData.get("color") as string,
    category: formData.get("category") as string,
    url: frontImageUrl,
    url2: backImageUrl,
  };

  if (productType === "garment") {
    const garmentData = {
      ...commonData,
      collection: formData.get("collection") as string,
      designer: formData.get("designer") as string,
      size: formData.get("size") as string,
      brand: formData.get("brand") as string,
      material: formData.get("material") as string,
    };
    return await prisma.garment.create({
      data: {
        ...garmentData,
        price: new Prisma.Decimal(garmentData.price),
        sale_price: garmentData.sale_price
          ? new Prisma.Decimal(garmentData.sale_price)
          : null,
      },
    });
  } else {
    const fabricData = {
      ...commonData,
      material: formData.get("material") as string,
      pattern: formData.get("pattern") as string,
      length: formData.get("length") ? Number(formData.get("length")) : null,
    };
    return await prisma.fabric.create({
      data: {
        ...fabricData,
        price: new Prisma.Decimal(fabricData.price),
        sale_price: fabricData.sale_price
          ? new Prisma.Decimal(fabricData.sale_price)
          : null,
      },
    });
  }
}

// Function to get products with pagination and filtering
export async function getProducts(
  page = 1,
  pageSize = 10,
  filter: {
    productType: "all" | "garment" | "fabric";
    status: "all" | "listed" | "unlisted";
  } = { productType: "all", status: "all" }
): Promise<{
  products: Product[];
  totalPages: number;
  currentPage: number;
  stats: {
    totalProducts: number;
    totalGarments: number;
    totalFabrics: number;
    listedGarments: number;
    unlistedGarments: number;
    listedFabrics: number;
    unlistedFabrics: number;
    totalCarts: number;
    totalCartItems: number;
  };
}> {
  const skip = (page - 1) * pageSize;

  // Status filter based on the 'status' parameter
  const statusFilter =
    filter.status === "all"
      ? {}
      : {
          status:
            filter.status === "listed"
              ? ProductStatus.LISTED
              : ProductStatus.UNLISTED,
        };

  // Queries based on the product type filter
  let garmentPromise, fabricPromise, totalFilteredProducts;

  if (filter.productType === "all" || filter.productType === "garment") {
    garmentPromise = prisma.garment.findMany({
      where: statusFilter,
      orderBy: { createdAt: "desc" },
    });
  } else {
    garmentPromise = Promise.resolve([]);
  }

  if (filter.productType === "all" || filter.productType === "fabric") {
    fabricPromise = prisma.fabric.findMany({
      where: statusFilter,
      orderBy: { createdAt: "desc" },
    });
  } else {
    fabricPromise = Promise.resolve([]);
  }

  if (filter.productType === "all") {
    totalFilteredProducts = prisma.garment
      .count({ where: statusFilter })
      .then((garmentCount) =>
        prisma.fabric
          .count({ where: statusFilter })
          .then((fabricCount) => garmentCount + fabricCount)
      );
  } else if (filter.productType === "garment") {
    totalFilteredProducts = prisma.garment.count({ where: statusFilter });
  } else {
    totalFilteredProducts = prisma.fabric.count({ where: statusFilter });
  }

  // Execute all queries in parallel
  const [
    garments,
    fabrics,
    totalGarments,
    totalFabrics,
    listedGarments,
    unlistedGarments,
    listedFabrics,
    unlistedFabrics,
    totalCarts,
    totalCartItems,
    filteredProductsCount,
  ] = await Promise.all([
    garmentPromise,
    fabricPromise,
    prisma.garment.count(),
    prisma.fabric.count(),
    prisma.garment.count({ where: { status: ProductStatus.LISTED } }),
    prisma.garment.count({ where: { status: ProductStatus.UNLISTED } }),
    prisma.fabric.count({ where: { status: ProductStatus.LISTED } }),
    prisma.fabric.count({ where: { status: ProductStatus.UNLISTED } }),
    prisma.cart.count(),
    prisma.cartItem.aggregate({ _sum: { quantity: true } }),
    totalFilteredProducts,
  ]);

  // Combine and format the products
  let products: Product[] = [
    ...garments.map(
      (g): Product => ({
        ...g,
        type: "Garment",
        price: Number(g.price),
        sale_price: g.sale_price ? Number(g.sale_price) : null,
        id: g.id.toString(),
      })
    ),
    ...fabrics.map(
      (f): Product => ({
        ...f,
        type: "Fabric",
        price: Number(f.price),
        sale_price: f.sale_price ? Number(f.sale_price) : null,
        id: f.id.toString(),
        length: f.length !== null ? Number(f.length) : null,
      })
    ),
  ];

  // Sort all products by createdAt in descending order
  products.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Apply pagination
  products = products.slice(skip, skip + pageSize);

  const totalPages = Math.ceil(filteredProductsCount / pageSize);

  return {
    products,
    totalPages,
    currentPage: page,
    stats: {
      totalProducts: totalGarments + totalFabrics,
      totalGarments,
      totalFabrics,
      listedGarments,
      unlistedGarments,
      listedFabrics,
      unlistedFabrics,
      totalCarts,
      totalCartItems: totalCartItems._sum.quantity || 0,
    },
  };
}

// Function to update a garment
export async function updateGarment(
  productId: number,
  updatedData: Prisma.GarmentUpdateInput
): Promise<Garment> {
  return await prisma.garment.update({
    where: { id: productId },
    data: {
      ...updatedData,
      price: updatedData.price
        ? new Prisma.Decimal(updatedData.price as number)
        : undefined,
      sale_price: updatedData.sale_price
        ? new Prisma.Decimal(updatedData.sale_price as number)
        : null,
    },
  });
}

// Function to update a fabric
export async function updateFabric(
  productId: number,
  updatedData: Prisma.FabricUpdateInput
): Promise<Fabric> {
  return await prisma.fabric.update({
    where: { id: productId },
    data: {
      ...updatedData,
      price: updatedData.price
        ? new Prisma.Decimal(updatedData.price as number)
        : undefined,
      sale_price: updatedData.sale_price
        ? new Prisma.Decimal(updatedData.sale_price as number)
        : null,
    },
  });
}

// Function to update product status
export async function updateProductStatus(
  productId: number,
  newStatus: ProductStatus,
  productType: "Garment" | "Fabric"
): Promise<Garment | Fabric> {
  if (productType === "Garment") {
    return await updateGarment(productId, { status: newStatus });
  } else {
    return await updateFabric(productId, { status: newStatus });
  }
}

// Updated function to update product sale status
export async function updateProductSale(
  productId: number,
  newSaleStatus: boolean,
  productType: "Garment" | "Fabric"
): Promise<Garment | Fabric> {
  if (productType === "Garment") {
    const garment = await prisma.garment.findUnique({
      where: { id: productId },
    });
    if (!garment) {
      throw new Error("Garment not found");
    }

    const updateData: Prisma.GarmentUpdateInput = {
      sale: newSaleStatus,
      // updates sale_price if it's not already set and we're activating the sale
      ...(newSaleStatus &&
        !garment.sale_price && {
          sale_price: new Prisma.Decimal(Number(garment.price) * 0.9), // 10% discount as an example
        }),
    };

    return await prisma.garment.update({
      where: { id: productId },
      data: updateData,
    });
  } else {
    const fabric = await prisma.fabric.findUnique({ where: { id: productId } });
    if (!fabric) {
      throw new Error("Fabric not found");
    }

    const updateData: Prisma.FabricUpdateInput = {
      sale: newSaleStatus,
      //  updates sale_price if it's not already set and we're activating the sale
      ...(newSaleStatus &&
        !fabric.sale_price && {
          sale_price: new Prisma.Decimal(Number(fabric.price) * 0.9), // 10% discount (default)
        }),
    };

    return await prisma.fabric.update({
      where: { id: productId },
      data: updateData,
    });
  }
}
export async function deleteProduct(
  productId: number,
  productType: "Garment" | "Fabric"
): Promise<void> {
  if (productType === "Garment") {
    await prisma.garment.delete({
      where: { id: productId },
    });
  } else {
    await prisma.fabric.delete({
      where: { id: productId },
    });
  }
}

// Function to fetch unique values for dropdown options
export async function fetchUniqueValues() {
  const [garments, fabrics] = await Promise.all([
    prisma.garment.findMany(),
    prisma.fabric.findMany(),
  ]);

  const uniqueValues = {
    collection: Array.from(new Set(garments.map((g) => g.collection))),
    designer: Array.from(new Set(garments.map((g) => g.designer))),
    size: Array.from(new Set(garments.map((g) => g.size))),
    category: Array.from(
      new Set([...garments, ...fabrics].map((p) => p.category))
    ),
    color: Array.from(new Set([...garments, ...fabrics].map((p) => p.color))),
    brand: Array.from(new Set(garments.map((g) => g.brand))),
    material: Array.from(
      new Set([...garments, ...fabrics].map((p) => p.material))
    ),
    pattern: Array.from(new Set(fabrics.map((f) => f.pattern))),
    
  };

  return uniqueValues;
}
