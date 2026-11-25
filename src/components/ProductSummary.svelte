<script lang="ts">
  import type { Product } from "../js/types.mts";

  let dialog: HTMLDialogElement;

  let { product }: { product: Product } = $props();
</script>

<li class="product-card">
  <a href="/products/{product.id}">
    <img src={product.images.primaryLarge} alt={product.name} />
    <h3 class="card__brand">{product.brand.name}</h3>
    <h2 class="card__name">{product.nameWithoutBrand}</h2>
    <p class="product-card__price">${product.finalPrice}</p>
  </a>
  <button type="button" onclick={() => dialog.showModal()} aria-label={`Quick view ${product.name}`}>Quick view</button>
  <dialog bind:this={dialog} aria-labelledby={`quick-title-${product.id}`}>
    <form method="dialog"><button aria-label="Close quick view">Close</button></form>
    <img src={product.images.primaryLarge} alt={product.name} />
    <h2 id={`quick-title-${product.id}`}>{product.name}</h2>
    <p>{product.brand.name}</p>
    <p>${product.finalPrice.toFixed(2)}</p>
    <p>{product.descriptionHtmlSimple.replace(/<[^>]*>/g, " ")}</p>
    <p>Colors: {product.colors.map(color => color.colorName).join(", ")}</p>
    <a href={`/products/${product.id}`}>View full details</a>
  </dialog>
</li>

<style>
  dialog { width: min(90vw, 36rem); max-height: 85vh; overflow: auto; border: 1px solid #777; border-radius: 8px; padding: 1.5rem; text-align: left; }
  dialog::backdrop { background: rgb(0 0 0 / 55%); }
  dialog img { display: block; max-width: 100%; max-height: 35vh; margin: auto; object-fit: contain; }
  form { text-align: right; }
</style>
