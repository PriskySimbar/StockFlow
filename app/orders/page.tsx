import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/products" className="text-xl font-bold">
            StockFlow
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Products
            </Link>

            <Link
              href="/cart"
              className="rounded-lg px-3 py-2 text-xl hover:bg-slate-100"
            >
              🛒
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold">My Orders</h1>

        <p className="mt-2 text-sm text-slate-500">
          View your previous orders and their status.
        </p>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">📦</div>

            <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>

            <p className="mt-2 text-sm text-slate-500">
              Your orders will appear here after you make a purchase.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                {/* Order header */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-semibold">
                      Order #{order.id.slice(-8)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {order.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    {order.status}
                  </span>
                </div>

                {/* Products */}
                <div className="mt-5 border-t pt-5">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {item.product.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.quantity} × ${item.price.toString()}
                        </p>
                      </div>

                      <p className="text-sm font-semibold">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between border-t pt-5">
                  <div>
                    <p className="text-xs text-slate-500">Total</p>

                    <p className="mt-1 text-xl font-bold text-blue-600">
                      ${order.total.toString()}
                    </p>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="rounded-lg border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
