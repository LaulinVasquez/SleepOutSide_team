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
