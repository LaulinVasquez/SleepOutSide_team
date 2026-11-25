<script lang="ts">
  import { onMount } from 'svelte';
  import { checkAuth, userStore } from '../js/auth.svelte';
  import { getLocalStorage, setLocalStorage } from '../js/utils.mts';
  import { findProductById } from '../js/productData.mts';
  import { accountRequest } from '../js/account-api';
  import { checkoutTotals, summarizeCart } from '../js/checkout.mts';
  import type { Product } from '../js/types.mts';
  let ready = $state(false), busy = $state(false), loaded = $state(false);
  let items: Product[] = $state([]);
  let name = $state(''), street = $state(''), city = $state(''), state = $state(''), zipCode = $state('');
  let cardNumber = $state(''), cardExpiration = $state(''), cardCode = $state('');
  let message = $state(''), orderId = $state('');
  let snapshot = '';
  const states = 'AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' ');
  const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  let totals = $derived(checkoutTotals(items));
  async function loadCart() {
    loaded = false; message = '';
    try {
      const stored = getLocalStorage<Product[]>('so-cart') ?? [];
      if (!Array.isArray(stored) || stored.some(item => !item || typeof item.id !== 'string')) throw new Error('Your cart could not be read. Please return to the cart.');
      if (stored.length > 100) throw new Error('Please limit each order to 100 items.');
      snapshot = JSON.stringify(stored);
      const products = await Promise.all([...new Set(stored.map(item => item.id))].map(findProductById));
      const refreshed = stored.map(item => ({ ...products.find(product => product.id === item.id)!, selectedColor: item.selectedColor }));
      checkoutTotals(refreshed);
      items = refreshed; loaded = true;
    } catch (error) { message = error instanceof Error ? error.message : 'Unable to load your cart. Please try again.'; }
  }
  onMount(async () => {
    checkAuth(); ready = true;
    if (userStore.isLoggedIn) { name = userStore.user?.name || ''; await loadCart(); }
  });
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (busy || !loaded || !items.length) return;
    if (snapshot !== JSON.stringify(getLocalStorage<Product[]>('so-cart') ?? [])) { await loadCart(); message = 'Your cart changed. Review the updated order before submitting.'; return; }
    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(cardExpiration);
    if (!match || Date.UTC(2000 + Number(match[2]), Number(match[1]), 1) <= Date.now()) { message = 'Enter a future expiration date in MM/YY format.'; return; }
    busy = true; message = '';
    try {
      const result = await accountRequest('orders/', { userId: userStore.user?._id, name: name.trim(),
        shippingAddress: { street: street.trim(), city: city.trim(), state, zipCode, country: 'US' },
        orderItems: summarizeCart(items), taxAmount: totals.taxAmount, shippingCost: totals.shippingCost, totalPrice: totals.totalPrice,
        cardNumber, cardExpiration, cardCode });
      orderId = result.order.id;
      cardNumber = cardExpiration = cardCode = '';
      if (snapshot === JSON.stringify(getLocalStorage<Product[]>('so-cart') ?? [])) setLocalStorage('so-cart', []);
    } catch (error) { message = error instanceof Error ? error.message : 'Order could not be placed. Your cart has been kept.'; }
    finally { busy = false; }
  }
</script>
{#if !ready}<p>Loading checkout…</p>
{:else if !userStore.isLoggedIn}<p>Please <a href="/login/?next=/checkout/">sign in to checkout</a>. Your cart will be kept.</p>
{:else if orderId}<section role="status"><h2>Thank you for your order!</h2><p>Order reference: {orderId}</p><a href="/">Continue shopping</a></section>
{:else}
  <p role="alert">{message}</p>
  {#if !loaded}
    <p>Loading current product prices…</p>
    {#if message}<button onclick={loadCart}>Retry loading cart</button>{/if}
  {:else if !items.length}<p>Your cart is empty. <a href="/product-list/">Browse products</a>.</p>
  {:else}
    <div class="checkout-grid">
      <form onsubmit={submit}>
        <fieldset disabled={busy}><legend>Shipping address</legend>
          <label>Full name <input bind:value={name} autocomplete="name" required minlength="2" maxlength="100" /></label>
          <label>Street address <input bind:value={street} autocomplete="street-address" required minlength="10" maxlength="100" /></label>
          <label>City <input bind:value={city} autocomplete="address-level2" required minlength="5" maxlength="50" /></label>
          <label>State <select bind:value={state} autocomplete="address-level1" required><option value="">Choose a state</option>{#each states as code}<option value={code}>{code}</option>{/each}</select></label>
          <label>ZIP code <input bind:value={zipCode} autocomplete="postal-code" required pattern="[0-9]{5}(-[0-9]{4})?" /></label>
          <p>Country: United States</p>
        </fieldset>
        <fieldset disabled={busy}><legend>Test payment</legend>
          <p>Simulated checkout: use 4242424242424242, a future MM/YY expiration, and any three-digit security code.</p>
          <label>Card number <input bind:value={cardNumber} inputmode="numeric" autocomplete="off" required pattern="4242424242424242" /></label>
          <label>Expiration (MM/YY) <input bind:value={cardExpiration} placeholder="MM/YY" autocomplete="off" required pattern="(0[1-9]|1[0-2])/[0-9]{2}" /></label>
          <label>Security code <input type="password" bind:value={cardCode} inputmode="numeric" autocomplete="off" required pattern="[0-9]{3}" maxlength="3" /></label>
        </fieldset>
        <button disabled={busy}>{busy ? 'Placing order…' : `Place order · ${money(totals.totalPrice)}`}</button>
      </form>
      <aside aria-labelledby="order-summary"><h2 id="order-summary">Order summary</h2>
        <ul>{#each items as item}<li>{item.name}{item.selectedColor ? ` — ${item.selectedColor.colorName}` : ''} · 1 × {money(item.finalPrice)}</li>{/each}</ul>
        <dl><dt>Subtotal ({items.length} items)</dt><dd>{money(totals.subtotal)}</dd><dt>Sales tax (6%)</dt><dd>{money(totals.taxAmount)}</dd><dt>Shipping</dt><dd>{money(totals.shippingCost)}</dd><dt>Total</dt><dd><strong>{money(totals.totalPrice)}</strong></dd></dl>
        <button type="button" disabled={busy} onclick={loadCart}>Refresh prices</button>
        <p><a href="/cart/">Edit cart</a> · <a href="/login/?next=/checkout/">Sign in again</a></p>
      </aside>
    </div>
  {/if}
{/if}
<style>
  .checkout-grid { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 2rem; align-items: start; }
  form, fieldset, label { display: grid; gap: .7rem; min-width: 0; }
  fieldset { margin: 0 0 1rem; padding: 1rem; border: 1px solid #bbb; }
  input, select { padding: .7rem; width: 100%; box-sizing: border-box; font: inherit; }
  aside { padding: 1rem; background: #f3f3f3; }
  ul { padding-left: 1.2rem; } li { margin-bottom: .8rem; }
  dl { display: grid; grid-template-columns: 1fr auto; gap: .7rem; } dd { margin: 0; }
  @media (max-width: 700px) { .checkout-grid { grid-template-columns: 1fr; } aside { grid-row: 1; } }
</style>
