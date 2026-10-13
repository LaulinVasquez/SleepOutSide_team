import { findProductById } from "./productData.mts";

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

  try {
    const product = await findProductById(id);

    if (nameElement) nameElement.textContent = product.name;

    if (imageElement) {
      imageElement.src = product.images.primaryLarge;
      imageElement.alt = product.name;
    }

    if (priceElement) priceElement.textContent = `$${product.finalPrice}`;

    if (colorElement) {
      colorElement.textContent = product.colors[0]?.colorName ?? "";
    }

    if (descriptionElement) {
      descriptionElement.innerHTML = product.descriptionHtmlSimple;
    }
  } catch (error) {
    console.error("Unable to load product", error);

    if (nameElement) nameElement.textContent = "Product not found";
    if (errorElement) {
      errorElement.textContent =
        "This product could not be loaded from the server.";
    }
  }
}
