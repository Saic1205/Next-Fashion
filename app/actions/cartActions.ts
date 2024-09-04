"use server";

import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../prisma/client";
import { Product } from "../types/types";

export async function getOrCreateSessionId() {
  const cookieStore = cookies();
  let sessionId = cookieStore.get("cartSessionId")?.value;

  if (!sessionId) {
    sessionId = uuidv4();
    cookieStore.set("cartSessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return sessionId;
}

export async function getCartItems(sessionId: string) {
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      CartItem: {
        include: {
          garment: true,
          fabric: true,
        },
      },
    },
  });

  if (!cart) {
    return [];
  }

  return cart.CartItem.map((item) => {
    const product = item.garment || item.fabric;
    return {
      ...product,
      quantity: item.quantity,
      type: item.garment ? "Garment" : "Fabric",
    } as Product;
  });
}

export async function toggleCartItem(sessionId: string, product: Product) {
  const cart = await prisma.cart.findUnique({ where: { sessionId } });

  if (!cart) {
    await prisma.cart.create({ data: { sessionId } });
  }

  const productId = parseInt(product.id);
  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart!.id,
      OR: [
        { garmentId: product.type === "Garment" ? productId : undefined },
        { fabricId: product.type === "Fabric" ? productId : undefined },
      ],
    },
  });

  if (existingCartItem) {
    await prisma.cartItem.delete({ where: { id: existingCartItem.id } });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart!.id,
        quantity: 1,
        ...(product.type === "Garment"
          ? { garmentId: productId }
          : { fabricId: productId }),
      },
    });
  }

  return getCartItems(sessionId);
}
