"use client";

import { useState } from "react";

export default function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAddToCart() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add to cart");
      }

      setMessage("Added!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled || loading}
        onClick={handleAddToCart}
        className="mt-3 w-full rounded-lg border border-blue-500 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
      >
        {loading ? "Adding..." : disabled ? "Out of Stock" : "Add to Cart"}
      </button>

      {message && (
        <p className="mt-2 text-center text-xs text-green-600">{message}</p>
      )}
    </div>
  );
}
