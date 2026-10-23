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
  <h2>Top products: {category || "all"}</h2>
  <ul class="product-list">
    {#if loading}
      <li>Loading products...</li>
    {:else if error}
      <li>{error}</li>
    {:else}
      {#each products as product (product.id)}
        <ProductSummary {product} />
      {/each}
    {/if}
  </ul>
</section>
