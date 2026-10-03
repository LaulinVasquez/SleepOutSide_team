import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = () => {
    return new Response(JSON.stringify({ status: "ok"}), {
        headers: {"Content-Type": "application/json"},
    });
};