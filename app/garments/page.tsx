import { Product } from "../types/types";
import Products from "../components/Products";
import prisma from "../../prisma/client";

export default async function GarmentsPage() {
  const initialGarments = await prisma.garment.findMany({
    take: 10,
    where: {
      status: "LISTED",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const products: Product[] = initialGarments.map((g) => ({
    ...g,
    type: "Garment",
    price: Number(g.price),
    sale_price: g.sale_price ? Number(g.sale_price) : null,
    id: g.id.toString(),
  }));

  return <Products initialProducts={products} productType="garment" />;
}
