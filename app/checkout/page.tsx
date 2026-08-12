import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PlaceOrderButton from "./PlaceOrderButton";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const cart = await prisma.cart.findFirst({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const cartItems = cart?.items ?? [];

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/products" className="text-xl font-bold text-blue-600">
            StockFlow
          </Link>

          <Link
            href="/cart"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Cart
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <p className="mt-2 text-sm text-slate-500">
          Complete your order information.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Customer information */}
          <form className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium">Full Name</label>

              <input
                name="name"
                defaultValue={session.user.name ?? ""}
                placeholder="Your full name"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>

              <textarea
                name="address"
                placeholder="Your shipping address"
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>

              <input
                name="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </form>

          {/* Order summary */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{item.product.name}</p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.quantity} × ${item.product.price.toString()}
                    </p>
                  </div>

                  <p className="text-sm font-semibold">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-5">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>

                <span className="text-blue-600">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <PlaceOrderButton />
          </div>
        </div>
      </section>
    </main>
  );
}
