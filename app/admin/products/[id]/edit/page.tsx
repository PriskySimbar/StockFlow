import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

async function updateProduct(formData: FormData) {
  "use server";

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const price = formData.get("price")?.toString();
  const stock = formData.get("stock")?.toString();
  const categoryId = formData.get("categoryId")?.toString();

  if (!id || !name || !description || !price || !stock || !categoryId) {
    throw new Error("All fields are required");
  }

  await prisma.product.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      categoryId,
    },
  });

  redirect("/admin/products");
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div>
            <Link href="/products" className="text-xl font-bold text-blue-600">
              Stockflow
            </Link>

            <p className="mt-1 text-sm text-slate-500">Admin Dashboard</p>
          </div>

          <Link
            href="/admin/products"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            ← Back to Products
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>

          <p className="mt-1 text-sm text-slate-500">
            Update product information.
          </p>

          <form action={updateProduct} className="mt-8 space-y-5">
            <input type="hidden" name="id" value={product.id} />

            <div>
              <label className="text-sm font-medium text-slate-700">
                Product Name
              </label>

              <input
                name="name"
                type="text"
                required
                defaultValue={product.name}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                required
                rows={4}
                defaultValue={product.description}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Price
                </label>

                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  defaultValue={product.price.toString()}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Stock
                </label>

                <input
                  name="stock"
                  type="number"
                  min="0"
                  required
                  defaultValue={product.stock}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Category
              </label>

              <select
                name="categoryId"
                required
                defaultValue={product.categoryId}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link
                href="/admin/products"
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
