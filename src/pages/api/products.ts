import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = false;

export const GET: APIRoute = async () => {
  const products = await getCollection("products");

  return new Response(
    JSON.stringify(
      products.map((product) => ({
        ...product.data,
        id: product.id,
      }))
    ),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};