<script lang="ts">
  import { onMount } from "svelte";
  import { apiUrl } from "../js/api-url";
  import { checkAuth, logout, userStore } from "../js/auth.svelte";

  let profileMessage = $state("");
  let errorMessage = $state("");
  let isLoading = $state(true);

  function redirectToLogin() {
    const query = new URLSearchParams({ redirect: window.location.pathname });
    window.location.replace(`/login/?${query.toString()}`);
  }

  async function getProfile() {
    if (!userStore.isLoggedIn || !userStore.token) {
      redirectToLogin();
      return;
    }

    try {
      const response = await fetch(apiUrl("users/protected"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        logout();
        redirectToLogin();
        return;
      }

      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("message" in data) || typeof data.message !== "string") {
        throw new Error("The profile response was invalid");
      }
      profileMessage = data.message;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Unable to load your profile";
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    checkAuth();
    void getProfile();
  });
</script>

<h1>Profile</h1>
{#if isLoading}
  <p>Loading profile...</p>
{:else if errorMessage}
  <p role="alert">{errorMessage}</p>
{:else if profileMessage}
  <p>{profileMessage}</p>
{/if}
