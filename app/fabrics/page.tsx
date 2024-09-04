import { Product } from "../types/types";
import Products from "../components/Products";
import prisma from "../../prisma/client";

export default async function FabricPage() {
  const initialFabrics = await prisma.fabric.findMany({
    take: 10,
    where: {
      status: "LISTED",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const products: Product[] = initialFabrics.map((f) => ({
    ...f,
    type: "Fabric",
    price: Number(f.price),
    sale_price: f.sale_price ? Number(f.sale_price) : null,
    id: f.id.toString(),
  }));

  return <Products initialProducts={products} productType="fabric" />;
}
