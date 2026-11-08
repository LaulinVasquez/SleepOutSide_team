import { apiUrl } from "./api-url";

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
}

interface UserStore {
  isLoggedIn: boolean;
  user?: AuthUser;
  token: string;
}

const TOKEN_KEY = "so-token";
const USER_KEY = "so-user";

export const userStore: UserStore = $state({
  isLoggedIn: false,
  user: undefined,
  token: "",
});

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Record<string, unknown>;
  return (
    typeof user._id === "string" &&
    typeof user.email === "string" &&
    typeof user.name === "string"
  );
}

function resetUserStore() {
  userStore.isLoggedIn = false;
  userStore.user = undefined;
  userStore.token = "";
}

export async function login(email: string, password: string): Promise<void> {
  const response = await fetch(apiUrl("users/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data && typeof data.message === "string"
        ? data.message
        : "Login failed";
    throw new Error(message);
  }

  if (
    !data ||
    typeof data !== "object" ||
    !("token" in data) ||
    typeof data.token !== "string" ||
    !("user" in data) ||
    !isAuthUser(data.user)
  ) {
    throw new Error("The login response was invalid");
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  userStore.isLoggedIn = true;
  userStore.user = data.user;
  userStore.token = data.token;
}

export function logout(): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  } finally {
    resetUserStore();
  }
}

export function checkAuth(): void {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem(TOKEN_KEY);
  const serializedUser = localStorage.getItem(USER_KEY);
  if (!token || !serializedUser) {
    logout();
    return;
  }

  let user: unknown;
  try {
    user = JSON.parse(serializedUser);
  } catch (error) {
    console.error("Unable to restore the saved user", error);
    logout();
    return;
  }

  if (!isAuthUser(user)) {
    logout();
    return;
  }

  userStore.isLoggedIn = true;
  userStore.user = user;
  userStore.token = token;
}
