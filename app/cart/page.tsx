import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import QuantityControl from "./QuantityControl";
import RemoveButton from "./RemoveButton";

export default async function CartPage() {
  // 1. Cek user yang sedang login
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // 2. Ambil cart milik user
  const cart = await prisma.cart.findFirst({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  // 3. Ambil cart items
  const cartItems = cart?.items ?? [];

  // 4. Hitung subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/products" className="text-xl font-bold text-blue-600">
            StockFlow
          </Link>

          <Link
            href="/products"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>

        <p className="mt-2 text-sm text-slate-500">
          Review the products you want to purchase.
        </p>

        {/* Empty cart */}
        {cartItems.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="text-6xl">🛒</div>

            <h2 className="mt-5 text-xl font-semibold">Your cart is empty</h2>

            <p className="mt-2 text-sm text-slate-500">
              Add some products before checking out.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm"
                >
                  {/* Product image */}
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-5xl">
                    📦
                  </div>

                  {/* Product information */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-600">
                        {item.product.category.name}
                      </p>

                      <Link
                        href={`/products/${item.product.id}`}
                        className="mt-1 block font-semibold hover:text-blue-600"
                      >
                        {item.product.name}
                      </Link>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      {/* Price */}
                      <p className="font-bold text-blue-600">
                        ${item.product.price.toString()}
                      </p>

                      {/* Quantity */}
                      <QuantityControl
                        cartItemId={item.id}
                        quantity={item.quantity}
                      />
                      <RemoveButton cartItemId={item.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Order Summary</h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Items</span>

                  <span>
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>

                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>

                    <span className="text-blue-600">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
