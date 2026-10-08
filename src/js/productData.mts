import type {Product} from "./types.mts"

const baseURL = import.meta.env.PUBLIC_SERVER_URL;

async function convertToJson(res: Response) {
  if (res.ok) {
    return res.json();
  }

  let details = "";
  try {
    details = await res.text();
  } catch {
    details = "The server did not provide an error response.";
  }

  throw new Error(`Request failed (${res.status} ${res.statusText}): ${details}`);
}

// export function getData(category = "tents") {
//   return fetch(`../json/${category}.json`)
//     .then(convertToJson)
//     .then((data) => data);
// }

export async function getData(): Promise<Product[]> {
  const response = await fetch("/api/products");
  return convertToJson(response)
}

export async function findProductById(id:string) {
  const response = await fetch(baseURL + `products/${id}`);
  const product = await convertToJson(response) as Product;
  console.log(product)
  return product;
}
