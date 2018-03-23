#!/bin/bash
f=$(pwd)

# TODO: update to handle output paths better
# NOTE: Run this from the project root directory

sips --resampleWidth 512 "${f}/images/app-icon.png" --out "${f}/images/iTunesArtwork.png"
sips --resampleWidth 1024 "${f}/images/app-icon.png" --out "${f}/images/iTunesArtwork@2x.png"

sips --resampleWidth 29 "${f}/images/app-icon.png" --out "${f}/images/Icon-29.png"
sips --resampleWidth 58 "${f}/images/app-icon.png" --out "${f}/images/Icon-29@2x.png"
sips --resampleWidth 87 "${f}/images/app-icon.png" --out "${f}/images/Icon-29@3x.png"

sips --resampleWidth 40 "${f}/images/app-icon.png" --out "${f}/images/Icon-40.png"
sips --resampleWidth 80 "${f}/images/app-icon.png" --out "${f}/images/Icon-40@2x.png"
sips --resampleWidth 120 "${f}/images/app-icon.png" --out "${f}/images/Icon-40@3x.png"

sips --resampleWidth 50 "${f}/images/app-icon.png" --out "${f}/images/Icon-50.png"
sips --resampleWidth 100 "${f}/images/app-icon.png" --out "${f}/images/Icon-50@2x.png"
sips --resampleWidth 150 "${f}/images/app-icon.png" --out "${f}/images/Icon-50@3x.png"

sips --resampleWidth 57 "${f}/images/app-icon.png" --out "${f}/images/Icon-57.png"
sips --resampleWidth 114 "${f}/images/app-icon.png" --out "${f}/images/Icon-57@2x.png"
sips --resampleWidth 171 "${f}/images/app-icon.png" --out "${f}/images/Icon-57@3x.png"

sips --resampleWidth 60 "${f}/images/app-icon.png" --out "${f}/images/Icon-60.png"
sips --resampleWidth 120 "${f}/images/app-icon.png" --out "${f}/images/Icon-60@2x.png"
sips --resampleWidth 180 "${f}/images/app-icon.png" --out "${f}/images/Icon-60@3x.png"

sips --resampleWidth 72 "${f}/images/app-icon.png" --out "${f}/images/Icon-72.png"
sips --resampleWidth 144 "${f}/images/app-icon.png" --out "${f}/images/Icon-72@2x.png"
sips --resampleWidth 216 "${f}/images/app-icon.png" --out "${f}/images/Icon-72@3x.png"

sips --resampleWidth 76 "${f}/images/app-icon.png" --out "${f}/images/Icon-76.png"
sips --resampleWidth 152 "${f}/images/app-icon.png" --out "${f}/images/Icon-76@2x.png"
sips --resampleWidth 228 "${f}/images/app-icon.png" --out "${f}/images/Icon-76@3x.png"

sips --resampleWidth 152 "${f}/images/app-icon.png" --out "${f}/images/Icon-152.png"
sips --resampleWidth 304 "${f}/images/app-icon.png" --out "${f}/images/Icon-152@2x.png"
sips --resampleWidth 456 "${f}/images/app-icon.png" --out "${f}/images/Icon-152@3x.png"

sips --resampleWidth 167 "${f}/images/app-icon.png" --out "${f}/images/Icon-83.5@2x.png"
