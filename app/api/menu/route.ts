import { NextResponse } from "next/server";
import menuData from "@/data/menu.json";

export async function GET() {
  try {
    return NextResponse.json(menuData);
  } catch (error) {
    console.error("Menu API error:", error);

    return NextResponse.json(
      { message: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}