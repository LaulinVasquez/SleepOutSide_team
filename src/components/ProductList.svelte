<script lang="ts">
  import { onMount } from "svelte";
  import { getProducts } from "../js/productData.mts";
  import type { Product } from "../js/types.mts";
  import { getParam } from "../js/utils.mts";
  import ProductSummary from "./ProductSummary.svelte";

  // state declared out here so the template below can use it
  let category = $state("");
  let products: Product[] = $state([]);
  let loading = $state(true);
  let error = $state("");
  let sortBy = $state("default");

  function sortedProducts() {
    const sorted = [...products];

    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "price-asc":
        return sorted.sort((a, b) => a.finalPrice - b.finalPrice);
      case "price-desc":
        return sorted.sort((a, b) => b.finalPrice - a.finalPrice);
      default:
        return sorted;
    }
  }

  async function init() {
    category = getParam("category") || "";
    try {
      products = await getProducts(category);
    } catch (e) {
      console.error("Unable to load products", e);
      error = "Products could not be loaded.";
    } finally {
      loading = false;
    }
  }

  onMount(init);
</script>

<section class="products">
  <div class="products__header">
    <h2>Top products: {category || "all"}</h2>
    <label for="product-sort">
      Sort by:
      <select id="product-sort" bind:value={sortBy}>
        <option value="default">Featured</option>
        <option value="name">Name A–Z</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </label>
  </div>
  <ul class="product-list">
    {#if loading}
      <li>Loading products...</li>
    {:else if error}
      <li>{error}</li>
    {:else}
      {#each sortedProducts() as product (product.id)}
        <ProductSummary {product} />
      {/each}
    {/if}
  </ul>
</section>
