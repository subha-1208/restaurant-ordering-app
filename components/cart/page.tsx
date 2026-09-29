"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    tax,
    total,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-orange-50 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-10 text-center shadow">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-600">
            Add some delicious food to your cart.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
          >
            Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-orange-600 hover:text-orange-700"
          >
            ← Back to Menu
          </Link>

          <h1 className="mt-3 text-4xl font-bold text-gray-900">
            Your Cart
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow sm:flex-row sm:items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-full rounded-xl object-cover sm:w-28"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {item.name}
                  </h2>

                  <p className="mt-1 text-gray-600">
                    ₹{item.price}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 text-sm font-medium text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="h-9 w-9 rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
                  >
                    −
                  </button>

                  <span className="w-6 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="h-9 w-9 rounded-full bg-orange-600 text-lg font-bold text-white hover:bg-orange-700"
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div className="font-bold text-orange-600">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block rounded-lg bg-orange-600 px-6 py-3 text-center font-semibold text-white hover:bg-orange-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}