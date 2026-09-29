 "use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cartItems, subtotal, tax, total, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !formData.name ||
      !formData.mobile ||
      !formData.email ||
      !formData.address
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items: cartItems,
          subtotal,
          tax,
          total,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error(error);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-orange-50 px-6 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-10 text-center shadow">
          <div className="text-5xl">🎉</div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Order Placed Successfully!
          </h1>

          <p className="mt-3 text-gray-600">
            Thank you for ordering from Spice & Slice.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
          >
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-orange-50 px-6 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-10 text-center shadow">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-600">
            Please add items before checking out.
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
        <Link
          href="/cart"
          className="text-orange-600 hover:text-orange-700"
        >
          ← Back to Cart
        </Link>

        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          Checkout
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Details
            </h2>

            {error && (
              <div className="mt-5 rounded-lg bg-red-50 p-3 text-red-600">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-5">
              {/* Full Name */}
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          {/* Order Summary */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>

                  <span className="font-medium text-gray-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-5" />

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span className="text-orange-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}