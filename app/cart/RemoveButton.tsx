"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RemoveButtonProps = {
  cartItemId: string;
};

export default function RemoveButton({ cartItemId }: RemoveButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function removeItem() {
    try {
      setLoading(true);

      const response = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove item");
      }

      router.refresh();
    } catch (error) {
      console.error("REMOVE ITEM ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={removeItem}
      disabled={loading}
      className="text-sm font-medium text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Removing..." : "Remove"}
    </button>
  );
}
