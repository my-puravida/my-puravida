# Mon agenda: file map (for Claude)

Installable PWA (GitHub Pages, repo `my-puravida`), French interface, all files at the repo root (no sub-folders).
Attach this file to every modification request. Claude tells me which files to send.

## Rules for every modification (Claude must follow)

1. **Always ask me for `sw.js`**, every time, even for a tiny change. Return it with the version number raised (`const VERSION = 'v40'` -> `'v41'`, etc.), otherwise the phone keeps showing the old version.
2. If a file is **added, renamed or deleted**, add or remove it in the `SHELL` list of `sw.js`.
3. Use the "Screen -> files to ask for" table to decide which file(s) to request, and **only edit those**. Never guess the content of a file I have not sent.
4. Return only the changed files, plus the updated `sw.js` and this map (with a new line in the change log).
5. Show a preview first when possible, so I can ask for changes before uploading to GitHub.
6. Keep changes small and in the right file. Do not re-embed images as base64 inside the code.
7. **The last definition wins.** Before editing a function, check the later files in the load order (especially `app-vault.js` and `app-photos.js`) for a redefinition of the same function.

## Files

| File | Role |
|---|---|
| `index.html` | Page skeleton only (about 2 KB). Links to the CSS and JS files below. Loads Google Fonts from the web. |
| `style.css` | Main design (loaded in the head). |
| `style-late.css` | Final overrides (loaded at the very end, after all JS, so it wins over the rest). Keep it last. |
| `sw.js` | Service worker (offline mode). Has the file list `SHELL` and the `VERSION` number. Since v36 the install is tolerant: a missing image or icon (`.webp` / `.png`) no longer blocks the update; a missing page, CSS, JS or manifest still does. |
| `manifest.webmanifest` | App name, colors, icons. |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` | App icons. |
| `img-*.webp` / `img-mk.png` | Images (see below). |

## JavaScript: loaded in this exact order (later files can override functions of earlier ones)

| Order | File | Contents |
|---|---|---|
| 1 | `app-core1.js` | Base app: months, weeks, years, shopping list, meals, timer, special dates, themes, notes and calculator, beach and tides, Bitcoin, start of Vision board |
| 2 | `app-core2.js` | Vision board, chores, home page, backup/restore (OLD versions, replaced by `app-photos.js`), exchange rates, bucket list, week planner, day page, past years, search, activity icons, swipe navigation |
| 3 | `app-day.js` | Top-right menu, universal search, day page versions (photos, summary), weather of the day (`WXI`), statistics |
| 4 | `app-icons.js` | Date icons (`DTI`), activity icons (`ACTIMG`), voice dictation, beach choice, post-its, magazine-style day page, week overview |
| 5 | `app-week-home.js` | **Monkeys (Singes): `mkOn`, `mkTog`, the monkey icon on the day page card and the monkey statistics**, walking activity, annual calendar, home page styles (magazine frame, calendar sheet, post-it), month goals, Memories, crystals icon |
| 6 | `app-day2.js` | Day page icons, photo viewer, 30 min timer, mood, power and water outages, notes sharing |
| 7 | `app-extras.js` | Photo viewer with zoom, Vision board per year, tides 2027, live Bitcoin, backup reminder, moods and review, week strip, fireworks, voice and lock in notes |
| 8 | `app-vault.js` | Secret vault (6-digit code, AES encryption), Aqua activity, outages in statistics, v35 block (moods, icons, + bar), v38/v39 block (mood images). Ends with the first `render()` call |
| 9 | `app-photos.js` | **Loaded last.** Photo storage in IndexedDB (original + preview), migration of old base64 photos, adding/deleting photos (`dph`, `vbAdd`, `dpd`, `vbDel`), photo counter, **Backup screen** (`bkHTML`, 2 buttons: Tout exporter / Tout restaurer), export in zip parts (`agExportAll`), restore (`agRestoreAll`), share dialog (Proton Drive etc.). In the data, a photo is just a reference `idb:<id>` |

Notes:
- The app was built in layers: many functions are defined several times and the **last definition wins**. When changing a behavior, check later files too.
- `app-vault.js` ends with `render()`. `app-photos.js` loads after it and redefines the functions listed above. Anything about backup, restore or adding/deleting photos must be changed in `app-photos.js`, NOT in `app-core2.js` / `app-extras.js` (those edits would never show).
- `style-late.css` loads after all the JS.

## Screen -> files to ask for

Use this table to decide which files to request. "Start with" = ask for these first. "Layers" = later files that redefine or wrap the same screen (the last definition in load order wins), so ask for them too if the visible result comes from there.
For a **purely visual change** (colors, sizes, spacing, fonts) ask for `style.css` first, and `style-late.css` (it overrides `style.css`); the JS is usually not needed.

| Screen / feature | Start with | Layers (check if needed) |
|---|---|---|
| Home page | `app-core2.js` | `app-week-home.js` (magazine frame, calendar sheet, post-it), `app-extras.js` (week strip), `app-day.js`, `app-vault.js` (v35 block: weather, Plage and Singes in the card) |
| Day page | `app-day2.js`, `app-icons.js` | `app-day.js`, `app-week-home.js`, `app-core2.js` (base), `app-vault.js`, `app-photos.js` (photos). Many layers: the day page is rebuilt several times |
| Week page | `app-core1.js`, `app-core2.js` | `app-extras.js` (goals post-it, fireworks) |
| Week planner | `app-core2.js` | `app-icons.js` (pink banner, hearts) |
| Month page | `app-core1.js` | `app-week-home.js` (month goals post-it) |
| Annual calendar / years | `app-core1.js`, `app-core2.js` | `app-week-home.js` (artistic version) |
| Vision board / Memories / Souvenirs | `app-core2.js` | `app-day2.js` (one board per year), `app-week-home.js`, `app-extras.js`, `app-photos.js` (adding/deleting photos) |
| Bucket list | `app-core2.js` | - |
| Statistics | `app-core1.js` | `app-day.js` (time statistics), `app-vault.js` (outages) |
| Shopping list | `app-core1.js`, `app-core2.js` | - |
| Meals | `app-core1.js` | `app-day2.js` |
| Timer | `app-core1.js` | `app-day2.js` (30 min stopwatch icon) |
| Important dates | `app-core1.js`, `app-core2.js` | `app-icons.js` (date icons `DTI`) |
| Notes (important / quick, lock, micro) | `app-core1.js` | `app-icons.js` (two note styles), `app-extras.js` (micro, lock), `app-day2.js` (sharing) |
| Calculator | `app-core1.js` | - |
| Beach / tides | `app-core1.js` | `app-extras.js` (tides 2027), `app-icons.js` (beach choice) |
| Bitcoin | `app-core1.js`, `app-extras.js` | - |
| Exchange rates | `app-core2.js` | - |
| **Backup / restore / export** (Sauvegarde screen, zip, share to Proton Drive) | **`app-photos.js`** | `app-extras.js` (backup reminder), `app-core2.js` (old version, no longer shown) |
| **Photos: adding, deleting, storage, counter** (day page and Vision board) | **`app-photos.js`** | `app-day2.js` / `app-extras.js` (photo viewer) |
| Search | `app-core2.js` | `app-day.js` (universal search) |
| + button and its vertical icon bar | `app-vault.js` (v35 block) | `app-day.js` (old menu, no longer shown), `style-late.css` |
| Weather of the day | `app-day.js` | `app-icons.js`, `app-vault.js` (home card) |
| Activity icons / exercises | `app-core2.js`, `app-icons.js` | `app-week-home.js` (walking), `app-day2.js` (30 min), `app-vault.js` (Aqua, Etirement), `app-extras.js` (fireworks) |
| Chores | `app-core2.js` | - |
| Themes / colors | `app-core1.js` | `style.css` |
| Moods / review | `app-vault.js` (v35 and v38/v39 blocks: `MOOD5`, mood images) | `app-extras.js`, `app-day2.js`, `app-icons.js` |
| Electricity / water outages | `app-day2.js` | `app-vault.js` (in statistics) |
| Photo viewer (zoom) | `app-day2.js` | `app-extras.js`, `app-photos.js` (loads the original image) |
| Voice dictation | `app-icons.js` | `app-extras.js` (micro in notes) |
| Crystals icon | `app-week-home.js` | - |
| Monkeys (Singes) on the home page card | `app-vault.js` (v35 block, `wxHero`, uses `img-singe.webp`) | `app-week-home.js` (`mkOn`, `mkTog`, old home version) |
| Monkeys (Singes) on the day page and in statistics | `app-week-home.js` (block "Singes : page du jour + statistiques") | `app-day2.js` (moves the monkey icon under the beach icon), `app-vault.js` |
| Secret vault (opens only by a long press, 0.8 s, on the big day number of the home page) | `app-vault.js` | - |

## Images (all at the root)

| Files | Used for |
|---|---|
| `img-header.webp` | Top banner |
| `img-hero.webp` | Home page hero background |
| `img-bl.webp` | Bucket list button |
| `img-wx0` to `img-wx6.webp` | Weather icons (0 sun, 1 sun and cloud, 2 cloud, 3 sun and rain, 4 rain, 5 storm, 6 moon) |
| `img-act-fx / yx / px / tp / aq / wx / mx / et / sx.webp` | Activity icons (workout, yoga, plank, trampoline, aqua, walk, meditation, stretching, Spanish). `img-act-tm.webp` is no longer used (30 min removed) |
| `img-mood-<code>.webp` (13 files) | Mood faces: ra Rayonnante, he Heureuse, ca Calme, fa Fatiguée, an Anxieuse, sp Spirituelle, mo Motivée, pe Pensive, no Nostalgique, ex Excitée, tr Triste, im Impatiente, re Reconnaissante |
| `img-plage.webp`, `img-singe.webp` | Beach and monkeys icons (home card; both also on the day page card) |
| `img-tb-*.webp` | Icons of the vertical bar opened by the + button (notes, panier, calc, devises, bitcoin, marees, lune, sablier, stats, loupe) |
| `img-plank.webp`, `img-tramp.webp` | Plank and trampoline icons |
| `img-dt-cat / family / other / arr / dep.webp` | Important-date icons |
| `img-crystal.webp` | Crystals icon |
| `img-el.webp`, `img-wa.webp` | Electricity and water icons |
| `img-mk.png` | Old monkey cut-out. No longer used on the day page (now `img-singe.webp`); still referenced by old CSS of the home page |

To change an image: same format, same file name, upload to replace it, then raise the `VERSION` in `sw.js`.

## Change log

- Step 1: all images moved out of `index.html` into `img-*` files.
- Step 2: CSS and JS split into `style.css`, `style-late.css` and `app-*.js`; `sw.js` at v25.
- Step 3: added the screen -> files table.
- Step 4: secret vault now opens only by a long press on the big day number of the home page. Removed the other accesses: Pura Vida/Espagnol icon long press, calculator code + "=", crossed-out post-it in notes, "Jardin secret" lock on the day page. `app-vault.js` edited, `sw.js` at v34.
- Step 5: v35. Moods Pensive and Nostalgique; 9 new activity icons (Etirement before Espagnol, 30 min removed); new weather icons; Plage and Singes icons under the weather in the home card; home page in blanc gris with a charcoal gradient (`style-late.css`); the tools open from a vertical icon bar behind the + button. All new code is in a block at the end of `app-vault.js`. New images added, `sw.js` at v35.
- Step 6: v36. `sw.js` made tolerant: a missing image or icon no longer blocks the install of an update (page, CSS, JS and manifest are still required). Cause found: the 13 new v35 images were not uploaded to GitHub, so v35 never installed. Only `sw.js` changed.
- Step 7: v37. Fix "Espace insuffisant pour restaurer" in `app-photos.js`: the restore now stores each photo in IndexedDB first and writes only the `idb:` reference to localStorage, key by key (before, the whole backup, photos included as base64, was written to localStorage and went over its ~5 MB limit). Backup export and zip files unchanged. `sw.js` at v37.
- Step 8: v39. Moods use the images `img-mood-<code>.webp` (ra Rayonnante, he Heureuse, ca Calme, fa Fatiguée, an Anxieuse, sp Spirituelle, mo Motivée, pe Pensive, no Nostalgique, ex Excitée = new mood added at the end of `MOOD5`). Triste (tr), Impatiente (im) and Reconnaissante (re) keep their drawn faces until `img-mood-tr/im/re.webp` exist: the code tests whether each file loads, then switches. All code is in a new block at the end of `app-vault.js` (rewrites `MOOD5[].s` as an SVG holding an `<image>`, and wraps `bilanShare` so the shared Bilan picture can draw the face). `sw.js` at v39.
- Step 9: map corrected. Added `app-photos.js` (load order 9, after `app-vault.js`, as in `index.html`) to the JS table and notes; backup/restore and photo add/delete rows now point to `app-photos.js` instead of `app-core2.js`; added rule 7 (last definition wins); added the 13 mood images to the image table. `img-mood-tr/im/re.webp` made from the mood sheet (512x512, transparent circle) and uploaded to the repo root: no code change, `sw.js` stays at v39.
- Step 10: v40. Day page: the monkey icon now uses the same photo `img-singe.webp` as the home page (round, faded when not seen, like the beach icon) instead of the grey `img-mk.png` cut-out. Only the `d3m` line in the "Singes : page du jour" block of `app-week-home.js` changed. Map corrected: monkeys are in `app-week-home.js` and `app-vault.js`, not in `app-icons.js`. `sw.js` at v40.
- Step 11: v41. Home page order restored as on the screenshot: card (date, weather, Plage, Singe), then "Cette semaine", then the two phrases, then the activity icons (they stay in their original place inside the `.fc` block; the code that moved them right under the card was removed from the v35 block of `app-vault.js`, with the `.hwrap>.act` style line). Today's circle in "Cette semaine" is now dark charcoal (`style-late.css`, `.wkc.today`). `sw.js` at v41.
- Step 12: v42. Home page phrases (`.fc-qt`) reduced to 16 px via `style-late.css` (no `style.css` needed). `sw.js` at v42.
- Step 13: v43. Weather icon 0 (sun, Matin/Aprem): `img-wx0.webp` replaced by the new silver sun; ring recolored to the deeper rose-gold of the other weather icons (512x512, transparent circle). Image only, no code change. `sw.js` at v43.
- Step 14: v44. Day page: removed the heart ("Journée importante") at the top right: in the block "Page du jour : coeur" of `app-week-home.js` the button is no longer added (the old marker is still removed). `sw.js` at v44.
- Step 15: v45. Day page: removed the crystals icon at the top right: in the block "Page du jour : icone Cristaux" of `app-week-home.js` the button is no longer added (the Cristaux overlay code stays, unused). `sw.js` at v45.
- Step 16: v46. `img-wx0.webp` (sun): ring color matched to the measured ring of the other weather icons (deeper rose-copper), face slightly warmer. Image only. `sw.js` at v46.
- Step 17: v47. Day page: the top box without photo (`.mhero.nop`) now has the same background as the home page card (white-grey marble, `--hb`), in `style-late.css`. The day page CSS itself (not sent) was not read: this is an override. `sw.js` at v47.
- Step 18: v48. Annual calendar page (2026 / 2027): the round medallion at the top (`img-header.webp`, the `.hd` block) is hidden on all pages via `style-late.css` (`.hd{display:none!important}`; the image file stays in the repo and in `SHELL`). The year page area (`#view:has(.yv:not(.pyv))`) now has the home card marble background `--hb` (`img-hero.webp`, flowers top right), the 12 month cards stay white with a soft grey shadow (pink circle and title halo removed). "Calendrier", the year and month names are charcoal gradient (#39393b to #707072); weekday letters and day numbers are charcoal (other-month days light grey). Only `style-late.css` changed (Memories page `.pyv` untouched). `sw.js` at v48.
