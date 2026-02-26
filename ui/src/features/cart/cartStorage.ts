import { ProductData } from "../../types/home";

export interface CartItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  currency: string;
  quantity: number;
}

const CART_STORAGE_KEY = "app_cart_items";
export const CART_UPDATED_EVENT = "app:cart-updated";

const isBrowser = () => typeof window !== "undefined";

const notifyCartUpdated = () => {
  if (!isBrowser()) {
    return;
  }
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

const readCart = (): CartItem[] => {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCart = (items: CartItem[]) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  notifyCartUpdated();
};

export const getCartItems = (): CartItem[] => readCart();

export const getCartCount = (): number =>
  readCart().reduce((count, item) => count + item.quantity, 0);

export const addProductToCart = (product: ProductData, quantity = 1): CartItem[] => {
  const items = readCart();
  const existingItem = items.find((item) => item.id === product.id);

  if (existingItem) {
    const updatedItems = items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
    );
    writeCart(updatedItems);
    return updatedItems;
  }

  const updatedItems = [
    ...items,
    {
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      currency: product.currency ?? "USD",
      quantity,
    },
  ];
  writeCart(updatedItems);
  return updatedItems;
};

export const updateCartItemQuantity = (productId: string, quantity: number): CartItem[] => {
  const safeQuantity = Math.max(1, quantity);
  const updatedItems = readCart().map((item) =>
    item.id === productId ? { ...item, quantity: safeQuantity } : item,
  );
  writeCart(updatedItems);
  return updatedItems;
};

export const removeCartItem = (productId: string): CartItem[] => {
  const updatedItems = readCart().filter((item) => item.id !== productId);
  writeCart(updatedItems);
  return updatedItems;
};

export const clearCart = () => {
  writeCart([]);
};
