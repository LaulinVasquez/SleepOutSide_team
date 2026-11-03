import type {Product} from "./types.mts"
import { getLocalStorage, setLocalStorage } from "./utils.mts";
import { findProductById } from "./productData.mts";


function addProductToCart(product: Product) {
  const cart = getLocalStorage("so-cart") || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
  // let the header (cart icon) know an item was added, so it can animate
  window.dispatchEvent(new CustomEvent("cart:add", { detail: product }));
}
// add to cart button event handler
async function addToCartHandler(e:Event) {
  const target = e.currentTarget as HTMLButtonElement;
  if (!target.dataset.id || target.disabled || target.hidden) return;
  target.disabled = true;
  try {
    const product = await findProductById(target.dataset.id);
    const selectedColor =
      product.colors.find((color) => color.colorCode === target.dataset.color) ??
      product.colors[0];
    addProductToCart({ ...product, selectedColor });
    target.disabled = false;
  } catch {
    target.hidden = true;
    const errorElement = document.getElementById("product-error");
    if (errorElement) errorElement.textContent = "This product could not be added to your cart. Please try again later.";
  }
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  ?.addEventListener("click", addToCartHandler);
