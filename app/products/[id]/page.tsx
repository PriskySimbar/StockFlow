import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "../AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/products" className="text-xl font-bold text-blue-600">
            StockFlow
          </Link>

          <Link
            href="/cart"
            className="rounded-lg px-4 py-2 text-xl transition hover:bg-slate-100"
          >
            🛒
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <Link
          href="/products"
          className="text-sm text-slate-500 transition hover:text-blue-600"
        >
          ← Back to Products
        </Link>
      </div>

      {/* Product */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid overflow-hidden rounded-xl bg-white shadow-sm md:grid-cols-2">
          {/* Image */}
          <div className="flex aspect-square items-center justify-center bg-slate-100 md:aspect-auto">
            <span className="text-9xl">📦</span>
          </div>

          {/* Information */}
          <div className="p-6 sm:p-10">
            {/* Category */}
            <p className="text-sm font-medium text-blue-600">
              {product.category.name}
            </p>

            {/* Name */}
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-black">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-lg font-semibold text-yellow-500">
                ★ 4.8
              </span>

              <span className="text-sm text-slate-400">124 reviews</span>

              <span className="text-slate-300">|</span>

              <span className="text-sm text-slate-500">230 sold</span>
            </div>

            {/* Price */}
            <div className="mt-6 rounded-lg bg-blue-50 px-5 py-4">
              <p className="text-3xl font-bold text-blue-600">
                ${product.price.toString()}
              </p>
            </div>

            {/* Description */}
            <div className="mt-7">
              <h2 className="font-semibold text-black">Description</h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            {/* Stock */}
            <div className="mt-7 border-t border-slate-100 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Stock</span>

                <span
                  className={`text-sm font-semibold ${
                    product.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} available`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 flex gap-3">
              <AddToCartButton
                productId={product.id}
                disabled={product.stock === 0}
              />

              <button
                disabled={product.stock === 0}
                className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
