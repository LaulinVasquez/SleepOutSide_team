import { apiFetch } from "./errors";
import { apiUrl } from "./api-url";
import type { Product } from "./types.mts";

export async function getProducts(category = ""): Promise<Product[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const response = await apiFetch(apiUrl(`products${query}`), { signal: AbortSignal.timeout(15000) });
  const data: unknown = await response.json();
  const results = Array.isArray(data) ? data : (data as { results?: unknown })?.results;

  if (!Array.isArray(results)) {
    throw new Error("Products API returned an invalid response");
  }

  return results as Product[];
}

export async function findProductById(id: string): Promise<Product> {
  const response = await apiFetch(apiUrl(`products/${encodeURIComponent(id)}`), { signal: AbortSignal.timeout(15000) });
  return response.json();
}
