# SATURIO. — Photography & video portfolio

A Spanish-language portfolio for Pedro Saturio. It opens with three Vietnam films, followed by two photographic series (Flamenca and En escena) and two film projects in the catalog. The SATURIO. brand is provisional. Content management is deferred; projects are edited in code.

## Run locally

Use `npm install && npm run dev` to open the development site. `npm test` runs the unit tests, and `npm run build` creates the production site in `dist/`. The project uses React, TypeScript, and Vite; there is no backend or contact form.

## Publish with GitHub Pages

1. Create a public GitHub repository with `main` as its default branch. Add the contents of this `portfolio/` directory as the repository root, so `package.json` and `.github/workflows/deploy.yml` are at the top level. Do not add the parent `Portfolio Pedro/` directory. With Git or GitHub Desktop, the `.gitignore` excludes local build files automatically. If uploading manually through GitHub's website, omit `node_modules/`, `dist/`, `.DS_Store`, and `tsconfig.tsbuildinfo`; keep the hidden `.github/` directory.
2. In the repository, open **Settings → Pages → Build and deployment** and choose **GitHub Actions** as the source.
3. Push to `main`. The workflow runs tests, builds the site, and deploys `dist/`. The published URL is shown in the Actions run and normally follows `https://<username>.github.io/<repository>/`.

Vite uses a relative base path, and media paths use `import.meta.env.BASE_URL`. The same build therefore works under a repository path or at the domain root. `node_modules/` and `dist/` are ignored by Git. No GitHub repository or public site has been created from this workspace.

## Change the portfolio

Edit `src/content.ts` to change film titles, order, posters, videos, photographs, and alt text. The browser-ready MP4 films and optimized WebP photographs live in `public/media/`. Keep the original MOV exports outside the repository; only the browser-ready versions are needed for Pages.

The page uses native scroll and modal viewers, keyboard navigation, photo filters, and reduced-motion handling. There is no public contact link until one is chosen.
