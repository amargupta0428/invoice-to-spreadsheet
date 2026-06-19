#!/usr/bin/env bash
# Generates public/samples/receipt-photo.jpg — a synthetic "phone photo of a paper
# receipt" used as the harder sample input. Requires ImageMagick (`magick`) and a
# Courier font. The degradation is deliberately moderate: the receipt number and
# tax amount are visibly smudged (so the input clearly looks like a real-world photo),
# while every field stays readable enough for the model to extract correctly.
#
# Usage: bash scripts/make-receipt-photo.sh
set -euo pipefail

OUT="$(cd "$(dirname "$0")/.." && pwd)/public/samples/receipt-photo.jpg"
FONT="${RECEIPT_FONT:-/System/Library/Fonts/Supplemental/Courier New Bold.ttf}"
PAPER='#f6f3ea'; SURFACE='#b3a994'
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT

cat > "$WORK/receipt.txt" <<'TXT'
       CORNER HARDWARE
    South Main St, Brooklyn, NY
        Receipt #0098471
        06/03/2026   14:22
--------------------------------
2x4 lumber stud      8 @ 4.18  33.44
Wood screws #8 box   2 @ 9.99  19.98
Construction adhesive 1         6.49
--------------------------------
SUBTOTAL                       59.91
TAX                             5.32
TOTAL                          65.23

           PAID - CASH
            thank you!
TXT

# Crisp base receipt: dark ink on warm off-white paper
magick -background "$PAPER" -fill '#1e1c18' -font "$FONT" -pointsize 30 \
  -interline-spacing 8 label:@"$WORK/receipt.txt" \
  -bordercolor "$PAPER" -border 60x70 "$WORK/base.png"

# Localized smudge (heavy local blur, not opaque fill) over the receipt number and tax amount
magick "$WORK/base.png" \
  -region 224x56+290+142 -blur 0x2.4 -modulate 106 +region \
  -region 112x46+626+490 -blur 0x3.0 -modulate 108 +region \
  "$WORK/smudged.png"

# Desk surface, perspective shear (baselines stay level) + slight rotation
magick "$WORK/smudged.png" -bordercolor "$SURFACE" -border 84x100 "$WORK/surface.png"
magick "$WORK/surface.png" -background "$SURFACE" -virtual-pixel background \
  -shear 5x0 -rotate 1.5 +repage "$WORK/warp.png"
W=$(magick identify -format %w "$WORK/warp.png"); H=$(magick identify -format %h "$WORK/warp.png")

# Soft, uneven lighting
magick "$WORK/warp.png" \
  \( -size "${W}x${H}" gradient:'rgba(0,0,0,0.26)'-'rgba(0,0,0,0.00)' -rotate 18 -resize "${W}x${H}\!" -blur 0x55 \) \
  -compose multiply -composite "$WORK/lit.png"

# Uneven focus: mild blur everywhere, heavier toward the bottom via a gradient mask
magick "$WORK/lit.png" -gaussian-blur 0x0.8 "$WORK/soft.png"
magick "$WORK/lit.png" -gaussian-blur 0x2.2 "$WORK/heavy.png"
magick -size "${W}x${H}" gradient:black-white "$WORK/mask.png"
magick "$WORK/soft.png" "$WORK/heavy.png" "$WORK/mask.png" -compose over -composite "$WORK/blur.png"

# Sensor noise, downscale, moderate JPG compression
magick "$WORK/blur.png" -attenuate 0.30 +noise Gaussian -resize 82% -quality 66 "$OUT"
echo "wrote $OUT"
