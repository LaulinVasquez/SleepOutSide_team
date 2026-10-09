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
  const target = e.target as HTMLButtonElement
  if(target.dataset.id) {
    const product = await findProductById(target.dataset.id);
    addProductToCart(product);
  }
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  ?.addEventListener("click", addToCartHandler);
