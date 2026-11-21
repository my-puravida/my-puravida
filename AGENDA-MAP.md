# Mon agenda: file map (for Claude)

Installable PWA (GitHub Pages, repo `my-puravida`), French interface, all files at the repo root (no sub-folders).
Attach this file to every modification request. Claude tells me which files to send.

## Rules for every modification (Claude must follow)

1. **Always ask me for `sw.js`**, every time, even for a tiny change. Return it with the version number raised (`const VERSION = 'v25'` -> `'v26'`, etc.), otherwise the phone keeps showing the old version.
2. If a file is **added, renamed or deleted**, add or remove it in the `SHELL` list of `sw.js`.
3. Use the "Screen -> files to ask for" table to decide which file(s) to request, and **only edit those**. Never guess the content of a file I have not sent.
4. Return only the changed files, plus the updated `sw.js` and this map (with a new line in the change log).
5. Show a preview first when possible, so I can ask for changes before uploading to GitHub.
6. Keep changes small and in the right file. Do not re-embed images as base64 inside the code.

## Files

| File | Role |
|---|---|
| `index.html` | Page skeleton only (about 2 KB). Links to the CSS and JS files below. |
| `style.css` | Main design (loaded in the head). |
| `style-late.css` | Final overrides (loaded at the end of the body, so it wins over the rest). Keep it last. |
| `sw.js` | Service worker (offline mode). Has the file list `SHELL` and the `VERSION` number. |
| `manifest.webmanifest` | App name, colors, icons. |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` | App icons. |
| `img-*.webp` / `img-mk.png` | Images (see below). |

## JavaScript: loaded in this exact order (later files can override functions of earlier ones)

| Order | File | Contents |
|---|---|---|
| 1 | `app-core1.js` | Base app: months, weeks, years, shopping list, meals, timer, special dates, themes, notes and calculator, beach and tides, Bitcoin, start of Vision board |
| 2 | `app-core2.js` | Vision board, chores, home page, backup/restore, exchange rates, bucket list, week planner, day page, past years, search, activity icons, swipe navigation |
| 3 | `app-day.js` | Top-right menu, universal search, day page versions (photos, summary), weather of the day (`WXI`), statistics |
| 4 | `app-icons.js` | Date icons (`DTI`), activity icons (`ACTIMG`), voice dictation, beach choice, post-its, magazine-style day page, week overview, monkeys |
| 5 | `app-week-home.js` | Walking activity, annual calendar, home page styles (magazine frame, calendar sheet, post-it), month goals, Memories, crystals icon |
| 6 | `app-day2.js` | Day page icons, photo viewer, 30 min timer, mood, power and water outages, notes sharing |
| 7 | `app-extras.js` | Photo viewer with zoom, Vision board per year, tides 2027, live Bitcoin, backup reminder, moods and review, week strip, fireworks, voice and lock in notes |
| 8 | `app-vault.js` | Secret vault (6-digit code, AES encryption), Aqua activity, outages in statistics, final `render()` call |
| 9 | `app-photos.js` | **Photo storage in IndexedDB** (full-size original + preview), migration of old photos, storage counter, export/import of the original photos as zip files (`phExport`, `agExportAll`, `agRestoreAll`). Redefines `dph`, `vbAdd`, `dpd`, `vbDel`, `bkExport`, `bkHTML` (the Backup screen now has only two buttons: "Tout exporter" and "Tout restaurer"). Must stay last |

Notes:
- The app was built in layers: many functions are defined several times and the **last definition wins**. When changing a behavior, check later files too.
- `app-vault.js` runs the first `render()`; `app-photos.js` is loaded after it and must stay the last script.
- **Photos:** in the saved data (localStorage) a photo is only a reference `idb:<id>`. The image files live in IndexedDB (database `agenda-photos`, stores `full` and `thumb`). `<img src="idb:...">` is turned into a real image automatically by `app-photos.js`. Never store photos as base64 text in localStorage.
- The normal backup file contains photos as preview-size copies (not the originals). Restoring a backup converts them back into IndexedDB photos.
- Backup screen = 2 buttons. **"Tout exporter"** downloads the normal backup (`.json`, photos as previews) plus all original photos as zip parts of about 250 MB (names like `jour/2026-11-20_1__id.jpg`, `vision/ag-vb_1__id.jpg`). **"Tout restaurer"**: the user picks the `.json` and all the `.zip` files at once; the app restores the data first, then puts the originals back (matched by day and position, not by id), then reloads. The old buttons (export, restore, restore originals) were removed.

## Screen -> files to ask for

Use this table to decide which files to request. "Start with" = ask for these first. "Layers" = later files that redefine or wrap the same screen (the last definition in load order wins), so ask for them too if the visible result comes from there.
For a **purely visual change** (colors, sizes, spacing, fonts) ask for `style.css` first, and `style-late.css` (it overrides `style.css`); the JS is usually not needed.

| Screen / feature | Start with | Layers (check if needed) |
|---|---|---|
| Home page | `app-core2.js` | `app-week-home.js` (magazine frame, calendar sheet, post-it), `app-extras.js` (week strip), `app-day.js` |
| Day page | `app-day2.js`, `app-icons.js` | `app-day.js`, `app-week-home.js`, `app-core2.js` (base), `app-vault.js`. Many layers: the day page is rebuilt several times |
| Week page | `app-core1.js`, `app-core2.js` | `app-extras.js` (goals post-it, fireworks) |
| Week planner | `app-core2.js` | `app-icons.js` (pink banner, hearts) |
| Month page | `app-core1.js` | `app-week-home.js` (month goals post-it) |
| Annual calendar / years | `app-core1.js`, `app-core2.js` | `app-week-home.js` (artistic version) |
| Vision board / Memories / Souvenirs | `app-core2.js` | `app-day2.js` (one board per year), `app-week-home.js`, `app-extras.js` |
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
| Backup / restore | `app-core2.js` | `app-extras.js` (reminder) |
| Search | `app-core2.js` | `app-day.js` (universal search) |
| Top-right menu | `app-day.js` | `app-week-home.js` |
| Weather of the day | `app-day.js` | `app-icons.js` |
| Activity icons / exercises | `app-core2.js`, `app-icons.js` | `app-week-home.js` (walking), `app-day2.js` (30 min), `app-vault.js` (Aqua), `app-extras.js` (fireworks) |
| Chores | `app-core2.js` | - |
| Themes / colors | `app-core1.js` | `style.css` |
| Moods / review | `app-extras.js` | `app-day2.js`, `app-icons.js` |
| Electricity / water outages | `app-day2.js` | `app-vault.js` (in statistics) |
| Photo viewer (zoom) | `app-day2.js` | `app-photos.js` (swaps preview for original) |
| Photo storage / adding and deleting photos / storage counter | `app-photos.js` | `app-core2.js` (day page photo list), `app-core1.js` (Vision board) |
| Voice dictation | `app-icons.js` | `app-extras.js` (micro in notes) |
| Crystals icon | `app-week-home.js` | - |
| Secret vault | `app-vault.js` | - |

## Images (all at the root)

| Files | Used for |
|---|---|
| `img-header.webp` | Top banner |
| `img-hero.webp` | Home page hero background |
| `img-bl.webp` | Bucket list button |
| `img-wx0` to `img-wx6.webp` | Weather icons |
| `img-act-fx / px / tp / yx / mx / sx / wx / tm / aq.webp` | Activity icons (workout, plank, trampoline, yoga, meditation, ...) |
| `img-plank.webp`, `img-tramp.webp` | Plank and trampoline icons |
| `img-dt-cat / family / other / arr / dep.webp` | Important-date icons |
| `img-crystal.webp` | Crystals icon |
| `img-el.webp`, `img-wa.webp` | Electricity and water icons |
| `img-mk.png` | Monkeys |

To change an image: same format, same file name, upload to replace it, then raise the `VERSION` in `sw.js`.

## Change log

- Step 1: all images moved out of `index.html` into `img-*` files.
- Step 2: CSS and JS split into `style.css`, `style-late.css` and `app-*.js`; `sw.js` at v25.
- Step 3: added the screen -> files table.
- Step 4: photos moved to IndexedDB (`app-photos.js`), originals kept at full quality, old photos migrated automatically, storage counter in the Backup screen; `sw.js` at v26.
- Step 5: export/import of original photos (zip parts); `sw.js` at v27.
- Step 6: Backup screen simplified to two buttons ("Tout exporter" / "Tout restaurer"); `sw.js` at v28.
