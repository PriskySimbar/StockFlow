import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      id,
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

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link href="/products" className="text-xl font-bold text-blue-600">
            StockFlow
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">✓</div>

          <h1 className="mt-4 text-2xl font-bold">Order Placed Successfully</h1>

          <p className="mt-2 text-sm text-slate-500">
            Thank you for your purchase.
          </p>

          <div className="mt-8 rounded-xl bg-slate-50 p-5 text-left">
            <p className="text-sm text-slate-500">Order ID</p>

            <p className="mt-1 break-all font-mono text-sm">{order.id}</p>

            <div className="mt-5 flex justify-between">
              <span className="text-sm text-slate-500">Status</span>

              <span className="font-semibold text-yellow-600">
                {order.status}
              </span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-sm text-slate-500">Total</span>

              <span className="font-bold text-blue-600">
                ${order.total.toString()}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-3 text-left">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b border-slate-100 pb-3"
              >
                <div>
                  <p className="font-medium">{item.product.name}</p>

                  <p className="text-sm text-slate-500">
                    {item.quantity} × ${item.price.toString()}
                  </p>
                </div>

                <p className="font-semibold">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/products"
            className="mt-8 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
