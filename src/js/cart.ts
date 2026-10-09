import { getLocalStorage } from "./utils.mts";
import type {Product} from "./types.mts"

function renderCartContents() {
  const cartItems: Product[] = getLocalStorage("so-cart");
  const listEl = document.querySelector(".product-list");

  if (!cartItems.length) {
    if (listEl) listEl.innerHTML = `<li class="cart-empty">Your cart is empty.</li>`;
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  if (listEl) listEl.innerHTML = htmlItems.join("");
}

function cartItemTemplate(item:Product) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.image}"
      alt="${item.name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.name}</h2>
  </a>
  <p class="cart-card__color">${item.colors[0].colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.finalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
