# Mon agenda — PWA (GitHub Pages)

Ces fichiers transforment ta page « Mon agenda » en application installable (PWA) qui fonctionne aussi hors ligne.

## Fichiers (tous à la racine du dépôt, sans sous-dossier)

| Fichier | Rôle |
|---|---|
| `index.html` | L'application |
| `manifest.webmanifest` | Nom, couleurs et icônes de l'application |
| `sw.js` | Service worker : fonctionnement hors ligne |
| `icon-192.png`, `icon-512.png` | Icônes |
| `icon-maskable-512.png` | Icône adaptative Android |
| `apple-touch-icon.png` | Icône iPhone / iPad |

## 1. Créer le dépôt dans l'organisation

1. Sur github.com, ouvre ton organisation, puis **Repositories → New repository**.
2. Nom : par exemple `agenda`. Choisis **Public**.
   - GitHub Pages sur un dépôt **privé** d'organisation demande un plan payant (GitHub Enterprise Cloud).
   - Ton agenda n'est pas dans le dépôt : tes notes et photos restent dans ton téléphone. Seule l'application (le code) est publique.
3. Clique **Create repository**.

## 2. Ajouter les fichiers

1. Dans le dépôt : **Add file → Upload files**.
2. Sélectionne les 7 fichiers ci-dessus (ou glisse-les).
3. **Commit changes**.

## 3. Activer GitHub Pages

1. **Settings → Pages**.
2. *Source* : **Deploy from a branch**. *Branch* : `main`, dossier `/ (root)`. **Save**.
3. Attends 1 à 2 minutes. L'adresse est :
   `https://NOM-DE-TON-ORGANISATION.github.io/agenda/`

## 4. Installer sur le téléphone

- **Android (Chrome)** : menu ⋮ → **Installer l'application** (ou *Ajouter à l'écran d'accueil*).
- **iPhone (Safari)** : bouton Partager → **Sur l'écran d'accueil**.

## 5. Récupérer tes données (important)

Les données sont enregistrées **par adresse** : la nouvelle adresse `github.io` démarre vide.

1. Dans l'ancienne version : **Accueil → Sauvegarde et restauration → Sauvegarder** (fichier `.json`).
2. Dans la nouvelle : **Accueil → Sauvegarde et restauration → Restaurer depuis un fichier**.
3. Sur **iPhone**, l'application installée a son propre stockage, séparé de Safari : fais la restauration **depuis l'application installée**.

L'ajout de photos depuis la galerie fonctionne normalement dans cette version.

Fais une sauvegarde régulièrement : le navigateur peut effacer ses données si l'espace manque.

## 6. Publier une mise à jour

1. Remplace `index.html` dans le dépôt (**Add file → Upload files**, même nom).
2. Dans `sw.js`, change `const VERSION = 'v1'` en `'v2'` (puis `'v3'`, etc.).
3. Ferme et rouvre l'application : la nouvelle version se charge.
