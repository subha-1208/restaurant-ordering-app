 "use client";

import { useState } from "react";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    console.log("BUTTON CLICKED");
    addToCart(item);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl">
      <img
        src={item.image}
        alt={item.name}
        className="h-52 w-full object-cover"
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-gray-900">
            {item.name}
          </h3>

          <span className="font-bold text-orange-600">
            ₹{item.price}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          {item.description}
        </p>

        <button
          onClick={handleAddToCart}
          className="mt-4 w-full rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700"
        >
          {added ? "✓ Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}