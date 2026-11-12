import { findProductById } from "./productData.mts";
import type { Color, Product } from "./types.mts";

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
  const galleryElement = document.querySelector<HTMLElement>("#product-gallery");
  const priceElement = document.querySelector<HTMLElement>("#product-price");
  const colorElement = document.querySelector<HTMLElement>("#product-color");
  const descriptionElement = document.querySelector<HTMLElement>("#product-description");
  const errorElement = document.querySelector<HTMLElement>("#product-error");

  const addButton = document.querySelector<HTMLButtonElement>("#addToCart");
  if (addButton) { addButton.hidden = true; addButton.disabled = true; }

  try {
    const product = await findProductById(id);

    if (nameElement) nameElement.textContent = product.name;

    if (imageElement && galleryElement) {
      renderProductGallery(product.images, product.name);
      galleryElement.hidden = false;
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
    if (galleryElement) galleryElement.hidden = true;
    if (nameElement) nameElement.textContent = "Product unavailable";
    if (errorElement) {
      errorElement.textContent =
        "This product could not be loaded from the server.";
    }
  }
}

function renderProductGallery(
  images: Product["images"],
  productName: string,
) {
  const imageElement = document.querySelector<HTMLImageElement>("#product-image");
  const indicatorsElement = document.querySelector<HTMLElement>(
    "#product-gallery-indicators",
  );
  const statusElement = document.querySelector<HTMLElement>(
    "#product-gallery-status",
  );
  const previousButton = document.querySelector<HTMLButtonElement>(
    "#product-gallery-previous",
  );
  const nextButton = document.querySelector<HTMLButtonElement>(
    "#product-gallery-next",
  );

  if (!imageElement || !indicatorsElement || !statusElement) return;

  const productImages = [
    { src: images.primaryLarge, title: productName },
    ...images.extraImages.map((image) => ({
      src: image.src,
      title: image.title || productName,
    })),
  ];
  let currentIndex = 0;

  indicatorsElement.replaceChildren();

  const updateGallery = (index: number) => {
    currentIndex = (index + productImages.length) % productImages.length;
    const currentImage = productImages[currentIndex];

    imageElement.src = currentImage.src;
    imageElement.alt = `${productName}: ${currentImage.title}`;
    statusElement.textContent = `${currentIndex + 1} of ${productImages.length}`;

    indicatorsElement.querySelectorAll("button").forEach((indicator, indicatorIndex) => {
      const isSelected = indicatorIndex === currentIndex;
      indicator.setAttribute("aria-selected", String(isSelected));
      indicator.classList.toggle("is-active", isSelected);
    });

    const hasMultipleImages = productImages.length > 1;
    if (previousButton) previousButton.hidden = !hasMultipleImages;
    if (nextButton) nextButton.hidden = !hasMultipleImages;
  };

  productImages.forEach((image, index) => {
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.className = "product-gallery__indicator";
    indicator.setAttribute("role", "tab");
    indicator.setAttribute("aria-label", `Show product image ${index + 1}`);
    indicator.addEventListener("click", () => updateGallery(index));
    indicatorsElement.append(indicator);
  });

  previousButton?.addEventListener("click", () => updateGallery(currentIndex - 1));
  nextButton?.addEventListener("click", () => updateGallery(currentIndex + 1));
  updateGallery(0);
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