import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkoutTotals, summarizeCart } from '../src/js/checkout.mts';
test('empty, single and repeated units use cents, merchandise tax and per-unit shipping', () => {
  assert.deepEqual(checkoutTotals([]), { subtotal: 0, taxAmount: 0, shippingCost: 0, totalPrice: 0 });
  assert.deepEqual(checkoutTotals([{ finalPrice: 19.99 }]), { subtotal: 19.99, taxAmount: 1.2, shippingCost: 10, totalPrice: 31.19 });
  assert.deepEqual(checkoutTotals([{ finalPrice: 19.99 }, { finalPrice: 19.99 }]), { subtotal: 39.98, taxAmount: 2.4, shippingCost: 12, totalPrice: 54.38 });
  assert.throws(() => checkoutTotals([{ finalPrice: NaN }]));
});
test('summary preserves units and selected color in the API format', () => {
  const product = { id: 'tent', name: 'Tent', listPrice: 20, finalPrice: 19.99, images: { primaryLarge: '/tent.png' }, url: '/tent', category: 'tents', selectedColor: { colorCode: 'blue' } };
  const result = summarizeCart([product, product]);
  assert.equal(result.length, 2); assert.equal(result[0].productId, 'tent'); assert.deepEqual(result[0].productColor, { colorCode: 'blue' }); assert.equal(result[0].finalPrice, 19.99);
});
