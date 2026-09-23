# figma-make-app

React (JavaScript/JSX) + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.jsx` - React entrypoint; imports `src/index.css` and mounts `src/App.jsx` into the `#root` element
- `src/App.jsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.jsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.js` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

### Feature architecture

Code is organized by feature, not by file type:

- `src/features/<feature>/` - One folder per domain (`auth`, `dashboard`, `products`, `categories`, `inventory`, `pos`, `customers`, `suppliers`, `employees`, `reports`). Screens, and any components/hooks/data used only by that feature, live here.
- `src/shared/components/` - Reusable UI used by more than one feature (e.g. `Logo`).
- `src/shared/layout/` - App shell (`Sidebar`, `Header`).
- `src/assets/` - Static images.

Import across folders with the `@` alias (`@/features/pos/POS`, `@/shared/components/Logo`).

## Dependencies

- Runtime: React 19 and React DOM 19
- Icons: `lucide-react` — use it for every icon; do not use emojis or Unicode symbols as icons
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8 and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.js`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. Use the `@theme` color tokens (`brand-*`, `canvas`, `success`, `warning`, `danger`, …) instead of hex values; add a new token when a color is missing. Do not use inline `style={{}}` or JS hover/focus handlers for styling — use `hover:`/`focus:` variants and conditional classes; inline style is only for values computed at runtime (e.g. a percentage width). This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.jsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.
