import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Stockflow
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/products"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Products
            </Link>

            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl text-white">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
              Stockflow Marketplace
            </p>

            <h1 className="mt-4 text-5xl font-bold leading-tight">
              Find what you need.
              <br />
              Buy it with ease.
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              Discover quality products at great prices.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-2xl font-bold">Shop by Category</h2>

        <p className="mt-2 text-sm text-slate-500">
          Explore products based on what you're looking for.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CategoryCard name="Shoes" emoji="👟" />
          <CategoryCard name="Fashion" emoji="👕" />
          <CategoryCard name="Electronics" emoji="💻" />
          <CategoryCard name="Accessories" emoji="🎒" />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold">Ready to start shopping?</h2>

          <p className="mt-2 text-sm text-slate-500">
            Browse our available products.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Stockflow
        </div>
      </footer>
    </main>
  );
}

function CategoryCard({ name, emoji }: { name: string; emoji: string }) {
  return (
    <Link
      href={`/products?category=${name.toLowerCase()}`}
      className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
    >
      <div className="text-4xl">{emoji}</div>

      <h3 className="mt-4 font-semibold">{name}</h3>

      <p className="mt-1 text-sm text-slate-500">
        Explore {name.toLowerCase()}
      </p>
    </Link>
  );
}
