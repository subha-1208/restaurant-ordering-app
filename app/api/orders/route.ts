 import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Order, OrderStatus } from "@/types";

const ordersFilePath = path.join(
  process.cwd(),
  "data",
  "orders.json"
);

async function readOrders(): Promise<Order[]> {
  try {
    const file = await fs.readFile(ordersFilePath, "utf-8");

    return JSON.parse(file) as Order[];
  } catch (error) {
    console.error("Failed to read orders:", error);

    return [];
  }
}

async function writeOrders(orders: Order[]) {
  await fs.writeFile(
    ordersFilePath,
    JSON.stringify(orders, null, 2),
    "utf-8"
  );
}

export async function GET() {
  try {
    const orders = await readOrders();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Order GET error:", error);

    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const orders = await readOrders();

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: body.name,
      mobile: body.mobile,
      email: body.email,
      address: body.address,
      items: body.items,
      status: "Pending",
      subtotal: body.subtotal,
      tax: body.tax,
      total: body.total,
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    await writeOrders(orders);

    return NextResponse.json(
      {
        message: "Order placed successfully",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order POST error:", error);

    return NextResponse.json(
      {
        message: "Failed to place order",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { id, status } = body as {
      id: string;
      status: OrderStatus;
    };

    const orders = await readOrders();

    const orderIndex = orders.findIndex(
      (order) => order.id === id
    );

    if (orderIndex === -1) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    orders[orderIndex].status = status;

    await writeOrders(orders);

    return NextResponse.json({
      message: "Order status updated successfully",
      order: orders[orderIndex],
    });
  } catch (error) {
    console.error("Order PATCH error:", error);

    return NextResponse.json(
      {
        message: "Failed to update order status",
      },
      { status: 500 }
    );
  }
}