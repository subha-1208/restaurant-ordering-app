 "use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus } from "@/types";

const statuses: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Preparing",
  "Completed",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(
    null
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/orders");

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data: Order[] = await response.json();

      setOrders(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const data = await response.json();

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? data.order : order
        )
      );
    } catch (error) {
      console.error(error);
      setError("Unable to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50 px-6 py-12">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg text-gray-600">Loading orders...</p>
        </div>
      </main>
    );
  }

  if (error && orders.length === 0) {
    return (
      <main className="min-h-screen bg-orange-50 px-6 py-12">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-red-600">{error}</p>

          <button
            onClick={fetchOrders}
            className="mt-4 rounded-lg bg-orange-600 px-5 py-2 font-semibold text-white hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            Admin Panel
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Order Management
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage customer orders.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Status Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {["All", ...statuses].map((status) => (
            <button
              key={status}
              onClick={() =>
                setFilter(status as "All" | OrderStatus)
              }
              className={`rounded-full px-5 py-2 font-medium transition ${
                filter === status
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-700 hover:bg-orange-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              No Orders Found
            </h2>

            <p className="mt-2 text-gray-600">
              There are no orders matching the selected filter.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-white p-6 shadow"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {order.id}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                    {order.status}
                  </span>
                </div>

                {/* Customer Details */}
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Customer
                    </p>

                    <p className="font-semibold text-gray-900">
                      {order.customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Mobile
                    </p>

                    <p className="font-semibold text-gray-900">
                      {order.mobile}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Email
                    </p>

                    <p className="break-words font-semibold text-gray-900">
                      {order.email}
                    </p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Delivery Address
                  </p>

                  <p className="font-medium text-gray-900">
                    {order.address}
                  </p>
                </div>

                {/* Ordered Items */}
                <div className="mt-6">
                  <h3 className="font-bold text-gray-900">
                    Ordered Items
                  </h3>

                  <div className="mt-3 space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between gap-4 rounded-lg bg-gray-50 px-4 py-3"
                      >
                        <span className="text-gray-700">
                          {item.name} × {item.quantity}
                        </span>

                        <span className="whitespace-nowrap font-semibold text-gray-900">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="mt-6 border-t pt-5">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>

                    <span>
                      ₹{order.subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-gray-600">
                    <span>Tax</span>

                    <span>
                      ₹{order.tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>

                    <span className="text-orange-600">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Update Status */}
                <div className="mt-6">
                  <label className="mb-2 block font-medium text-gray-700">
                    Update Order Status
                  </label>

                  <select
                    value={order.status}
                    disabled={updatingOrderId === order.id}
                    onChange={(e) =>
                      updateOrderStatus(
                        order.id,
                        e.target.value as OrderStatus
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:bg-gray-100 md:w-64"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {updatingOrderId === order.id && (
                    <p className="mt-2 text-sm text-orange-600">
                      Updating status...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}