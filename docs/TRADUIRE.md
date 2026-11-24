# Traduire Caabi dans ta langue

Le **français** est la langue commune de Caabi dans les pays de l'UEMOA (le **portugais** en Guinée-Bissau). Chacun peut aussi choisir une langue de son pays. Aujourd'hui, seul le **wolof** est traduit. Les autres langues sont déjà visibles dans l'app (menu ⋯ → Langue), marquées « bientôt ».

Langues prévues (registre `LANGUES_PAYS` dans `i18n.js`) :

| Pays | Langues |
|---|---|
| Sénégal | Wolof ✅, Pulaar, Seereer, Joola, Mandinka, Soninke |
| Côte d'Ivoire | Jula (dioula), Wawle (baoulé), Bete, Senufo |
| Mali | Bamanankan, Pulaar/Fulfulde, Soŋay, Tamajaq, Soninke |
| Burkina Faso | Mooré, Jula, Fulfulde, Gulmancema |
| Niger | Hausa, Zarma, Fulfulde, Tamajaq, Kanuri |
| Togo | Eʋegbe (éwé), Kabɩyɛ |
| Bénin | Fɔngbè, Yorùbá, Baatɔnum (bariba), Dendi |
| Guinée-Bissau | Português (langue commune), Kriol, Fula, Mandinka |

Il manque ta langue ou ton pays ? Ouvre une *issue* sur GitHub.

## Comment proposer une traduction

1. Copie `langues/wo.js` sous le nom `langues/<code>.js` (code BCP 47 : `ff`, `bm`, `mos`, `ha`, `ee`, `fon`…).
2. Traduis **les valeurs**, jamais les clés :
   - `html` : textes de l'écran (les clés viennent des attributs `data-i18n` de `index.html`) ;
   - `textes` : messages de l'app, indexés par la phrase française exacte. Garde les `{variables}` telles quelles.
3. Une phrase oubliée s'affiche en français : tu peux traduire petit à petit.
4. Dans `i18n.js` : ajoute `import * as <code> from "./langues/<code>.js";`, mets-le dans `DICTS`, et passe son `statut` à `"actif"`.
5. Ajoute le fichier à la liste `FILES` de `sw.js` (mode hors ligne).

Pas à l'aise avec GitHub ? Envoie simplement tes traductions dans un tableau (français | ta langue) : on les intégrera.

## Règles de traduction

- **Orthographe officielle** de la langue (pour le wolof : CLAD).
- **Termes techniques** : garde le mot français entre parenthèses la première fois, par exemple « njëg (frais) ».
- **Montants** en chiffres et en F CFA : « 8 000 F ».
- **Ne pas traduire** : PI-SPI, BCEAO, Wave, Orange Money, QR, alias, Caabi.
- **Phrases courtes**, tutoiement comme en français.
- Fais relire par au moins une autre personne qui parle la langue.

Le lexique wolof validé sert de modèle : `docs/lexique-wolof.md` dans le projet PI-SPI.
