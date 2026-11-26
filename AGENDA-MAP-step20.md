# À ajouter dans AGENDA-MAP.md (étape 20)

## Tableau JavaScript (après la ligne 9 `app-photos.js`)
| 10 | `app-photos-tab.js` | Onglet **Photos** (avant l'icône Passé) : albums nommés par l'utilisateur, photo du mois, ajout / suppression de photos. Données : clé `ag-albums` (références `idb:<id>`), images dans IndexedDB `agenda-photos` (comme `app-photos.js`). Redéfinit `render` et `swipeNav`. À charger après `app-photos.js`, avant `app-cover.js`. |

## Tableau "Screen -> files"
| Photos tab (albums, photo du mois) | `app-photos-tab.js` | `app-core1.js` (`TABS`), `app-photos.js` (stockage, sauvegarde) |

## Images
| `img-photos-banner.webp` | Bannière "Life is a collection of moments" en haut de l'onglet Photos (rectangle arrondi, fond transparent) |
Aussi à ajouter au plan : `app-cover.js` (couverture + code à 4 chiffres, chargé en dernier), `img-cover.webp`, `img-code.webp`.

## Change log
- Step 20: v51. Nouvel onglet "Photos" placé avant l'icône Passé (fond marbre `--hb`, bannière `img-photos-banner.webp`, grande carte photo du mois, albums nommés librement, ajout et suppression de photos). Nouveau fichier `app-photos-tab.js` (aucune modification de `app-core1.js` ni de `app-photos.js`), ajouté dans `index.html` et dans `SHELL` de `sw.js` avec l'image. `sw.js` à v51.
- Limite connue : les photos des albums sont dans la sauvegarde en taille aperçu (1000 px) ; les originaux ne sont pas encore dans les fichiers zip (à ajouter dans `app-photos.js`).
