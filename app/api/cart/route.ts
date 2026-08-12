import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Check authentication
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get request data
    const body = await request.json();

    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // 3. Find user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Find product
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 5. Check stock
    if (product.stock <= 0) {
      return NextResponse.json(
        { error: "Product is out of stock" },
        { status: 400 },
      );
    }

    // 6. Find or create cart
    let cart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
    }

    // 7. Check if product already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },
    });

    if (existingItem) {
      // Don't allow quantity to exceed stock
      if (existingItem.quantity >= product.stock) {
        return NextResponse.json(
          { error: "Not enough stock available" },
          { status: 400 },
        );
      }

      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      });
    } else {
      // First time adding this product
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: 1,
        },
      });
    }

    return NextResponse.json({
      message: "Product added to cart",
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    return NextResponse.json(
      { error: "Failed to add product to cart" },
      { status: 500 },
    );
  }
}
