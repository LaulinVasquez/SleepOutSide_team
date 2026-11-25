<script lang="ts">
  import { onMount } from 'svelte';
  import { checkAuth, userStore } from '../js/auth.svelte';
  import { accountRequest } from '../js/account-api';
  let ready = $state(false), busy = $state(false);
  let currentPassword = $state(''), newPassword = $state(''), confirm = $state(''), message = $state('');
  onMount(() => { checkAuth(); ready = true; });
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (busy) return;
    if (newPassword !== confirm) { message = 'New passwords must match.'; return; }
    busy = true; message = '';
    try { await accountRequest('users/password', { currentPassword, newPassword }); message = 'Password changed successfully.'; currentPassword = newPassword = confirm = ''; }
    catch (error) { message = error instanceof Error ? error.message : 'Unable to change password.'; }
    finally { busy = false; }
  }
</script>
{#if ready && userStore.isLoggedIn}
  <form onsubmit={submit}>
    <label>Current password <input type="password" autocomplete="current-password" bind:value={currentPassword} required maxlength="100" /></label>
    <label>New password <input type="password" autocomplete="new-password" bind:value={newPassword} required minlength="6" maxlength="100" /></label>
    <label>Confirm new password <input type="password" autocomplete="new-password" bind:value={confirm} required /></label>
    <button disabled={busy}>{busy ? 'Saving…' : 'Change password'}</button>
  </form>
{:else if ready}<p>Please <a href="/login/?next=/account/password/">sign in</a> to change your password.</p>{/if}
<p role="status">{message}</p>
<style>form { display: grid; gap: 1rem; max-width: 30rem; } label { display: grid; gap: .5rem; } input { padding: .6rem; }</style>
