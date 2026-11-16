import { findProductById } from "./productData.mts";
import { addToWishlist, isInWishlist, removeFromWishlist } from "./wishlist.ts";

const button = document.querySelector<HTMLButtonElement>("#addToWishlist");
const message = document.querySelector<HTMLElement>("#wishlist-message");
const productId = document.querySelector<HTMLElement>("#product-page")?.dataset.productId;

let saved = false;

function render() {
  if (!button) return;
  button.textContent = saved ? "♥ Remove from Wish List" : "♡ Add to Wish List";
  button.setAttribute("aria-pressed", String(saved));
}

function showMessage(text: string) {
  if (message) message.textContent = text;
}

async function init() {
  if (!button || !productId) return;
  try {
    saved = await isInWishlist(productId);
    render();
    button.hidden = false;
  } catch (error) {
    console.error("Unable to load wish list", error);
  }
}

button?.addEventListener("click", async () => {
  if (!productId || button.disabled) return;
  button.disabled = true;
  try {
    if (saved) {
      await removeFromWishlist(productId);
      saved = false;
      showMessage("Removed from your wish list.");
    } else {
      const product = await findProductById(productId);
      await addToWishlist(product);
      saved = true;
      showMessage("Saved to your wish list.");
    }
    render();
  } catch (error) {
    console.error("Wish list update failed", error);
    showMessage("Your wish list could not be updated. Please try again.");
  } finally {
    button.disabled = false;
  }
});

init();