import { userStore } from './auth.svelte';
export async function accountRequest(path: string, body: unknown) {
  const base = import.meta.env.PUBLIC_SERVER_URL || (import.meta.env.DEV ? 'http://localhost:3000/api/v1/' : '');
  if (!base) throw new Error('The service is not configured. Please try again later.');
  const response = await fetch(`${base.replace(/\/+$/, '')}/${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userStore.token}` },
    body: JSON.stringify(body), signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || data.message || 'Request failed. Please try again.');
  return data;
}
