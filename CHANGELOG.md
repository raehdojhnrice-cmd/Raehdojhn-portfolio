# RAEHDOJHN Portfolio — Change Log

> This file is updated every session. Every change must be logged here with a date, description, affected files, and the git commit hash (if applicable). This enables any state to be referenced or restored.

---

## Git Branch Map

| Branch | Description |
|---|---|
| `main` | Original pre-nodear baseline (April 5, 2026) |
| `main-restored-2026-04-19` | **CURRENT** — Restored April 8th build (clean Brutalist) |
| `snapshot` commit `e045f8e` | Full snapshot of all chaos-lux / nodear overhaul work as of April 19 |

### How to restore any state

```bash
# Restore a specific file from any commit
git checkout <COMMIT_HASH> -- src/path/to/file.jsx

# Jump back to a full snapshot
git checkout <COMMIT_HASH>

# See all commits
git log --oneline
```

---

## Change Log

---

### 2026-04-19 — Archive Editorial Overhaul (Phases 1–10)

**Goal:** Execute a systemic "Archive Editorial" upgrade, layering technical metadata and consistent headers over the April 8th Brutalist baseline.

**Changed files:**

| Component | Changes |
|---|---|
| `src/index.css` | Appended Archive design tokens (Phase 1). Fixed light-mode bento card backgrounds (Phase 7). |
| `src/ui/Archive*.jsx` | Created `ArchiveSectionChrome` and `ArchiveMetaRow` (Phase 2). |
| `src/MainPortfolio.jsx` | Integrated unified headers and state tracking. |
| `src/components/ProjectGrid.jsx` | Implemented adaptive viewport heights and `ArchiveMetaRow` (Phase 5/6). |
| `src/components/Services.jsx` | Integrated `ArchiveSectionChrome` header (Phase 6). |
| `src/components/About.jsx` | Integrated `ArchiveSectionChrome` header (Phase 6). |
| `src/components/Contact.jsx` | Integrated header & `VITE_FORMSPREE_ENDPOINT` support (Phase 6/8). |
| `src/components/Blog.jsx` | Integrated header & safe array-based content rendering (Phase 6/8). |
| `src/components/Influences.jsx` | Integrated `ArchiveSectionChrome` header (Phase 6). |
| `src/components/MusicPlayer.jsx` | Implemented `gp--quiet` minimized state (Phase 9). |
| `src/components/Hero.jsx` | Gated admin background panel behind `import.meta.env.DEV` (Phase 4). |
| `src/components/Navbar.jsx` | Added `RAE / ARCHIVE` logo metadata (Phase 3). |
| `src/components/MarqueeBar.jsx` | Added `ISSUE` and `EDITION` metadata (Phase 3). |
| `src/components/MobileMenu.jsx` | Added site index kicker (Phase 3). |

**Why:** To evolve the Brutalist aesthetic into a technical "Archive Editorial" look while preserving the mobile-first performance and functional reliability of the April 8th build.

---

### 2026-04-19 — RESTORATION SESSION

**Goal:** Fully revert main portfolio to the clean Brutalist build as it existed on April 8th.

**Commit:** `ea84d5b` on branch `main-restored-2026-04-19`

**Safety snapshot before revert:** `e045f8e` — contains ALL the chaos-lux, V4, and nodear overhaul work from April 8–19.

**Files restored from `515c51d` baseline:**

| File | Change |
|---|---|
| `src/index.css` | Restored Brutalist design tokens. `--accent: var(--red)` (#FF3366). Removed shadcn/oklch variables. |
| `src/App.jsx` | Removed NODEAR route and imports. |
| `src/MainPortfolio.jsx` | Removed ARCHIVE_DATA state, nodear vault sections. |
| `src/components/Navbar.jsx` | Restored standard horizontal nav with RAEHDOJHN branding. |
| `src/components/MobileMenu.jsx` | Removed V4 WEBSITE link, restored to 7-link layout. |
| `src/components/Hero.jsx` | Restored V4 Brutalist typography and CTA. |
| `src/components/MusicPlayer.jsx` | Restored original minimalist glassmorphic player. |
| `src/components/About.jsx` | Restored. |
| `src/components/Blog.jsx` | Restored. |
| `src/components/Contact.jsx` | Restored. |
| `src/components/Footer.jsx` | Restored. |
| `src/components/Influences.jsx` | Restored. |
| `src/components/MarqueeBar.jsx` | Restored. |
| `src/components/ProjectGrid.jsx` | Restored. |
| `src/components/nodear/*.jsx` | Re-added — nodear pages exist but are not routed from the main portfolio. |

**Files NOT restored (remain from overhaul — in snapshot `e045f8e` only):**
- All `src/components/v4/` directory
- `src/styles/v4-chaos-lux.css`
- `src/components/ui/Archive*.jsx`, `Chaos*.jsx`
- `src/iterations/` directory

---

### 2026-04-19 — Navigation Revisions (REVERTED by above restoration)

- Removed RAEHDOJHN branding from top-left of Navbar
- Made hamburger persistent on desktop
- Added V4 WEBSITE link (#08) to MobileMenu
- Fixed missing `motion` import in `V4IdentityRail.jsx` and `V4LabSplat.jsx`
- Fixed double-section closing tag in `V4LabSplat.jsx`

---

### 2026-04-08 — Initial Commit (shadcn tooling layer)

**Commit:** `8770990`

Added shadcn/ui tooling on top of the April 5th baseline:
- `src/components/ui/button.jsx`
- `src/lib/utils.js`
- Updated `vite.config.js`, `package.json`, `src/index.css` (added shadcn tokens)

---

### 2026-04-05 — Pre-Nodear Baseline

**Commit:** `515c51d` on branch `main`

Complete V4 Brutalist portfolio. Ground truth build:
- Palette: `--accent: #FF3366`, Playfair Display + Syne + JetBrains Mono
- Components: Hero, About, Blog, Contact, Footer, ProjectGrid, Services, Influences, MarqueeBar, MusicPlayer, Navbar, MobileMenu, ErrorBoundary
- Audio: AudioVisualizer, RotaryKnob, WaveformProgress
- Nodear pages exist but were NOT routed

---

## Template for Future Entries

```
### YYYY-MM-DD — [Short Description]

**Commit:** `<hash>` on branch `<branch>`

**Changed files:**

| File | What changed |
|---|---|
| `src/...` | ... |

**Why:** ...

**To revert a single file:**
git checkout <prev-commit-hash> -- src/path/to/file.jsx
```
