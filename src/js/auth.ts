import { writable } from "svelte/store";

const TOKEN_KEY = "so-token";
const USER_KEY = "so-user";

export interface User {
  _id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

// localStorage doesn't exist when Astro renders on the server
const isBrowser = typeof window !== "undefined";

function loadState(): AuthState {
  if (!isBrowser) return { token: null, user: null };
  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);
  return { token, user: user ? JSON.parse(user) : null };
}

export const auth = writable<AuthState>(loadState());

export async function login(email: string, password: string): Promise<void> {
  const res = await fetch(`${import.meta.env.PUBLIC_SERVER_URL}users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  auth.set({ token: data.token, user: data.user });
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  auth.set({ token: null, user: null });
}
