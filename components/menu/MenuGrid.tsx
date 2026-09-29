 "use client";

import { useEffect, useState } from "react";
import { MenuItem } from "@/types";
import MenuCard from "./MenuCard";

export default function MenuGrid() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch("/api/menu");

        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        const data: MenuItem[] = await response.json();

        setMenuItems(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load menu. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg text-gray-600">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {/* Categories */}
      <div className="mb-8 flex flex-wrap gap-3">
        {["All", "Pizza", "Burgers", "Beverages", "Desserts"].map(
          (itemCategory) => (
            <button
              key={itemCategory}
              onClick={() => setCategory(itemCategory)}
              className={`rounded-full px-5 py-2 font-medium transition ${
                category === itemCategory
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-700 hover:bg-orange-100"
              }`}
            >
              {itemCategory}
            </button>
          )
        )}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 ? (
        <div className="rounded-xl bg-white py-12 text-center shadow-sm">
          <p className="text-lg text-gray-600">
            No food items found.
          </p>
        </div>
      ) : (
        /* Menu Cards */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}