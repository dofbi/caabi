// Lecture et construction des QR Codes PI-SPI (format EMV « Merchant-Presented Mode »).
// Référence : https://developer.pispi.bceao.int/guides/qr-specifications
// Aucune donnée ne quitte le téléphone : ce module ne fait que du calcul.

export const GUI = "int.bceao.pi";

export const CANAUX = {
  "000": "QR marchand (statique)",
  "400": "QR dynamique (une seule transaction)",
  "731": "QR de transfert (particulier)",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// CRC16-CCITT : polynôme 0x1021, valeur initiale 0xFFFF (ISO/CEI 13239).
export function crc16(str) {
  let crc = 0xffff;
  for (const b of new TextEncoder().encode(str)) {
    crc ^= b << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Découpe une chaîne TLV : ID (2 chiffres) + longueur (2 chiffres) + valeur.
export function tlv(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    const id = s.slice(i, i + 2), len = Number(s.slice(i + 2, i + 4));
    if (!/^\d\d$/.test(id) || !/^\d\d$/.test(s.slice(i + 2, i + 4)) || i + 4 + len > s.length) {
      throw new Error("Structure du QR illisible");
    }
    out.push([id, s.slice(i + 4, i + 4 + len)]);
    i += 4 + len;
  }
  return out;
}

// Analyse un texte lu dans un QR. Renvoie { ok, erreurs[], avertissements[], ... }.
export function lire(payload) {
  const res = { ok: false, payload, erreurs: [], avertissements: [] };
  const p = (payload || "").trim();
  let champs;
  try { champs = tlv(p); } catch (e) { res.erreurs.push("Ce QR n'est pas un QR de paiement (format EMV non reconnu)."); return res; }
  const get = id => champs.find(c => c[0] === id)?.[1];

  // 1. Vérifier le CRC (champ 63, toujours en dernier).
  const last = champs[champs.length - 1];
  if (!last || last[0] !== "63") res.erreurs.push("Somme de contrôle (CRC) absente.");
  else if (crc16(p.slice(0, -4)) !== last[1].toUpperCase()) res.erreurs.push("Somme de contrôle (CRC) fausse : le QR est abîmé ou modifié.");

  // 2. Vérifier que c'est bien le schéma PI (GUI int.bceao.pi dans le champ 36).
  const c36 = get("36");
  let sous36 = [];
  try { sous36 = c36 ? tlv(c36) : []; } catch { /* traité plus bas */ }
  const gui = sous36.find(c => c[0] === "00")?.[1];
  if (gui !== GUI) {
    res.erreurs.push(c36 ? "Ce QR n'est pas un QR PI-SPI (identifiant de schéma différent)." : "Ce QR n'est pas un QR PI-SPI (c'est sans doute le QR propre à une app).");
  }
  res.alias = sous36.find(c => c[0] === "01")?.[1] || null;
  res.aliasType = res.alias && UUID.test(res.alias) ? "SHID" : res.alias ? "autre" : null;

  res.pays = get("58") || null;
  res.devise = get("53") || null;
  res.montant = get("54") ? Number(get("54")) : null;
  let sous62 = [];
  try { sous62 = get("62") ? tlv(get("62")) : []; } catch { res.avertissements.push("Données complémentaires illisibles."); }
  res.reference = sous62.find(c => c[0] === "05")?.[1] || null;
  res.canal = sous62.find(c => c[0] === "11")?.[1] || null;

  if (!res.alias && !res.erreurs.length) res.erreurs.push("Aucune adresse de paiement dans ce QR.");
  if (res.devise && res.devise !== "952") res.avertissements.push("Devise inattendue (" + res.devise + "), le franc CFA est 952.");
  if (res.aliasType === "autre") res.avertissements.push("L'adresse n'a pas le format SHID habituel.");
  if (res.canal === "400") res.avertissements.push("QR dynamique : il sert à une seule transaction. Ne l'enregistre pas.");
  if (res.canal && !CANAUX[res.canal]) res.avertissements.push("Type de QR inconnu (" + res.canal + ").");

  res.ok = res.erreurs.length === 0;
  return res;
}

const f = (id, v) => id + String(v.length).padStart(2, "0") + v;

// Construit un QR de transfert (canal 731) à partir d'une adresse SHID.
export function construire({ alias, pays = "SN", montant = null, reference = null, canal = "731" }) {
  if (!UUID.test(alias || "")) throw new Error("L'adresse de paiement doit être un SHID (36 caractères, format 8-4-4-4-12).");
  if (!/^[A-Z]{2}$/.test(pays)) throw new Error("Code pays invalide.");
  if (reference && reference.length > 25) throw new Error("Référence trop longue (25 caractères maximum).");
  let s = f("00", "01") + f("36", f("00", GUI) + f("01", alias.toLowerCase())) + f("52", "0000") + f("53", "952");
  if (montant) {
    if (!Number.isInteger(montant) || montant <= 0) throw new Error("Montant invalide.");
    s += f("54", String(montant));
  }
  s += f("58", pays) + f("59", "X") + f("60", "X") + f("62", (reference ? f("05", reference) : "") + f("11", canal)) + "6304";
  return s + crc16(s);
}

// Empreinte courte pour comparer deux QR à l'œil (ex. « 0FD7 · 9618 »).
export const empreinte = r => (r.alias || "").replace(/-/g, "").slice(-4).toUpperCase() + " · " + (r.payload || "").slice(-4).toUpperCase();
