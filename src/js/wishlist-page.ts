import type { Product } from "./types.mts";
import { addToCart, getWishlist, isSignedIn, removeFromWishlist } from "./wishlist.ts";

const listElement = document.querySelector<HTMLUListElement>("#wishlist-list");
const noteElement = document.querySelector<HTMLElement>("#wishlist-note");

function itemTemplate(item: Product) {
  return `<li class="cart-card divider">
  <a href="/products/${item.id}" class="cart-card__image">
    <img src="${item.images.primaryLarge}" alt="${item.name}" />
  </a>
  <a href="/products/${item.id}">
    <h2 class="card__name">${item.name}</h2>
  </a>
  <button class="cart-card__remove" type="button" data-action="remove" data-id="${item.id}" aria-label="Remove ${item.name} from wish list">X</button>
  <p class="cart-card__color">${item.colors[0]?.colorName ?? ""}</p>
  <p class="cart-card__price">$${item.finalPrice}</p>
  <button class="wishlist-card__move" type="button" data-action="move" data-id="${item.id}">Move to Cart</button>
</li>`;
}

async function render() {
  if (!listElement) return;

  if (noteElement) {
    noteElement.textContent = isSignedIn()
      ? "Your wish list is saved to your account."
      : "Sign in to save your wish list to your account. Right now it is saved in this browser only.";
  }

  try {
    const items = await getWishlist();
    listElement.innerHTML = items.length
      ? items.map(itemTemplate).join("")
      : `<li class="cart-empty">Your wish list is empty.</li>`;
  } catch (error) {
    console.error("Unable to load wish list", error);
    listElement.innerHTML = `<li class="cart-empty">Your wish list could not be loaded.</li>`;
  }
}

listElement?.addEventListener("click", async (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>("button[data-action]");
  const id = button?.dataset.id;
  if (!button || !id) return;

  button.disabled = true;
  try {
    if (button.dataset.action === "move") {
      const items = await getWishlist();
      const product = items.find((item) => item.id === id);
      if (product) addToCart(product);
    }
    await removeFromWishlist(id);
    await render();
  } catch (error) {
    console.error("Wish list update failed", error);
    button.disabled = false;
  }
});

render();