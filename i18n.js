// Langues de Caabi. Le français est la langue source et la langue commune : il reste dans index.html et app.js.
// Chaque langue traduite a son fichier dans langues/ (html + textes). Une chaîne non traduite s'affiche en français.
// Ajouter une langue : copier langues/wo.js, l'importer ci-dessous, passer son statut à « actif ». Voir docs/TRADUIRE.md.
import * as wo from "./langues/wo.js";

const DICTS = { wo };

// Registre : nom écrit dans la langue elle-même, nom en français, statut.
export const LANGUES = {
  fr: { nom: "Français", fr: "français", statut: "actif" },
  pt: { nom: "Português", fr: "portugais", statut: "bientot" },
  wo: { nom: "Wolof", fr: "wolof", statut: "actif" },
  ff: { nom: "Pulaar", fr: "peul", statut: "bientot" },
  srr: { nom: "Seereer", fr: "sérère", statut: "bientot" },
  dyo: { nom: "Joola", fr: "diola", statut: "bientot" },
  mnk: { nom: "Mandinka", fr: "mandingue", statut: "bientot" },
  snk: { nom: "Soninke", fr: "soninké", statut: "bientot" },
  dyu: { nom: "Jula", fr: "dioula", statut: "bientot" },
  bci: { nom: "Wawle", fr: "baoulé", statut: "bientot" },
  bet: { nom: "Bete", fr: "bété", statut: "bientot" },
  sev: { nom: "Senufo", fr: "sénoufo", statut: "bientot" },
  bm: { nom: "Bamanankan", fr: "bambara", statut: "bientot" },
  ses: { nom: "Soŋay", fr: "songhaï", statut: "bientot" },
  tmh: { nom: "Tamajaq", fr: "tamasheq", statut: "bientot" },
  mos: { nom: "Mooré", fr: "mooré", statut: "bientot" },
  gux: { nom: "Gulmancema", fr: "gourmantché", statut: "bientot" },
  ha: { nom: "Hausa", fr: "haoussa", statut: "bientot" },
  dje: { nom: "Zarma", fr: "zarma", statut: "bientot" },
  kr: { nom: "Kanuri", fr: "kanouri", statut: "bientot" },
  ee: { nom: "Eʋegbe", fr: "éwé", statut: "bientot" },
  kbp: { nom: "Kabɩyɛ", fr: "kabiyè", statut: "bientot" },
  fon: { nom: "Fɔngbè", fr: "fon", statut: "bientot" },
  yo: { nom: "Yorùbá", fr: "yoruba", statut: "bientot" },
  bba: { nom: "Baatɔnum", fr: "bariba", statut: "bientot" },
  ddn: { nom: "Dendi", fr: "dendi", statut: "bientot" },
  pov: { nom: "Kriol", fr: "créole bissau-guinéen", statut: "bientot" },
};

// Langues proposées par pays (principales langues nationales). Langue commune : français, sauf Guinée-Bissau (portugais).
export const LANGUES_PAYS = {
  SN: ["wo", "ff", "srr", "dyo", "mnk", "snk"],
  CI: ["dyu", "bci", "bet", "sev"],
  ML: ["bm", "ff", "ses", "tmh", "snk"],
  BF: ["mos", "dyu", "ff", "gux"],
  NE: ["ha", "dje", "ff", "tmh", "kr"],
  TG: ["ee", "kbp"],
  BJ: ["fon", "yo", "bba", "ddn"],
  GW: ["pt", "pov", "ff", "mnk"],
};
export const LANGUE_COMMUNE = { GW: "pt" };

const CLE_LANGUE = "caabi.lang";
export const traduite = l => l === "fr" || !!DICTS[l];
export let LANG = (() => { try { const l = localStorage.getItem(CLE_LANGUE); return traduite(l) ? l : "fr"; } catch { return "fr"; } })();

// Traduit une chaîne française ; repli sur le français si la traduction manque.
export function T(fr, vars = {}) {
  const s = DICTS[LANG]?.textes[fr] || fr;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

// Applique la langue aux éléments marqués dans index.html. Le français d'origine est gardé au premier passage.
export function appliquerHtml(racine = document) {
  document.documentElement.lang = LANG;
  const html = DICTS[LANG]?.html || {};
  for (const [attr, prop] of [["data-i18n", "innerHTML"], ["data-i18n-ph", "placeholder"], ["data-i18n-aria", "aria-label"]]) {
    racine.querySelectorAll(`[${attr}]`).forEach(e => {
      const k = e.getAttribute(attr), memo = "fr_" + attr;
      if (!(memo in e)) e[memo] = prop === "innerHTML" ? e.innerHTML : e.getAttribute(prop);
      const v = html[k] != null ? html[k] : e[memo];
      if (prop === "innerHTML") e.innerHTML = v; else e.setAttribute(prop, v);
    });
  }
}

export function changerLangue(l) {
  LANG = traduite(l) ? l : "fr";
  try { localStorage.setItem(CLE_LANGUE, LANG); } catch {}
  appliquerHtml();
}
