# Sleep Outside

## Netlify deployment

Deploy this project through Netlify's Git integration with `npm run build` and
`dist` as the publish directory (configured in `netlify.toml`). If the connected
repository contains multiple projects, set the base directory to `SleepOutSide_team`.

The Netlify adapter packages dynamic routes such as `/products/:id` as serverless
functions. Uploading only the static build files will not deploy these routes.

Set `PUBLIC_SERVER_URL` in Netlify's build environment to the deployed product API
base URL, including `/api/v1/`. The browser uses it to load product names, prices,
and descriptions. Redeploy after changing this value.

After deployment, click a product card and refresh its `/products/:id` URL. Both
requests should load the product detail page. `/api/health` should return
`{"status":"ok"}`.

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

### Route error handling

Browser requests should use `apiFetch` from `src/js/errors.ts`. Responses with
401, 404, or 500 redirect to the matching error page; network failures use 500.
The shared layout displays a dismissible flash message and removes its marker
from the URL so refreshing does not repeat it. Redirect destinations and messages
are fixed locally. The 401 page is used until a login UI is implemented.

Astro middleware handles runtime route errors and preserves JSON status codes
for `/api/*`. The custom 404 page also handles static-host fallback navigation.
Error pages do not fetch products, so an API outage cannot create a redirect loop.
Run client error tests with `node --experimental-strip-types --test tests/errors.test.mjs`.

### Announcements

Edit `public/json/alerts.json` to show announcements above the main content on
home and product listing pages. Each entry has `message`, `background`, and
`color` fields (CSS color values). Use `[]` to remove all announcements. Messages
are rendered as plain text. Missing or invalid JSON does not interrupt the page.

Announcements use the storefront typography and orange accent border, while JSON
colors remain customizable. After five seconds they fade out over 400ms and are
removed; reduced-motion users get immediate removal after five seconds.

### Backlog2 newsletter dependency

The local API has no newsletter route. Set `PUBLIC_NEWSLETTER_URL` to the newsletter service when available; the form posts JSON `{ name, email }`, accepts any 2xx response, and handles 409 as an existing subscription. Without that setting it reports unavailability and does not claim a subscription was saved. Confirm this contract with the backend card owner before enabling.

### Backlog2 local verification

Use Node 22.12+ and the sibling `sleepoutsideServer` API. Start the API with `npm run dev` in that repository using its existing MongoDB and JWT configuration. Set this frontend's `PUBLIC_SERVER_URL=http://localhost:3000/api/v1/` (include the API prefix). Run `npx astro dev --background`; use `npx astro dev status`, `logs`, and `stop` to manage it.

- Visit `/product-list/`, open Quick view for different products, and close with the Close button or Escape. The native modal manages focus and keyboard containment.
- The home page newsletter collects name/email. Its backend dependency is described above; subscriptions cannot be saved until it is configured.
- Sign in and visit `/account/password/` from the user menu. Supply the current password, a new 6–100 character password and matching confirmation. Verify login with the new password afterward.
- Add products (including repeated units), visit `/cart/`, and proceed to `/checkout/`. A signed-out visitor sees a sign-in link that returns to checkout. The form loads current prices; shipping is $10 for the first unit plus $2 each additional unit, with 6% tax on merchandise only. Totals round to cents. Shipping is US-only, using the documented address constraints.
- Use test card `4242424242424242`, a future expiration in `MM/YY`, and any three-digit code. A successful order shows its reference and clears the submitted cart. Failed submissions preserve the cart. Refresh prices if catalog prices change; sign in again if the session expires.
- Automated checks: `node --test tests/*.test.mjs` and `npm run build`. The build requires the configured products API to be reachable. Backend HTTP tests use a mocked data layer, so they do not create orders or change passwords in your database.

Validation in this implementation: frontend production build and component compilation passed; checkout calculation/payload tests passed; API password, order and existing regression tests passed. Interactive browser validation could not run because the browser host was unavailable. The Trello checkout reference image could not be accessed, so its visual match is unverified. A real MongoDB-backed checkout/password smoke test remains to be performed locally.
