<script lang="ts">
  let name = $state('');
  let email = $state('');
  let busy = $state(false);
  let message = $state('');
  const endpoint = import.meta.env.PUBLIC_NEWSLETTER_URL;
  async function subscribe(event: SubmitEvent) {
    event.preventDefault();
    if (busy) return;
    if (!endpoint) { message = 'Newsletter signup is not available yet. Please try again later.'; return; }
    busy = true;
    message = '';
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), email: email.trim() }), signal: AbortSignal.timeout(15000) });
      if (response.status === 409) { message = 'This email is already subscribed.'; return; }
      if (!response.ok) throw new Error('Signup could not be completed. Please try again later.');
      message = 'Thank you for subscribing!'; name = ''; email = '';
    } catch { message = 'Signup could not be completed. Please try again later.'; }
    finally { busy = false; }
  }
</script>
<section aria-labelledby="newsletter-title">
  <h2 id="newsletter-title">News from outside</h2>
  <p>Sign up for our newsletter.</p>
  <form onsubmit={subscribe}>
    <label>Name <input autocomplete="name" bind:value={name} required maxlength="100" pattern=".*\S.*" /></label>
    <label>Email <input type="email" autocomplete="email" bind:value={email} required maxlength="254" /></label>
    <button disabled={busy}>{busy ? 'Signing up…' : 'Subscribe'}</button>
  </form>
  <p role="status">{message}</p>
</section>
<style>
  section { margin: 2rem auto; padding: 1.5rem; background: #f3f3f3; }
  form { display: flex; flex-wrap: wrap; align-items: end; gap: 1rem; }
  label { display: grid; gap: .4rem; }
  input { padding: .6rem; max-width: 100%; }
</style>
