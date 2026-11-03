// Cloudflare Pages Function for every path that isn't a static file (see
// public/_routes.json). Renders index.html with the route's uptime filled in
// and returns 404 for paths that aren't an uptime.
import { renderPage } from "../public/uptime.js";

export async function onRequest({ request, env }) {
  const template = await env.ASSETS.fetch(new URL("/", request.url));
  const { status, html } = renderPage(
    await template.text(),
    new URL(request.url).pathname,
  );

  // _headers only applies to static files, so set nosniff here too
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
