import { defineCollection } from "astro:content";

// load our product info from the API instead of a local json file
const products = defineCollection({
  loader: async () => {
    const baseURL = import.meta.env.PUBLIC_SERVER_URL || "http://localhost:3000/api/v1/";
    const response = await fetch(baseURL.replace(/\/+$/, "") + "/products?limit=200");
    const data = await response.json();
    // Must return an array of entries with an id property, or an object with IDs as keys and entries as values
    return data.results;
  },
});

export const collections = { products };
