<script lang="ts">
  import { login } from "../js/auth.svelte";
  import { resolvePostLoginRedirect } from "../js/auth-utils";
  import { getParam } from "../js/utils.mts";

  let email = $state("");
  let password = $state("");
  let errorMessage = $state("");
  let isSubmitting = $state(false);

  async function loginHandler(event: SubmitEvent) {
    event.preventDefault();
    errorMessage = "";
    isSubmitting = true;

    try {
      await login(email, password);
      const redirectPath = resolvePostLoginRedirect(
        getParam("redirect"),
        document.referrer,
        window.location.href,
      );
      window.location.assign(redirectPath);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Login failed";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<h2>Login</h2>
{#if errorMessage}
  <p class="error" role="alert">{errorMessage}</p>
{/if}
<form onsubmit={loginHandler} class="login-form">
  <label>
    Email:
    <input type="email" bind:value={email} required />
  </label>
  <label>
    Password:
    <input type="password" bind:value={password} required />
  </label>
  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? "Logging in..." : "Login"}
  </button>
</form>

<style>
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 300px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  label {
    display: flex;
    flex-direction: column;
    font-weight: bold;
  }
  input {
    margin-top: 0.5rem;
    padding: 0.5rem;
    font-size: 1rem;
  }
  button {
    padding: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
  }
  .error {
    color: red;
    margin-bottom: 1rem;
    text-align: center;
  }
</style>