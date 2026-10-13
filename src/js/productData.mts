import type { Product } from "./types.mts";

const baseURL = import.meta.env.PUBLIC_SERVER_URL;

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
  const response = await fetch(`${baseURL}products`);
  return convertToJson(response);
}

export async function findProductById(id: string): Promise<Product> {
  const response = await fetch(`${baseURL}products/${id}`);
  return convertToJson(response);
}