 import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Spice & Slice",
  description: "Restaurant online ordering application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}