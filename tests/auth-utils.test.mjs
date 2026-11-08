import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolvePostLoginRedirect } from '../src/js/auth-utils.ts';

test('uses a same-origin redirect path after login', () => {
  assert.equal(
    resolvePostLoginRedirect('/profile/?tab=details', '', 'https://shop.example/login/'),
    '/profile/?tab=details',
  );
});

test('uses a same-origin referrer when no redirect is provided', () => {
  assert.equal(
    resolvePostLoginRedirect(null, 'https://shop.example/products/tent', 'https://shop.example/login/'),
    '/products/tent',
  );
});

test('rejects external redirects and login-page loops', () => {
  assert.equal(
    resolvePostLoginRedirect('https://attacker.example/', '', 'https://shop.example/login/'),
    '/',
  );
  assert.equal(
    resolvePostLoginRedirect('/login/?redirect=/profile/', '', 'https://shop.example/login/'),
    '/',
  );
});

test('falls back home when no different referrer exists', () => {
  assert.equal(
    resolvePostLoginRedirect(null, 'https://shop.example/login/', 'https://shop.example/login/'),
    '/',
  );
});
