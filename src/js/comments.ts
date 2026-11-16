import { getLocalStorage, setLocalStorage } from "./utils.mts";

// One comment on a product
export interface ProductComment {
  author: string;
  text: string;
  createdAt: string; // ISO date string
}

// Comments are read from and saved to the server:
//   GET  {PUBLIC_SERVER_URL}products/:id/comments  -> ProductComment[] or { results: ProductComment[] }
//   POST {PUBLIC_SERVER_URL}products/:id/comments  body { author, text }
// Until the "Product Comments: backend" card adds those routes (the server answers 404),
// comments are kept in this browser so the page still works.

const LOCAL_KEY = "so-comments";

const baseURL =
  import.meta.env.PUBLIC_SERVER_URL ||
  (import.meta.env.DEV ? "http://localhost:3000/api/v1/" : "");

function commentsUrl(productId: string) {
  return `${baseURL.replace(/\/+$/, "")}/products/${encodeURIComponent(productId)}/comments`;
}

function getToken(): string | null {
  const stored = getLocalStorage<{ token?: string }>("so-user");
  return typeof stored?.token === "string" && stored.token ? stored.token : null;
}

export function getSignedInName(): string {
  const stored = getLocalStorage<{ user?: { name?: string } }>("so-user");
  return stored?.user?.name ?? "";
}

// ---- browser fallback ----
function readLocal(productId: string): ProductComment[] {
  const all = getLocalStorage<Record<string, ProductComment[]>>(LOCAL_KEY) ?? {};
  return Array.isArray(all[productId]) ? all[productId] : [];
}

function saveLocal(productId: string, comment: ProductComment) {
  const all = getLocalStorage<Record<string, ProductComment[]>>(LOCAL_KEY) ?? {};
  all[productId] = [...(Array.isArray(all[productId]) ? all[productId] : []), comment];
  setLocalStorage(LOCAL_KEY, all);
}

// true = the server has comment routes, false = use the browser fallback
let serverAvailable: boolean | null = null;

function newestFirst(list: ProductComment[]) {
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getComments(productId: string): Promise<ProductComment[]> {
  if (serverAvailable !== false) {
    try {
      const response = await fetch(commentsUrl(productId));
      if (response.status === 404) {
        serverAvailable = false;
      } else if (response.ok) {
        serverAvailable = true;
        const data = (await response.json()) as ProductComment[] | { results?: ProductComment[] };
        const list = Array.isArray(data) ? data : (data.results ?? []);
        return newestFirst(list);
      } else {
        throw new Error(`Comments request failed (${response.status})`);
      }
    } catch (error) {
      if (serverAvailable === true) throw error;
      serverAvailable = false;
    }
  }
  return newestFirst(readLocal(productId));
}

export async function addComment(productId: string, author: string, text: string): Promise<void> {
  const comment: ProductComment = {
    author: author.trim(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  if (serverAvailable) {
    const token = getToken();
    const response = await fetch(commentsUrl(productId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ author: comment.author, text: comment.text }),
    });
    if (!response.ok) {
      throw new Error(`Could not save comment (${response.status})`);
    }
    return;
  }

  saveLocal(productId, comment);
}