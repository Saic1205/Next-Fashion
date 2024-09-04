import { Prisma, ProductStatus } from "@prisma/client";

export type Product = {
  id: string;
  type: "Garment" | "Fabric";
  name: string;
  url: string;
  url2: string;
  status: ProductStatus;
  sale: boolean;
  price: number;
  sale_price: number | null;
  category: string;
  color: string;
  material: string | null;
  createdAt: Date;
  // Optional fields
  collection?: string;
  designer?: string;
  pattern?: string;
  size?: string;
  brand?: string;
  length?: number | null;
  quantity?: number;
  cart?: boolean;
};


export type GarmentUpdateInput = Prisma.GarmentUpdateInput;
export type FabricUpdateInput = Prisma.FabricUpdateInput;

export type GarmentData = {
  name: string;
  price: number;
  sale_price: number | null;
  status: ProductStatus;
  sale: boolean;
  collection: string;
  designer: string;
  category: string;
  color: string;
  size: string;
  brand: string;
  material: string | null;
  frontImage: any[];
  backImage: any[];
};

export type FabricData = {
  name: string;
  price: number;
  sale_price: number | null;
  sale: boolean;
  category: string;
  status: ProductStatus;
  color: string;
  material: string;
  pattern: string;
  frontImage: any[];
  backImage: any[];
};
