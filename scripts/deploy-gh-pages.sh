#!/usr/bin/env bash
# Manual one-shot deploy to the gh-pages branch.
# Use this only if the GitHub Actions workflow is broken or you want to deploy
# without pushing main. Run from the project root.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if [ ! -d ".git" ]; then
  echo "Error: not a git repo. Run 'git init' first." >&2
  exit 1
fi

ORIGIN_URL="$(git config --get remote.origin.url || true)"
if [ -z "$ORIGIN_URL" ]; then
  echo "Error: no 'origin' remote configured." >&2
  exit 1
fi

echo "→ Building static site..."
node scripts/build-static.mjs

echo "→ Publishing dist/ to gh-pages branch on $ORIGIN_URL"
cd dist

# Ensure GitHub Pages sees the build root, not a Jekyll attempt
: > .nojekyll

git init -q
git checkout -q -b gh-pages
git add -A
git -c user.email="deploy@local" -c user.name="deploy" commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git remote add origin "$ORIGIN_URL"
git push -f -q origin gh-pages

# Clean up the throwaway repo so dist stays a normal build artifact
rm -rf .git

cd "$REPO_ROOT"
echo "✓ Deployed. In GitHub: Settings → Pages → Source → 'Deploy from a branch' → gh-pages."
