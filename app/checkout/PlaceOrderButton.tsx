"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlaceOrderButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePlaceOrder() {
    try {
      setLoading(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      router.push(`/orders/${data.orderId}`);
    } catch (error) {
      console.error("PLACE ORDER ERROR:", error);

      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePlaceOrder}
      disabled={loading}
      className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {loading ? "Processing..." : "Place Order"}
    </button>
  );
}
