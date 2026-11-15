# Bundled web fonts

These are unmodified WOFF2 files from the successful Next.js 15.5.28 Google Fonts build used by DansLab before it switched to repository-hosted fonts. They are served from this directory to make builds independent of Google Fonts response formats and network availability.

| Family | Embedded version | Styles | Configured weights |
| --- | --- | --- | --- |
| Inter | 4.001; git-66647c0bb | Normal | 400, 500, 600, 700 |
| Newsreader | 1.003, optical size 16pt | Normal and italic | 400, 500, 600 |
| JetBrains Mono | 2.211 | Normal | 400, 500, 600, 700 |

The 19 subset files total 507,616 bytes. The source files were copied byte for byte; no glyphs, font metadata, outlines, names, or variation axes were changed. `manifest.json` records every original build filename, deployed filename, SHA-256 digest, byte count and Unicode range.

`src/app/fonts.css` retains the generated font faces' exact weight/style declarations and Unicode ranges, including Latin Extended for Romanian ă, ș and ț. The original metric-adjusted Arial/Times New Roman fallbacks and the three existing CSS variables are preserved. The root layout preloads the same four Latin subset files that the Google Fonts loader preloaded.

## Upstream sources and licenses

All three families are distributed under the SIL Open Font License 1.1. Their own licenses and copyright notices apply to the font files, independently of the application's license:

- Inter: [upstream project](https://github.com/rsms/inter), [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/inter), license in `OFL-Inter.txt`.
- Newsreader: [upstream project](https://github.com/productiontype/Newsreader), [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/newsreader), license in `OFL-Newsreader.txt`.
- JetBrains Mono: [upstream project](https://github.com/JetBrains/JetBrainsMono), [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/jetbrainsmono), license in `OFL-JetBrains-Mono.txt`.

When updating a font, keep all its required subsets and license, record the new digest in the manifest, and update the CSS URL and preload URL together. Verify Romanian glyph coverage and fallback metrics before publishing.
