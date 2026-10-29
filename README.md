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
