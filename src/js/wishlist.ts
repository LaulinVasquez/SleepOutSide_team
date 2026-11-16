import type { Product } from "./types.mts";
import { getLocalStorage, setLocalStorage } from "./utils.mts";

// Signed in  -> the wish list is saved on the server (user specific)
// Signed out -> the wish list is saved in this browser (localStorage)

const LOCAL_KEY = "so-wishlist";

const baseURL =
  import.meta.env.PUBLIC_SERVER_URL ||
  (import.meta.env.DEV ? "http://localhost:3000/api/v1/" : "");

function apiUrl(path: string) {
  return `${baseURL.replace(/\/+$/, "")}/${path}`;
}

// The login token saved by auth.svelte.ts under "so-user"
function getToken(): string | null {
  const stored = getLocalStorage<{ token?: string }>("so-user");
  return typeof stored?.token === "string" && stored.token ? stored.token : null;
}

export function isSignedIn() {
  return getToken() !== null;
}

async function serverRequest(path: string, init: RequestInit = {}): Promise<Product[]> {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${getToken()}`,
    },
  });

  // Expired or invalid token: clear it and send the user to sign in again
  if (response.status === 401) {
    setLocalStorage("so-user", null);
    window.location.href = "/login/";
    throw new Error("Please sign in again.");
  }
  if (!response.ok) {
    throw new Error(`Wish list request failed (${response.status})`);
  }

  const data = (await response.json()) as { results?: Product[] };
  return data.results ?? [];
}

function readLocal(): Product[] {
  const list = getLocalStorage<Product[]>(LOCAL_KEY);
  return Array.isArray(list) ? list : [];
}

export async function getWishlist(): Promise<Product[]> {
  return isSignedIn() ? serverRequest("users/wishlist") : readLocal();
}

export async function isInWishlist(productId: string): Promise<boolean> {
  const list = await getWishlist();
  return list.some((item) => item.id === productId);
}

export async function addToWishlist(product: Product): Promise<void> {
  if (isSignedIn()) {
    await serverRequest("users/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    });
    return;
  }
  const list = readLocal();
  if (!list.some((item) => item.id === product.id)) {
    list.push(product);
    setLocalStorage(LOCAL_KEY, list);
  }
}

export async function removeFromWishlist(productId: string): Promise<void> {
  if (isSignedIn()) {
    await serverRequest(`users/wishlist/${encodeURIComponent(productId)}`, { method: "DELETE" });
    return;
  }
  setLocalStorage(
    LOCAL_KEY,
    readLocal().filter((item) => item.id !== productId),
  );
}

// Same format product.ts uses, so the cart page shows it correctly
export function addToCart(product: Product) {
  const cart = getLocalStorage<Product[]>("so-cart") ?? [];
  cart.push({ ...product, selectedColor: product.selectedColor ?? product.colors[0] });
  setLocalStorage("so-cart", cart);
  window.dispatchEvent(new CustomEvent("cart:add", { detail: product }));
}