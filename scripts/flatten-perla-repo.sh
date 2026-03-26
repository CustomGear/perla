#!/usr/bin/env bash
# Run this ON YOUR MAC in Terminal (one time). It flattens CustomGear/perla so
# site files live at the repo root for Netlify.
set -euo pipefail

REPO_URL="${1:-https://github.com/CustomGear/perla.git}"
WORKDIR="${TMPDIR:-/tmp}/perla-flatten-$$"

echo "Cloning into $WORKDIR ..."
git clone --depth 1 "$REPO_URL" "$WORKDIR"
cd "$WORKDIR"

if [[ ! -d PERLA-INFLUENCER-WEB ]]; then
  echo "No PERLA-INFLUENCER-WEB folder found — already flat or wrong repo."
  exit 1
fi

echo "Moving files to repository root ..."
shopt -s dotglob nullglob
for item in PERLA-INFLUENCER-WEB/*; do
  base=$(basename "$item")
  if [[ -e "$base" ]]; then
    echo "Skip: $base already exists at root (resolve manually)."
    continue
  fi
  git mv "$item" .
done
shopt -u dotglob

git status
rmdir PERLA-INFLUENCER-WEB 2>/dev/null || rm -rf PERLA-INFLUENCER-WEB

echo "Committing ..."
git add -A
git commit -m "Move site files from PERLA-INFLUENCER-WEB to repository root"

echo "Pushing to origin main ..."
git push origin main

echo "Done. Remove temp folder: rm -rf $WORKDIR"
echo "In Netlify: Base directory = (empty), Publish directory = ."
