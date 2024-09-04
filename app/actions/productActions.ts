// unused code in current implementation
"use server";

import { writeFile } from "fs/promises";
import path from "path";
import { ProductStatus, Garment, Fabric } from "@prisma/client";
import prisma from "../../prisma/client";
import { Product, GarmentData, FabricData } from "../types/types";
import { Decimal } from "@prisma/client/runtime/library";

async function saveImage(image: File): Promise<string> {
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filepath = path.join(process.cwd(), "public", "uploads", image.name);
  await writeFile(filepath, buffer);
  return `/uploads/${image.name}`;
}

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
    price: new Decimal(formData.get("price") as string),
    status: ProductStatus.UNLISTED,
    sale: false,
    color: formData.get("color") as string,
    category: formData.get("category") as string,
    url: frontImageUrl,
    url2: backImageUrl,
  };

  if (productType === "garment") {
    return await prisma.garment.create({
      data: {
        ...commonData,
        collection: formData.get("collection") as string,
        designer: formData.get("designer") as string,
        size: formData.get("size") as string,
        brand: formData.get("brand") as string,
        material: formData.get("material") as string,
      },
    });
  } else {
    return await prisma.fabric.create({
      data: {
        ...commonData,
        material: formData.get("material") as string,
        pattern: formData.get("pattern") as string,
      },
    });
  }
}

export async function getProducts(
  page = 1,
  pageSize = 10,
  productType: "garment" | "fabric" | "all" = "all"
): Promise<{
  products: Product[];
  totalPages: number;
  currentPage: number;
}> {
  const skip = (page - 1) * pageSize;

  let garments: Garment[] = [];
  let fabrics: Fabric[] = [];
  let totalGarments = 0;
  let totalFabrics = 0;

  if (productType === "all" || productType === "garment") {
    [garments, totalGarments] = await Promise.all([
      prisma.garment.findMany({ skip, take: pageSize }),
      prisma.garment.count(),
    ]);
  }

  if (productType === "all" || productType === "fabric") {
    [fabrics, totalFabrics] = await Promise.all([
      prisma.fabric.findMany({ skip, take: pageSize }),
      prisma.fabric.count(),
    ]);
  }

  const products: Product[] = [
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
  const totalProducts = totalGarments + totalFabrics;
  const totalPages = Math.ceil(totalProducts / pageSize);
console.log("product",products)
  return { products, totalPages, currentPage: page };
}

export async function updateProductStatus(
  productId: number,
  newStatus: ProductStatus,
  productType: "Garment" | "Fabric"
): Promise<Garment | Fabric> {
  if (productType === "Garment") {
    return await prisma.garment.update({
      where: { id: productId },
      data: { status: newStatus },
    });
  } else {
    return await prisma.fabric.update({
      where: { id: productId },
      data: { status: newStatus },
    });
  }
}

export async function updateProductSale(
  productId: number,
  newSaleStatus: boolean,
  productType: "Garment" | "Fabric"
): Promise<Garment | Fabric> {
  if (productType === "Garment") {
    return await prisma.garment.update({
      where: { id: productId },
      data: { sale: newSaleStatus },
    });
  } else {
    return await prisma.fabric.update({
      where: { id: productId },
      data: { sale: newSaleStatus },
    });
  }
}
