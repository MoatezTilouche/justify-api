# 📚 justify-api

Un petit service Node/TypeScript qui aligne (justify) du texte en colonnes de largeur fixe.

Ce README explique l'algorithme, comment l'exécuter localement, et comment le déployer sur Render (avec les astuces pour que le build TypeScript fonctionne correctement).

---

## ✨ Aperçu de l'algorithme

L'algorithme de justification implémente les règles suivantes :

- Normalisation des espaces : conversion des retours Windows `\r\n` en `\n`, suppression des espaces en début/fin de paragraphe et réduction des séquences d'espaces multiples à un seul espace.
- Découpage en paragraphes : les paragraphes sont séparés par au moins une ligne vide (double saut de ligne).
- Construction de lignes : on colle des mots les uns après les autres en remplissant chaque ligne jusqu'à la largeur maximale (par défaut 80 caractères).
- Justification des lignes intermédiaires : pour chaque ligne (sauf la dernière d'un paragraphe), on répartit les espaces entre les mots de façon à atteindre exactement la largeur demandée. Si une ligne ne contient qu'un seul mot, on remplit la droite avec des espaces (padding) pour atteindre la largeur.
- Dernière ligne laissée alignée à gauche : la dernière ligne d'un paragraphe n'est pas entièrement justifiée — elle reste en alignement gauche, avec un seul espace entre les mots.

Fonctions principales dans `src/justify.ts` :

- `normalizeSpaces(input: string): string` — normalise retours de ligne et espaces.
- `justifyLine(words: string[], width: number): string` — calcule la distribution des espaces pour une ligne (remplit si mot unique).
- `justifyParagraph(paragraph: string, width = LINE_WIDTH): string` — découpe un paragraphe en lignes et justifie les lignes intermédiaires.
- `justifyText(input: string, width = LINE_WIDTH): string` — applique tout ça sur le texte complet en gérant les paragraphes.

---

## 🛠️ Exemples d'utilisation (local)

1. Installer les dépendances (incluant devDependencies) :

```powershell
npm ci
```

2. Pour le développement (live reload si vous utilisez `tsx`):

```powershell
npm run dev
```

3. Pour compiler le TypeScript (génère `dist/`) :

```powershell
npm run build
```

4. Pour lancer la version compilée :

```powershell
npm start
```

5. Tester la fonction de justification (ex : importez `justifyText` depuis `src/justify.ts` ou exécutez des tests si configurés).

---

## 🚀 Déploiement sur Render (recommandé)

Render exécute typiquement `npm ci` puis `npm run build` lors du déploiement. Par défaut, certains environnements construisent en mode production et n'installent pas les devDependencies (où se trouvent `typescript` et `@types/*`). Ça provoque des erreurs `tsc` ou des erreurs `Cannot find type definition file for 'jest'`.

Deux options viables :

Option A (recommandée) — utiliser le script `render-build` ajouté au `package.json` :

- Dans Render > Create Web Service > connectez votre repo
- Branch : `master` (ou celle que vous voulez)
- Build Command :

```
npm run render-build
```

- Start Command :

```
npm start
```

Le script `render-build` exécute `npm ci --include=dev && npm run build`, donc TypeScript et les types seront présents pendant la compilation.

Option B — laisser le build tel quel mais forcer npm à installer les devDependencies :

- Dans Render > Settings > Environment > Add variable :
  - `NPM_CONFIG_PRODUCTION` = `false`
- Laissez Build Command à `npm ci && npm run build`.

Les deux solutions fonctionnent ; `render-build` est un fix côté repo, tandis que l'env var est côté Render.

---

## 🧭 Variables d'environnement recommandées

Voici des variables que vous pouvez définir pour le service (dans Render -> Environment) :

- `PORT=3000` — port d'écoute (Render fournit un port via `PORT` automatiquement; l'app doit lire `process.env.PORT`).
- `DATA_DIR=/data` — dossier pour stocker les fichiers si nécessaire.
- `DAILY_LIMIT=80000` — quota quotidien (ex : octets ou tokens) si votre app impose des limites.
- `NODE_ENV=production` — mode d'exécution.

Ces variables n'endommagent pas le déploiement si elles sont définies correctement. Evitez néanmoins de mettre des valeurs contradictoires (ex : mettre `NPM_CONFIG_PRODUCTION=true` si vous utilisez `render-build` qui dépend des devDependencies).

---

## 🩺 Debug & dépannage

- Erreurs `Cannot find type definition file for 'jest'` ou `Could not find a declaration file for module 'express'` :

  - Solution rapide : utilisez `render-build` ou définissez `NPM_CONFIG_PRODUCTION=false` pour que les devDependencies soient installées.
  - Alternative : installer les `@types/*` nécessaires en dependencies (réservé si vous ne voulez pas installer devDeps), ou ajouter des shims `declare module 'express';` (pas recommandé — perte de typage).

- `tsc` n'est pas reconnu localement : installez TypeScript en dev :

```powershell
npm i -D typescript
npx tsc --noEmit
```

- Si `dist/` n'est pas généré ou `npm start` échoue : vérifiez que la commande `npm run build` s'est bien déroulée et que `dist/src/server.js` existe.

---

## 🔒 Sécurité & bonnes pratiques

- Ne mettez pas vos secrets dans le code. Utilisez les variables d'environnement de Render pour les clés et tokens.
- Conservez les types (`@types/*`) en `devDependencies` — ce sont des dépendances de développement.
- Pour les builds reproductibles, gardez `engines` dans `package.json` si vous voulez fixer une version Node.

---

## 🧪 Tests (si configurés)

- Le projet contient des tests dans `tests/` (jest/ts-jest). Pour exécuter les tests localement :

```powershell
npm ci
npm test
```

(Remarque : `npm test` exécute `jest --coverage` si vous avez la configuration prête.)

---

## ❤️ Contribuer

PRs bienvenues. Ouvrez une issue avant les grosses modifications architecturales.

---

