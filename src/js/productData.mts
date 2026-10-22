import type { Product } from "./types.mts";

const baseURL = import.meta.env.PUBLIC_SERVER_URL ||
  (import.meta.env.DEV ? "http://localhost:3000/api/v1/" : "");

function productUrl(path: string) {
  if (!baseURL) throw new Error("PUBLIC_SERVER_URL is not configured");
  return `${baseURL.replace(/\/+$/, "")}/${path}`;
}

async function convertToJson(response: Response) {
  if (response.ok) {
    return response.json();
  }

  const details = await response.text();
  throw new Error(
    `Request failed (${response.status} ${response.statusText}): ${details}`
  );
}

export async function getData(): Promise<Product[]> {
  const response = await fetch(productUrl("products"), { signal: AbortSignal.timeout(15000) });
  const data: unknown = await convertToJson(response);
  const results = Array.isArray(data) ? data : (data as { results?: unknown })?.results;

  if (!Array.isArray(results)) {
    throw new Error("Products API returned an invalid response");
  }

  return results as Product[];
}

export async function findProductById(id: string): Promise<Product> {
  const response = await fetch(productUrl(`products/${encodeURIComponent(id)}`), { signal: AbortSignal.timeout(15000) });
  return convertToJson(response);
}
