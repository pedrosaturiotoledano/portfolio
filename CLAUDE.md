# SATURIO portfolio

## Context
Design-first Spanish filmmaker and photographer portfolio for Pedro Saturio. Proposed brand: SATURIO. Three owner-provided Vietnam films appear in the opening sequence; the catalog includes two film projects and two owner-provided photographic series. Content management is explicitly deferred.

## Stack and structure
React 19, TypeScript strict, Vite. `src/App.tsx` contains the visitor experience and native dialog viewers; `src/content.ts` owns project content; `src/styles.css` owns responsive design; `public/media` contains browser-ready owner media. `.github/workflows/deploy.yml` publishes GitHub Pages.

## Commands
`npm install`, `npm run dev`, `npm run build`, `npm test`. No lint command configured; TypeScript strict validates types in the build.

## Rules
Spanish UI, English code/docs. Preserve native scroll and keyboard navigation. Honor reduced motion. Do not invent clients, awards, personal biography, contact addresses, or project credits. Keep media paths compatible with a GitHub Pages repository subpath. No commits without approval.
