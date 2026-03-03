#!/bin/bash
# Publishes dialog.tsx, dialog.css, and README.md to the main branch.
# Run from the dev branch: ./release.sh

set -e

CURRENT=$(git branch --show-current)

if [ "$CURRENT" != "dev" ]; then
  echo "Must be on the dev branch. Currently on: $CURRENT"
  exit 1
fi

# Stash any uncommitted changes so we don't lose work
STASHED=false
if ! git diff --quiet || ! git diff --cached --quiet; then
  git stash push -m "release-stash"
  STASHED=true
fi

# Copy files to a temp dir before switching branches
TMP=$(mktemp -d)
cp src/components/dialog/dialog.tsx "$TMP/"
cp src/components/dialog/dialog.css "$TMP/"
cp README.md "$TMP/"

# Switch to main, replace the files, commit
git checkout main
cp "$TMP/dialog.tsx" .
cp "$TMP/dialog.css" .
cp "$TMP/README.md" .

git add dialog.tsx dialog.css README.md
git commit -m "release: $(date '+%Y-%m-%d')" || echo "Nothing to commit."

# Back to dev
git checkout dev

# Restore stash if we stashed
if [ "$STASHED" = true ]; then
  git stash pop
fi

rm -rf "$TMP"

echo ""
echo "Done. Run 'git push origin main' to publish."
