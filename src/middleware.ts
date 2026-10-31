import { defineMiddleware } from 'astro:middleware';
import { errorMessages, isErrorStatus } from './js/errors';

export const onRequest = defineMiddleware(async (context, next) => {
  // Error pages must remain renderable even if another route fails.
  const path = context.url.pathname.replace(/\/$/, '');
  if (['/401', '/404', '/500'].includes(path)) return next();
  const isApi = path === '/api' || path.startsWith('/api/');
  const handleError = (status: 401 | 404 | 500) => {
    if (isApi) return new Response(JSON.stringify({ error: {
      statusCode: status, message: errorMessages[status], redirectTo: `/${status}`,
      flash: { type: 'error', message: errorMessages[status] },
    } }), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
    return new Response(null, { status: 303, headers: {
      Location: `/${status}?flash=${status}`, 'Cache-Control': 'no-store',
    } });
  };
  try {
    const response = await next();
    if (!context.isPrerendered && isErrorStatus(response.status)) return handleError(response.status);
    return response;
  } catch (error) {
    // Build failures should fail the build, not bake redirects into static pages.
    if (context.isPrerendered) throw error;
    return handleError(500);
  }
});
