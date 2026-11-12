import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { apiFetch, ApiError, redirectForError } from '../src/js/errors.ts';
const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; delete globalThis.window; });
for (const status of [401, 404, 500]) {
  test(`API ${status} redirects to a fixed local page`, async () => {
    let destination;
    globalThis.window = { location: { pathname: '/products/1', replace: value => destination = value } };
    globalThis.fetch = async () => new Response('not JSON', { status });
    await assert.rejects(apiFetch('/api/products'), error => error instanceof ApiError && error.status === status);
    assert.equal(destination, `/${status}?flash=${status}`);
  });
}
test('network failures use the 500 flow', async () => {
  let destination;
  globalThis.window = { location: { pathname: '/', replace: value => destination = value } };
  globalThis.fetch = async () => { throw new TypeError('fetch failed'); };
  await assert.rejects(apiFetch('/api/products'), { status: 500 });
  assert.equal(destination, '/500?flash=500');
});
test('error pages do not redirect to themselves', () => {
  globalThis.window = { location: { pathname: '/404/', replace: () => assert.fail('redirect loop') } };
  redirectForError(404);
});
test('successful responses pass through unchanged', async () => {
  const response = new Response('{"ok":true}');
  globalThis.fetch = async () => response;
  assert.equal(await apiFetch('/api/products'), response);
});
