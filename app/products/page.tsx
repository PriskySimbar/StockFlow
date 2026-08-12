import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}) {
  const params = await searchParams;

  const search = params.search?.trim();
  const selectedCategory = params.category?.trim().toLowerCase();

  const products = await prisma.product.findMany({
    where: {
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),

      ...(selectedCategory
        ? {
            category: {
              name: {
                equals: selectedCategory,
                mode: "insensitive",
              },
            },
          }
        : {}),
    },

    include: {
      category: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
          {/* Logo */}
          <Link
            href="/products"
            className="shrink-0 text-xl font-bold text-blue-600"
          >
            Stockflow
          </Link>

          {/* Search */}
          <div className="flex flex-1">
            <form
              action="/products"
              method="GET"
              className="flex w-full overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-blue-500"
            >
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search products..."
                className="min-w-0 flex-1 px-4 py-2.5 text-sm outline-none"
              />

              <button
                type="submit"
                className="bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700"
              >
                Search
              </button>
            </form>
          </div>

          {/* Cart */}
          <div className="flex items-center gap-2">
            <Link
              href="/orders"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-blue-600"
            >
              My Orders
            </Link>

            <Link
              href="/cart"
              className="rounded-lg p-2 text-xl hover:bg-slate-100"
            >
              🛒
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="border-t border-slate-100">
          <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-6 py-3 text-sm">
            {/* All */}
            <Link
              href="/products"
              className={`shrink-0 ${
                !selectedCategory
                  ? "font-semibold text-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              All
            </Link>

            {/* Categories */}
            {categories.map((category) => {
              const categorySlug = category.name.toLowerCase();

              const isActive = selectedCategory === categorySlug;

              return (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(
                    categorySlug,
                  )}`}
                  className={`shrink-0 ${
                    isActive
                      ? "font-semibold text-blue-600"
                      : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero */}
        <div className="rounded-2xl bg-blue-600 p-8 text-white">
          <p className="text-sm font-medium text-blue-100">
            STOCKFLOW MARKETPLACE
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Everything you need,
            <br />
            in one place.
          </h1>

          <p className="mt-3 max-w-lg text-sm text-blue-100">
            Discover products from different categories and find the items you
            need.
          </p>
        </div>

        {/* Products Header */}
        <div className="mt-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">Products</h2>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? `Search results for "${search}"`
                : selectedCategory
                  ? `Products in ${selectedCategory}`
                  : "Browse our available products."}
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {products.length} products
          </span>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">📦</div>

            <h3 className="mt-4 font-semibold">No products found</h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another category or search for another product.
            </p>

            <Link
              href="/products"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              View all products
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Product image */}
                <Link href={`/products/${product.id}`}>
                  <div className="flex aspect-square items-center justify-center bg-slate-100">
                    <span className="text-6xl transition group-hover:scale-110">
                      📦
                    </span>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-slate-800 hover:text-blue-600">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-lg font-bold text-blue-600">
                      ${product.price.toString()}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {product.category.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {product.stock > 0
                        ? `${product.stock} available`
                        : "Out of stock"}
                    </p>
                  </Link>

                  {/* Add To Cart */}
                  <div className="mt-3">
                    <AddToCartButton
                      productId={product.id}
                      disabled={product.stock === 0}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
