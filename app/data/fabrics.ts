// unused data in the new version

export enum ProductStatus {
  Listed = "listed",
  Unlisted = "unlisted",
}
export interface FabricType {
  id: number;
  name: string;
  url: string;
  url2: string;
  price: string;
  sale: boolean;
  category: string;
  status: ProductStatus;
  color: string;
  material: string;
  pattern: string;
  Length?: number;
}

export const fabrics: FabricType[] = [
  {
    id: 1,
    name: "Cotton Fabric",
    url: "/fabrics/cotton1.jpg",
    url2: "/fabrics/cotton2.jpg",
    price: "₹500",
    sale: false,
    category: "Natural",
    status: ProductStatus.Unlisted,
    color: "White",
    material: "100% Cotton",
    pattern: "Solid",
  },
];
