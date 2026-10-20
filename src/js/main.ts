import { getData } from "./productData.mts";

const productList = document.querySelector<HTMLUListElement>("#product-list");

if (productList) {
  loadProducts(productList);
}

async function loadProducts(list: HTMLUListElement) {
  try {
    const products = await getData();

    // Feature Selected Cards:
    // const featuredIds = ["985RF", "985PR", "880RR", "344YJ"];
    // const featuredProducts = products.filter((product) =>
    //   featuredIds.includes(product.id)
    // );
    //
    // list.innerHTML = featuredProducts
    //   .map(
    //     (product) => `
    //       <li class="product-card">
    //         <a href="/products/${product.id}">
    //           <img
    //             src="${product.images.primaryLarge}"
    //             alt="${product.name}"
    //           />
    //           <h3 class="card__brand">${product.brand.name}</h3>
    //           <h2 class="card__name">${product.nameWithoutBrand}</h2>
    //           <p class="product-card__price">$${product.finalPrice}</p>
    //         </a>
    //       </li>
    //     `
    //   )
    //   .join("");

    list.innerHTML = products
      .slice(0, 9)
      .map(
        (product) => `
          <li class="product-card">
            <a href="/products/${product.id}">
              <img
                src="${product.images.primaryLarge}"
                alt="${product.name}"
              />
              <h3 class="card__brand">${product.brand.name}</h3>
              <h2 class="card__name">${product.nameWithoutBrand}</h2>
              <p class="product-card__price">$${product.finalPrice}</p>
            </a>
          </li>
        `
      )
      .join("");
  } catch (error) {
    console.error("Unable to load products", error);
    list.innerHTML = "<li>Products could not be loaded.</li>";
  }
}
