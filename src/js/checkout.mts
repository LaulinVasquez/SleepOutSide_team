import type { Product } from './types.mts';
export function checkoutTotals(items: Pick<Product, 'finalPrice'>[]) {
  const subtotal = items.reduce((sum, item) => {
    if (!Number.isFinite(item.finalPrice) || item.finalPrice < 0) throw new Error('A product price is unavailable.');
    return sum + Math.round(item.finalPrice * 100);
  }, 0);
  const tax = Math.round(subtotal * .06);
  const shipping = items.length ? 1000 + 200 * (items.length - 1) : 0;
  return { subtotal: subtotal / 100, taxAmount: tax / 100, shippingCost: shipping / 100, totalPrice: (subtotal + tax + shipping) / 100 };
}
export function summarizeCart(items: Product[]) {
  return items.map(item => ({ productId: item.id, productName: item.name, price: item.listPrice,
    finalPrice: Math.round(item.finalPrice * 100) / 100, productImageSrc: item.images.primaryLarge,
    productUrl: item.url, productCategory: item.category,
    ...(item.selectedColor ? { productColor: { colorCode: item.selectedColor.colorCode } } : {}) }));
}
