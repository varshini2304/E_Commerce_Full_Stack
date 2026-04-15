import { ProductData } from "../../types/home";

export interface WishListItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  currency: string;
  quantity: number;
}

const WISH_LIST_STORAGE_KEY = "app_wish_list_items";
export const WISH_LIST_UPDATED_EVENT = "app:wish-list-updated";

const isBrowser = () => typeof window !== "undefined";

const notifyWishListUpdated = () => {
  if (!isBrowser()) {
    return;
  }
  window.dispatchEvent(new Event(WISH_LIST_UPDATED_EVENT));
};

const readWishList = (): WishListItem[] => {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(WISH_LIST_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as WishListItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeWishList = (items: WishListItem[]) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(WISH_LIST_STORAGE_KEY, JSON.stringify(items));
  notifyWishListUpdated();
};

export const getWishListItems = (): WishListItem[] => readWishList();

export const getWishListCount = (): number =>
  readWishList().reduce((count, item) => count + item.quantity, 0);

export const addProductToWishList = (product: ProductData, quantity = 1): WishListItem[] => {
  const items = readWishList();
  const existingItem = items.find((item) => item.id === product.id);

  if (existingItem) {
    const updatedItems = items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
    );
    writeWishList(updatedItems);
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
  writeWishList(updatedItems);
  return updatedItems;
};

export const updateWishListItemQuantity = (productId: string, quantity: number): WishListItem[] => {
  const safeQuantity = Math.max(1, quantity);
  const updatedItems = readWishList().map((item) =>
    item.id === productId ? { ...item, quantity: safeQuantity } : item,
  );
  writeWishList(updatedItems);
  return updatedItems;
};

export const removeWishListItem = (productId: string): WishListItem[] => {
  const updatedItems = readWishList().filter((item) => item.id !== productId);
  writeWishList(updatedItems);
  return updatedItems;
};

export const clearCart = () => {
  writeWishList([]);
};
