 "use client";

import Link from "next/link";
import MenuGrid from "@/components/menu/MenuGrid";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { cartCount } = useCart();

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-orange-600"
          >
            Spice & Slice
          </Link>

          <Link
            href="/cart"
            className="rounded-lg bg-orange-600 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-700"
          >
            🛒 Cart ({cartCount})
          </Link>
        </div>
      </header>

      {/* Restaurant Hero */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-600">
            Welcome to
          </p>

          <h1 className="text-5xl font-bold text-gray-900">
            Spice & Slice
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Delicious food, freshly prepared and delivered to your doorstep.
          </p>
        </div>

        {/* Menu */}
        <div className="mt-12">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Our Menu
          </h2>

          <MenuGrid />
        </div>
      </section>
    </main>
  );
}