#!/usr/bin/env bash
set -euo pipefail

echo "Checking images in $(pwd) for metadata..."

# find returns 0 even if nothing matched; exiftool will just skip
violations=0

while IFS= read -r -d '' file; do
  echo "checking $file"
  meta="$(exiftool -s -G1 -a "$file" | grep -vE '^\[(System|File|JFIF|Composite|ExifTool)\]' || true)"

  if [ -n "$meta" ]; then
    echo
    echo "[!] Metadata found in: $file"
    echo "$meta"
    echo
    violations=1
  fi
done < <(find . -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0)

if [ "$violations" -ne 0 ]; then
  echo "Metadata check FAILED"
  exit 1
fi

echo "No extra metadata found"
