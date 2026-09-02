#!/bin/sh

set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
PUBLIC="$ROOT/dist/public"

mkdir -p "$PUBLIC" "$ROOT/dist/.openai"

rsync -a \
  "$ROOT/index.html" \
  "$ROOT/script.js" \
  "$ROOT/styles.css" \
  "$PUBLIC/"

rsync -a --delete "$ROOT/projects/" "$PUBLIC/projects/"

if [ -d "$ROOT/public/videos" ]; then
  mkdir -p "$PUBLIC/videos"
  rsync -a --delete "$ROOT/public/videos/" "$PUBLIC/videos/"
fi

# Keep the published package lean while allowing new case-study images to be
# added without changing this script.
rsync -a --delete --delete-excluded --prune-empty-dirs \
  --include='/stiff-ref/' \
  --include='/stiff-ref/***' \
  --include='/intro/' \
  --include='/intro/***' \
  --include='/projects/' \
  --include='/projects/ausman/' \
  --include='/projects/ausman/pages/' \
  --include='/projects/ausman/pages/***' \
  --include='/projects/ausman/cover-motion.webp' \
  --include='/projects/archive/' \
  --exclude='/projects/archive/c4d-illustration/page-01.jpg' \
  --include='/projects/archive/***' \
  --include='/projects/bthree/' \
  --include='/projects/bthree/*.png' \
  --include='/projects/bthree/*.jpg' \
  --include='/projects/bthree/*.jpeg' \
  --include='/projects/bthree/*.webp' \
  --include='/projects/bthree/*.avif' \
  --include='/projects/bthree/*.svg' \
  --include='/projects/bthree/*.gif' \
  --include='/projects/bthree/content-scanner-arm-v2-optimized.glb' \
  --include='/group-3-arrow.svg' \
  --include='/hero-working.mp4' \
  --include='/hero-working.webp' \
  --include='/hero-working.png' \
  --include='/hero-thinking.mp4' \
  --include='/hero-thinking-1080.mp4' \
  --include='/hero-thinking.webp' \
  --include='/hero-thinking.png' \
  --include='/project-cover-product.svg' \
  --include='/project-material-cover.svg' \
  --include='/project-cover-aigc.svg' \
  --include='/project-cover-motion.svg' \
  --include='/wechat-qr-beichuan.jpg' \
  --exclude='*' \
  "$ROOT/assets/" "$PUBLIC/assets/"

cp "$ROOT/.openai/hosting.json" "$ROOT/dist/.openai/hosting.json"

mkdir -p "$ROOT/build"
rsync -a --delete "$PUBLIC/" "$ROOT/build/"

printf 'Synced current portfolio to %s\n' "$PUBLIC"
