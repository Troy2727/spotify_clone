#!/usr/bin/env bash
# Renders the README GIFs into docs/animated/renders/. Needs Node 22+ and FFmpeg.
# PNG frames stay in docs/animated/frames/<name>/ (gitignored) and are overwritten on the next run.
# usage (from the repo root): bash docs/animated/render.sh [name ...]   e.g. home architecture-dark
set -euo pipefail
cd "$(dirname "$0")"
export HYPERFRAMES_NO_TELEMETRY=1
node build.mjs
mkdir -p renders
names=("$@")
[ ${#names[@]} -gt 0 ] || names=(home album chat admin architecture-dark architecture-light admin-auth-dark admin-auth-light)

for name in "${names[@]}"; do
  if [ -f "screens/$name.html" ]; then comp="animated/screens/$name.html"; else comp="animated/compositions/$name.html"; fi
  echo "=== $name"
  (cd .. && npx --yes hyperframes@0.8.166 render . -c "$comp" --format png-sequence --output "animated/frames/$name")
  ffmpeg -v error -y -framerate 30 -i "frames/$name/frame_%06d.png" \
    -vf "format=rgb24,fps=15,split[a][b];[a]palettegen=max_colors=256:stats_mode=full:reserve_transparent=0[p];[b][p]paletteuse=dither=none:diff_mode=rectangle" \
    -loop 0 "renders/$name.gif"
  echo "$(du -k "renders/$name.gif" | cut -f1) KB"
done
