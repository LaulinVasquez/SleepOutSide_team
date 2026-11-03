import { findProductById } from "./productData.mts";
import type { Color } from "./types.mts";

const page = document.querySelector<HTMLElement>("#product-page");

if (page) {
  const productId = page.dataset.productId;

  if (productId) {
    loadProduct(productId);
  }
}

async function loadProduct(id: string) {
  const nameElement = document.querySelector<HTMLElement>("#product-name");
  const imageElement = document.querySelector<HTMLImageElement>("#product-image");
  const priceElement = document.querySelector<HTMLElement>("#product-price");
  const colorElement = document.querySelector<HTMLElement>("#product-color");
  const descriptionElement = document.querySelector<HTMLElement>("#product-description");
  const errorElement = document.querySelector<HTMLElement>("#product-error");

  const addButton = document.querySelector<HTMLButtonElement>("#addToCart");
  if (addButton) { addButton.hidden = true; addButton.disabled = true; }

  try {
    const product = await findProductById(id);

    if (nameElement) nameElement.textContent = product.name;

    if (imageElement) {
      imageElement.src = product.images.primaryLarge;
      imageElement.alt = product.name;
      imageElement.hidden = false;
    }

    if (priceElement) priceElement.textContent = `$${product.finalPrice}`;

    if (product.colors.length > 1) {
      if (colorElement) colorElement.hidden = true;
      renderColorSwatches(product.colors, addButton);
    } else {
      if (colorElement) colorElement.textContent = product.colors[0]?.colorName ?? "";
      if (addButton) addButton.dataset.color = product.colors[0]?.colorCode ?? "";
    }

    if (descriptionElement) {
      descriptionElement.innerHTML = product.descriptionHtmlSimple;
    }
    if (addButton) { addButton.hidden = false; addButton.disabled = false; }
  } catch (error) {
    console.error("Unable to load product", error);

    if (addButton) { addButton.hidden = true; addButton.disabled = true; }
    if (imageElement) imageElement.hidden = true;
    if (nameElement) nameElement.textContent = "Product unavailable";
    if (errorElement) {
      errorElement.textContent =
        "This product could not be loaded from the server.";
    }
  }
}

// Show one clickable swatch per color and remember which one the customer picked
function renderColorSwatches(colors: Color[], addButton: HTMLButtonElement | null) {
  const fieldset = document.querySelector<HTMLFieldSetElement>("#product-colors");
  const swatchContainer = document.querySelector<HTMLElement>("#color-swatches");
  const selectedName = document.querySelector<HTMLElement>("#selected-color-name");
  if (!fieldset || !swatchContainer) return;

  swatchContainer.replaceChildren();

  colors.forEach((color, index) => {
    const label = document.createElement("label");
    label.className = "color-swatch";
    label.title = color.colorName;

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "product-color";
    input.value = color.colorCode;
    input.checked = index === 0;

    const image = document.createElement("img");
    image.src = color.colorChipImageSrc;
    image.alt = color.colorName;

    input.addEventListener("change", () => selectColor(color));

    label.append(input, image);
    swatchContainer.append(label);
  });

  function selectColor(color: Color) {
    if (selectedName) selectedName.textContent = color.colorName;
    if (addButton) addButton.dataset.color = color.colorCode;
  }

  selectColor(colors[0]);
  fieldset.hidden = false;
}