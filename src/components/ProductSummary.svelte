<script lang="ts">
  import type { Product } from "../js/types.mts";

  let { product }: { product: Product } = $props();
</script>

<li class="product-card">
  <a href="/products/{product.id}">
    <img src={product.images.primaryLarge} alt={product.name} />
    <h3 class="card__brand">{product.brand.name}</h3>
    <h2 class="card__name">{product.nameWithoutBrand}</h2>
    <p class="product-card__price">${product.finalPrice}</p>
  </a>
</li>
