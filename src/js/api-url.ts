const baseURL =
  import.meta.env.PUBLIC_SERVER_URL ||
  (import.meta.env.DEV ? "http://localhost:3000/api/v1/" : "");

export function apiUrl(path: string): string {
  if (!baseURL) throw new Error("PUBLIC_SERVER_URL is not configured");
  return `${baseURL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
