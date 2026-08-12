"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QuantityControlProps = {
  cartItemId: string;
  quantity: number;
};

export default function QuantityControl({
  cartItemId,
  quantity,
}: QuantityControlProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateQuantity(newQuantity: number) {
    if (newQuantity < 1) return;

    try {
      setLoading(true);

      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update quantity");
      }

      router.refresh();
    } catch (error) {
      console.error("UPDATE QUANTITY ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-slate-300">
      <button
        type="button"
        disabled={loading || quantity <= 1}
        onClick={() => updateQuantity(quantity - 1)}
        className="flex h-9 w-9 items-center justify-center text-lg font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        −
      </button>

      <span className="flex h-9 min-w-10 items-center justify-center border-x border-slate-300 text-sm font-semibold">
        {loading ? "..." : quantity}
      </span>

      <button
        type="button"
        disabled={loading}
        onClick={() => updateQuantity(quantity + 1)}
        className="flex h-9 w-9 items-center justify-center text-lg font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
