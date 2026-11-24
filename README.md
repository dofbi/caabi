# Caabi · trousseau PI-SPI

Caabi (« clé » en wolof) est une petite application web (PWA) pour ranger ses QR Codes PI-SPI et ceux des personnes qu'on paie souvent.

- **Mes clés** : enregistre tes propres QR PI-SPI (Wave, Orange Money, banque…) et affiche-les en grand pour te faire payer, avec un montant si tu veux.
- **Carnet** : scanne et enregistre le QR d'un proche ou d'un marchand.
- **Partager l'image** : exporte une image prête à envoyer (nom, QR avec le logo Caabi au centre, montant, code de vérification), fabriquée sur le téléphone. Le QR utilise la correction d'erreur H pour rester lisible malgré le logo.
- **Logo de ta boutique** : remplace le logo Caabi au centre de ton QR par le tien (image réduite à 192 px, gardée sur le téléphone).
- **Affiche boutique** : ajoute à l'image « Payez-moi par PI-SPI, 0 F de frais jusqu'à 8 000 F par jour » (règle BCEAO), à imprimer ou partager.
- **Ma carte 🪪** : plusieurs de tes clés (Wave, Orange Money, banque…) sur une seule image à envoyer sur WhatsApp. Comme un lien de profil, mais sans serveur : l'image est fabriquée sur le téléphone, sans numéro de téléphone.
- **Conseils 💡** : ce qu'il faut faire pour payer moins de frais quand on vend ou quand on achète, d'après l'[Observatoire des frais PI-SPI](https://observatoire-pispi.org).
- **Wolof** : toute l'app existe en wolof (orthographe officielle, mot français entre parenthèses pour les termes techniques). Choix de la langue dans le menu ⋯, gardé sur le téléphone.
- **Vérification** : chaque QR est contrôlé (identifiant de schéma `int.bceao.pi` et somme de contrôle CRC16) avant d'être enregistré.

## Ce que Caabi ne fait pas

- **Il ne paie pas.** Le paiement se fait toujours dans l'app de ton opérateur, qui affiche le nom du bénéficiaire.
- **Il n'envoie rien.** Aucun compte, aucun serveur, aucune statistique, aucun script tiers. Les clés sont stockées dans le `localStorage` du navigateur. La politique de sécurité (CSP, voir `netlify.toml`) interdit toute connexion vers un autre site.
- **Il n'a aucun lien** avec la BCEAO ni avec les opérateurs. Projet citoyen.

## Pourquoi c'est sûr (en clair)

Aussi expliqué dans l'app (bouton 🛡️) :

- **Pas de compte** : pas d'e-mail, pas de mot de passe, rien à pirater.
- **Rien ne sort du téléphone** : pas de serveur ni de statistiques ; la CSP bloque toute connexion vers un autre site.
- **Code public** (MIT) : chacun peut vérifier.
- **Pas de nom dans le QR** : seulement l'adresse de paiement (champs nom et ville à `X`).
- **Chaque QR est vérifié** (schéma `int.bceao.pi` + CRC16) avant d'être enregistré.
- **Caabi ne paie jamais** : le paiement se fait dans l'app de l'opérateur, qui affiche le vrai nom.
- **Pas de logo BCEAO** : pas d'apparence officielle.
- **Le revers** : perdre le téléphone, c'est perdre ses clés. D'où l'export JSON, l'installation, et la demande `navigator.storage.persist()` au premier enregistrement.

## Installer sur son téléphone

L'app propose elle-même la bonne méthode (bandeau fermable, section 📲 du menu ⋯) :

- **Android** (Chrome, Samsung Internet, Edge) : bouton « Installer » (événement `beforeinstallprompt`), ou menu ⋮ → « Installer l'application ».
- **iPhone** (Safari) : ⬆️ Partager → « Sur l'écran d'accueil » → « Ajouter ». Installée, Caabi échappe à l'effacement automatique des données de site par Safari.
- **Lien ouvert dans WhatsApp, X, Facebook…** : l'app le détecte et propose de copier le lien pour l'ouvrir dans Chrome ou Safari.

Seul le type de navigateur est lu (user-agent) pour choisir le message ; rien n'est envoyé.

## Format du QR

Le QR PI-SPI suit la norme EMV « Merchant-Presented Mode » décrite par la BCEAO :
<https://developer.pispi.bceao.int/guides/qr-specifications>

| Champ | Contenu |
|---|---|
| 00 | `01` (version) |
| 36 | sous-champ 00 = `int.bceao.pi`, sous-champ 01 = adresse de paiement (SHID, 36 caractères) |
| 52 / 53 | `0000` / `952` (franc CFA) |
| 54 | montant (facultatif) |
| 58 | pays (SN, CI, ML…) |
| 59 / 60 | `X` / `X` (aucune donnée personnelle) |
| 62 | sous-champ 05 = référence (facultatif), sous-champ 11 = canal (`000` marchand, `400` dynamique, `731` transfert) |
| 63 | CRC16-CCITT (polynôme 0x1021, valeur initiale 0xFFFF) |

Le code de lecture et de construction est dans `emv.js`, sans dépendance. Il est vérifié sur l'exemple officiel de la BCEAO (CRC attendu `9618`).

## Lancer en local

```sh
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

La caméra ne fonctionne qu'en HTTPS ou sur `localhost`.

## Fichiers

- `index.html`, `style.css`, `app.js` : l'interface.
- `i18n.js` : traductions wolof. Le français reste dans `index.html` et `app.js` ; les chaînes wolof sont indexées par le texte français (repli sur le français si une traduction manque).
- `emv.js` : lecture, vérification et construction des QR PI-SPI.
- `sw.js` : mise en cache pour l'usage hors ligne.
- `vendor/qrcode.js` : [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) 1.4.4 (MIT).
- `vendor/jsQR.js` : [jsQR](https://github.com/cozmo/jsQR) 1.4.0 (Apache-2.0), utilisé quand le navigateur n'a pas `BarcodeDetector`.

## Licence

MIT, voir `LICENSE`.
