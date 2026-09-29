 "use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { CartItem, MenuItem } from "@/types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem("cart");
      }
    }

    setIsLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems, isLoaded]);

  const addToCart = (item: MenuItem) => {
    console.log("ADDING ITEM:", item);

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((items) =>
      items.filter((item) => item.id !== id)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.05;

  const total = subtotal + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}