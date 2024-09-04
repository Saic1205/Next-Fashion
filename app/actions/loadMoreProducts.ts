'use server'
import { Product } from "../types/types";
import prisma from "../../prisma/client";

export async function loadMoreProducts(
  page: number,
  pageSize: number,
  productType: "garment" | "fabric"
): Promise<Product[]> {
  const skip = (page - 1) * pageSize;

  if (productType === "garment") {
    const garments = await prisma.garment.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
    return garments.map((g) => ({
      ...g,
      type: "Garment" as const,
      price: Number(g.price),
      sale_price: g.sale_price ? Number(g.sale_price) : null,
      id: g.id.toString(),
    }));
  } else {
    const fabrics = await prisma.fabric.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
    return fabrics.map((f) => ({
      ...f,
      type: "Fabric" as const,
      price: Number(f.price),
      sale_price: f.sale_price ? Number(f.sale_price) : null,
      id: f.id.toString(),
      length: f.length !== null ? Number(f.length) : null,
    }));
  }
}
