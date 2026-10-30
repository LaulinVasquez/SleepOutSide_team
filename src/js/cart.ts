import { getLocalStorage, setLocalStorage } from "./utils.mts";
import type {Product} from "./types.mts"

function renderCartContents() {
  const cartItems: Product[] = getLocalStorage("so-cart");
  const listEl = document.querySelector(".product-list");
  const footerEl = document.querySelector(".cart-footer");
  const totalEl = document.querySelector(".cart-total");

  if (!cartItems.length) {
    if (listEl) listEl.innerHTML = `<li class="cart-empty">Your cart is empty.</li>`;
    footerEl?.classList.add("hide");
    return;
  }

  const htmlItems = cartItems.map((item, index) => cartItemTemplate(item, index));
  if (listEl) listEl.innerHTML = htmlItems.join("");
  addRemoveListeners();

  const total = cartItems.reduce((sum, item) => sum + (item.finalPrice ?? 0), 0);
  if (totalEl) totalEl.textContent = `Total: $${total.toFixed(2)}`;
  footerEl?.classList.remove("hide");
}

function removeFromCart(index: number) {
  const cartItems: Product[] = getLocalStorage("so-cart");
  cartItems.splice(index, 1);

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll<HTMLButtonElement>(".cart-card__remove");

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      if (Number.isInteger(index)) removeFromCart(index);
    });
  });
}

function cartItemTemplate(item: Product, index: number) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.images.primaryLarge}"
      alt="${item.name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.name}</h2>
  </a>
  <button class="cart-card__remove" type="button" data-id="${item.id}" data-index="${index}" aria-label="Remove ${item.name} from cart">X</button>
  <p class="cart-card__color">${item.colors[0].colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.finalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
