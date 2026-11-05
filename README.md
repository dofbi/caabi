# Caabi · trousseau PI-SPI

Caabi (« clé » en wolof) est une petite application web (PWA) pour ranger ses QR Codes PI-SPI et ceux des personnes qu'on paie souvent.

- **Mes clés** : enregistre tes propres QR PI-SPI (Wave, Orange Money, banque…) et affiche-les en grand pour te faire payer, avec un montant si tu veux.
- **Carnet** : scanne et enregistre le QR d'un proche ou d'un marchand.
- **Vérification** : chaque QR est contrôlé (identifiant de schéma `int.bceao.pi` et somme de contrôle CRC16) avant d'être enregistré.

## Ce que Caabi ne fait pas

- **Il ne paie pas.** Le paiement se fait toujours dans l'app de ton opérateur, qui affiche le nom du bénéficiaire.
- **Il n'envoie rien.** Aucun compte, aucun serveur, aucune statistique, aucun script tiers. Les clés sont stockées dans le `localStorage` du navigateur. La politique de sécurité (CSP, voir `netlify.toml`) interdit toute connexion vers un autre site.
- **Il n'a aucun lien** avec la BCEAO ni avec les opérateurs. Projet citoyen.

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
- `emv.js` : lecture, vérification et construction des QR PI-SPI.
- `sw.js` : mise en cache pour l'usage hors ligne.
- `vendor/qrcode.js` : [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) 1.4.4 (MIT).
- `vendor/jsQR.js` : [jsQR](https://github.com/cozmo/jsQR) 1.4.0 (Apache-2.0), utilisé quand le navigateur n'a pas `BarcodeDetector`.

## Licence

MIT, voir `LICENSE`.
