# Raehdojhn — Portfolio

Classically trained artist · creative technologist · LA / Charlotte.
Static portfolio site with a full image archive, V4, Nodear, music-player UI, and downloadable career materials.

## Stack

- **Production site:** hand-tuned single-file HTML (`portfolio.html`) with embedded CSS + vanilla JS.
- **React iterations:** `src/` — Vite + React 19 + framer-motion. Used during design exploration; the static `portfolio.html` is the deployed artifact.
- **Build:** `scripts/build-static.mjs` copies the static files and deploy assets into `dist/`.

## Local development

```bash
node scripts/serve-static.mjs        # serves the static portfolio.html at http://localhost:5173
node scripts/build-static.mjs        # produces dist/
node scripts/serve-dist.mjs          # serves the built dist/
```

If you have npm:

```bash
npm install
npm run dev        # serve the static site
npm run build      # build to dist/
npm run preview    # serve the built dist/
npm run deploy:preview  # create a Netlify draft deploy
npm run deploy          # deploy dist/ to Netlify production
npm run deploy:pages    # optional gh-pages deploy, only if dist/ is under GitHub Pages limits
```

## Deploying

### Netlify (recommended for the full image archive)

The current deploy includes the full public project archive, so Netlify is the safest path.

```bash
cd "/Users/nodear/Desktop/raehdojhn-portfolio-source-2026-05-08"
npm install
npm run deploy:preview
npm run deploy
```

The first Netlify command will ask you to log in and choose/create a site. `npm run deploy:preview` gives you a private draft URL first; `npm run deploy` publishes the production URL.

You can also connect this repo through the Netlify dashboard. Build settings are already in `netlify.toml`:

- Build command: `node scripts/build-static.mjs`
- Publish directory: `dist`

### GitHub Pages (only after slimming the image archive)

1. Push this repo to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds `dist/` and publishes it.

GitHub Pages has a 1GB published-site limit. This portfolio build is currently larger because it includes the full image/project archive, so use Netlify unless you compress or move media to a CDN.

### Vercel

Connect the repo at [vercel.com/new](https://vercel.com/new). Build settings are already in `vercel.json`.

### Manual gh-pages branch (fallback)

```bash
npm run deploy:pages
```

This builds locally and force-pushes `dist/` to the `gh-pages` branch.

## Key sections (`portfolio.html`)

- **Media I've Consumed** — paste a YouTube / Spotify / SoundCloud URL via the `[ + Add Embed ]` panel. Items persist in `localStorage`.
- **Archive Log (blog)** — tabbed by platform: Substack, Medium, Self-Hosted.
- **Influences** — eight categories of references, four working pillars, plus quotes.
- **Light/dark theme** — `[data-theme="light"]` flips the palette to a `#F2F0EF` cream surface.

## License

© 2026 Raehdojhn. All rights reserved.
