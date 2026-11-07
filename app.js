import { lire, construire, empreinte, CANAUX } from "./emv.js";

const VERSION = "0.2.0";
const KEY = "caabi.v1";
const $ = id => document.getElementById(id);
const PAYS = { SN: "Sénégal", CI: "Côte d'Ivoire", ML: "Mali", BF: "Burkina Faso", NE: "Niger", TG: "Togo", BJ: "Bénin", GW: "Guinée-Bissau" };
const CAT = { moi: "à moi", proche: "proche", marchand: "marchand" };

// ---------- Stockage local (localStorage uniquement) ----------
const charger = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { cles: [] }; } catch { return { cles: [] }; } };
let etat = charger();
const sauver = () => localStorage.setItem(KEY, JSON.stringify(etat));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());

// ---------- Petits utilitaires ----------
function toast(msg) {
  const t = $("toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("on"), 2600);
}
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
const court = a => a ? a.slice(0, 8) + "…" + a.slice(-4) : "";
const fcfa = n => new Intl.NumberFormat("fr-FR").format(n) + " F";

// Logo Caabi (la clé) au centre du QR. Correction d'erreur H : le QR reste lisible malgré le logo.
// On n'utilise pas le logo officiel PI-SPI/BCEAO : Caabi est un projet citoyen indépendant.
const LOGO = '<rect width="64" height="64" rx="14" fill="#0b6b4f"/><circle cx="22" cy="32" r="11" fill="none" stroke="#fff" stroke-width="6"/><path d="M33 32h21M46 32v9M53 32v6" stroke="#fff" stroke-width="6" stroke-linecap="round"/>';
const CELL = 8, MARGE = 4;
function faireQr(payload) { const q = qrcode(0, "H"); q.addData(payload); q.make(); return q; }
function qrSvg(payload) {
  const q = faireQr(payload), n = q.getModuleCount(), taille = (n + 2 * MARGE) * CELL;
  const l = Math.round(taille * 0.2), x = (taille - l) / 2, pad = CELL;
  const centre = `<rect x="${x - pad}" y="${x - pad}" width="${l + 2 * pad}" height="${l + 2 * pad}" rx="${pad * 2}" fill="#fff"/>`
    + `<svg x="${x}" y="${x}" width="${l}" height="${l}" viewBox="0 0 64 64">${LOGO}</svg>`;
  return q.createSvgTag({ cellSize: CELL, margin: MARGE, scalable: true }).replace(/<\/svg>\s*$/, centre + "</svg>");
}

// Image à partager : nom, QR avec logo, code de vérification, montant. Fabriquée sur le téléphone, rien n'est envoyé.
function chargerImage(src) { return new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = src; }); }
async function imageCle(c, payload, montant) {
  const W = 1080, H = 1500, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const g = cv.getContext("2d"), font = (w, px) => `${w} ${px}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  g.fillStyle = "#0b6b4f"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#fff"; g.beginPath(); g.roundRect(40, 40, W - 80, H - 80, 48); g.fill();
  g.textAlign = "center"; g.fillStyle = "#14231d";
  g.font = font(800, 64); g.fillText(c.nom.slice(0, 28), W / 2, 150);
  g.fillStyle = "#5b6b64"; g.font = font(500, 34);
  g.fillText([c.app, PAYS[c.pays] || c.pays, "PI-SPI"].filter(Boolean).join(" · "), W / 2, 205);
  const q = faireQr(payload), n = q.getModuleCount(), cote = 860, m = cote / (n + 8), x0 = (W - cote) / 2, y0 = 250;
  g.fillStyle = "#000";
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) g.fillRect(Math.floor(x0 + (k + 4) * m), Math.floor(y0 + (r + 4) * m), Math.ceil(m), Math.ceil(m));
  const l = cote * 0.2, lx = W / 2 - l / 2, ly = y0 + cote / 2 - l / 2;
  g.fillStyle = "#fff"; g.beginPath(); g.roundRect(lx - m, ly - m, l + 2 * m, l + 2 * m, 2 * m); g.fill();
  try { g.drawImage(await chargerImage("icon-512.png"), lx, ly, l, l); } catch {}
  let y = y0 + cote + 70;
  if (montant) { g.fillStyle = "#14231d"; g.font = font(800, 56); g.fillText(fcfa(montant), W / 2, y); y += 70; }
  g.fillStyle = "#14231d"; g.font = font(600, 36); g.fillText(`Code de vérification ${empreinte(c)}`, W / 2, y); y += 70;
  g.fillStyle = "#5b6b64"; g.font = font(500, 30);
  g.fillText("Scanne avec ton app (Wave, Orange Money, banque…)", W / 2, y); y += 42;
  g.fillText("et vérifie le nom affiché avant de payer.", W / 2, y);
  g.font = font(600, 26); g.fillStyle = "#0b6b4f"; g.fillText("Fait avec Caabi · projet citoyen, sans lien avec la BCEAO", W / 2, H - 80);
  return new Promise(ok => cv.toBlob(ok, "image/png"));
}

// ---------- Liste ----------
let onglet = "moi";
function rendre() {
  const q = ($("recherche").value || "").toLowerCase().trim();
  const items = etat.cles
    .filter(c => (onglet === "moi" ? c.cat === "moi" : c.cat !== "moi"))
    .filter(c => !q || c.nom.toLowerCase().includes(q) || (c.app || "").toLowerCase().includes(q))
    .sort((a, b) => (b.vu || b.ajoute) - (a.vu || a.ajoute));
  $("recherche").hidden = onglet !== "carnet";
  const ul = $("liste"); ul.replaceChildren();
  for (const c of items) {
    const li = el("li"), b = el("button", "item");
    b.append(el("span", "av", c.nom.trim().charAt(0).toUpperCase() || "?"));
    const txt = el("span", "txt");
    txt.append(el("b", null, c.nom), el("small", null, [c.cat !== "moi" ? CAT[c.cat] : null, c.app, PAYS[c.pays] || c.pays].filter(Boolean).join(" · ")));
    b.append(txt, el("span", "emp", empreinte(c)));
    b.addEventListener("click", () => ouvrirCle(c.id));
    li.append(b); ul.append(li);
  }
  const vide = $("vide");
  vide.hidden = items.length > 0;
  vide.textContent = q ? "Aucun résultat."
    : onglet === "moi" ? "Aucune clé. Ouvre ton app (Wave, Orange Money, banque), affiche ton QR PI-SPI, fais une capture d'écran puis « Scanner un QR » → « Choisir une image »."
    : "Ton carnet est vide. Scanne le QR PI-SPI d'un proche ou d'un marchand pour l'enregistrer.";
}

document.querySelectorAll(".tabs button").forEach(b => b.addEventListener("click", () => {
  onglet = b.dataset.tab;
  document.querySelectorAll(".tabs button").forEach(x => x.setAttribute("aria-selected", x === b));
  rendre();
}));
$("recherche").addEventListener("input", rendre);

// Fermer les dialogues
document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => b.closest("dialog").close()));

// ---------- Scanner ----------
let flux = null, boucle = null, detecteur = null;
async function initDetecteur() {
  if (detecteur !== null) return detecteur;
  try {
    if ("BarcodeDetector" in window && (await BarcodeDetector.getSupportedFormats()).includes("qr_code")) {
      detecteur = new BarcodeDetector({ formats: ["qr_code"] });
    } else detecteur = false;
  } catch { detecteur = false; }
  return detecteur;
}
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

async function decoder(source, w, h) {
  const det = await initDetecteur();
  if (det) {
    try { const r = await det.detect(source); if (r[0]) return r[0].rawValue; } catch { /* repli jsQR */ }
  }
  const k = Math.min(1, 1000 / Math.max(w, h));
  canvas.width = Math.round(w * k); canvas.height = Math.round(h * k);
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return jsQR(img.data, img.width, img.height, { inversionAttempts: "attemptBoth" })?.data || null;
}

function stopCam() {
  cancelAnimationFrame(boucle); boucle = null;
  if (flux) flux.getTracks().forEach(t => t.stop());
  flux = null;
}

$("btnScan").addEventListener("click", async () => {
  $("dScan").showModal();
  $("scanEtat").textContent = "Ouverture de la caméra…";
  try {
    flux = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
    const v = $("video"); v.srcObject = flux; await v.play();
    $("scanEtat").textContent = "Vise le QR. Tu peux aussi choisir une capture d'écran.";
    let occupe = false;
    const tick = async () => {
      if (!flux) return;
      if (!occupe && v.readyState >= 2) {
        occupe = true;
        const txt = await decoder(v, v.videoWidth, v.videoHeight);
        occupe = false;
        if (txt) { stopCam(); $("dScan").close(); navigator.vibrate?.(60); montrerResultat(txt); return; }
      }
      boucle = requestAnimationFrame(tick);
    };
    tick();
  } catch {
    $("scanEtat").textContent = "Caméra indisponible. Choisis plutôt une capture d'écran du QR.";
  }
});
$("dScan").addEventListener("close", stopCam);

$("fichier").addEventListener("change", async e => {
  const f = e.target.files[0]; e.target.value = "";
  if (!f) return;
  try {
    const bmp = await createImageBitmap(f);
    const txt = await decoder(bmp, bmp.width, bmp.height);
    if (!txt) { $("scanEtat").textContent = "Aucun QR trouvé dans cette image. Recadre la capture autour du QR et réessaie."; return; }
    stopCam(); $("dScan").close(); montrerResultat(txt);
  } catch { $("scanEtat").textContent = "Image illisible."; }
});

// ---------- Résultat ----------
let enCours = null;
function ligne(dl, k, v) { dl.append(el("dt", null, k), el("dd", null, v)); }

function montrerResultat(payload, opts = {}) {
  const r = lire(payload);
  enCours = { r, genere: !!opts.genere };
  const box = $("resInfo"); box.replaceChildren();
  for (const e of r.erreurs) box.append(el("p", "alerte bad", "✕ " + e));
  if (!r.ok) {
    box.append(el("p", "aide", "Les apps affichent parfois leur propre QR (Wave, Orange Money…) qui n'est pas un QR PI-SPI. Cherche dans ton app l'option « PI-SPI » ou « interopérable »."));
    $("fSave").hidden = true; $("hRes").textContent = "QR non reconnu"; $("dRes").showModal(); return;
  }
  $("hRes").textContent = opts.genere ? "QR fabriqué" : "QR PI-SPI valide ✓";
  box.append(el("p", "alerte ok", opts.genere ? "✓ QR construit selon la norme BCEAO." : "✓ Somme de contrôle correcte, schéma PI-SPI reconnu."));
  const deja = etat.cles.filter(c => c.alias === r.alias);
  for (const c of deja) box.append(el("p", "alerte mid", `Cette adresse est déjà enregistrée sous « ${c.nom} ».`));
  for (const a of r.avertissements) box.append(el("p", "alerte mid", "! " + a));
  const dl = el("dl", "details");
  ligne(dl, "Adresse", court(r.alias) + (r.aliasType === "SHID" ? " (SHID)" : ""));
  ligne(dl, "Pays", PAYS[r.pays] || r.pays || "?");
  ligne(dl, "Type", CANAUX[r.canal] || r.canal || "?");
  if (r.montant) ligne(dl, "Montant", fcfa(r.montant));
  if (r.reference) ligne(dl, "Référence", r.reference);
  ligne(dl, "Vérification", empreinte(r));
  box.append(dl);
  box.append(el("p", "aide", "Le nom du titulaire n'est pas dans le QR : ton app l'affichera au moment de payer. Vérifie-le."));
  const f = $("fSave"); f.hidden = false; f.reset();
  f.cat.value = opts.genere ? "moi" : r.canal === "000" ? "marchand" : "proche";
  $("dRes").showModal();
  setTimeout(() => f.nom.focus(), 50);
}

$("fSave").addEventListener("submit", e => {
  if (e.submitter?.value !== "save" || !enCours) return;
  const f = e.target, r = enCours.r;
  // Un QR dynamique ne doit pas être gardé : on enregistre quand même l'adresse, sans montant ni référence.
  const payload = r.canal === "400" ? construire({ alias: r.alias, pays: r.pays || "SN", canal: "000" }) : r.payload;
  const c = { id: uid(), nom: f.nom.value.trim(), cat: f.cat.value, app: f.app.value.trim(), payload, alias: r.alias, pays: r.pays, canal: r.canal === "400" ? "000" : r.canal, genere: enCours.genere, ajoute: Date.now() };
  etat.cles.push(c); sauver();
  onglet = c.cat === "moi" ? "moi" : "carnet";
  document.querySelectorAll(".tabs button").forEach(x => x.setAttribute("aria-selected", x.dataset.tab === onglet));
  rendre(); toast("Enregistré : " + c.nom);
});

// ---------- Ajout manuel ----------
$("btnAjout").addEventListener("click", () => { $("fAjout").reset(); $("ajoutErr").hidden = true; $("dAjout").showModal(); });
$("fAjout").addEventListener("submit", e => {
  if (e.submitter?.value !== "ok") return;
  const f = e.target;
  try {
    const payload = construire({ alias: f.alias.value.trim(), pays: f.pays.value });
    montrerResultat(payload, { genere: true });
  } catch (err) {
    e.preventDefault(); $("ajoutErr").textContent = err.message; $("ajoutErr").hidden = false;
  }
});

// ---------- Affichage d'une clé ----------
let cleOuverte = null, verrou = null, qrAffiche = null;
function dessinerQr(c) {
  const m = Number($("cleMontant").value);
  let payload = c.payload, aide;
  if (c.cat === "moi" && Number.isInteger(m) && m > 0) {
    payload = construire({ alias: c.alias, pays: c.pays || "SN", montant: m, canal: c.canal === "000" ? "000" : "731" });
    aide = `QR avec montant (${fcfa(m)}) fabriqué par Caabi. La personne qui scanne peut encore vérifier avant de payer.`;
  } else {
    aide = c.cat === "moi"
      ? "Montre ce QR à la personne qui te paie. Elle le scanne avec son app."
      : "Pour payer : copie l'adresse et colle-la dans ton app, ou montre ce QR à un autre téléphone. Vérifie le nom affiché avant de valider.";
  }
  $("cleQr").innerHTML = qrSvg(payload);
  qrAffiche = { payload, montant: c.cat === "moi" && Number.isInteger(m) && m > 0 ? m : null };
  $("cleAide").textContent = aide + (c.genere ? " QR construit à partir de l'adresse saisie." : "");
}

async function ouvrirCle(id) {
  const c = etat.cles.find(x => x.id === id); if (!c) return;
  cleOuverte = c; c.vu = Date.now(); sauver();
  $("hCle").textContent = c.nom;
  $("cleSous").textContent = [CAT[c.cat], c.app, PAYS[c.pays] || c.pays, CANAUX[c.canal]].filter(Boolean).join(" · ");
  $("cleEmp").textContent = empreinte(c);
  $("cleMontant").value = "";
  $("cleMontant").closest(".montant-box").hidden = c.cat !== "moi";
  dessinerQr(c);
  $("dCle").showModal();
  try { verrou = await navigator.wakeLock?.request("screen"); } catch { verrou = null; }
}
$("cleMontant").addEventListener("input", () => cleOuverte && dessinerQr(cleOuverte));
$("dCle").addEventListener("close", () => { verrou?.release?.(); verrou = null; rendre(); });

$("btnCopier").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(cleOuverte.alias); toast("Adresse copiée. Colle-la dans ton app."); }
  catch { prompt("Copie l'adresse :", cleOuverte.alias); }
});
$("btnImage").addEventListener("click", async () => {
  const c = cleOuverte; if (!c || !qrAffiche) return;
  const blob = await imageCle(c, qrAffiche.payload, qrAffiche.montant);
  const nomF = "caabi-" + c.nom.normalize("NFD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase() + ".png";
  const f = new File([blob], nomF, { type: "image/png" });
  if (navigator.canShare?.({ files: [f] })) {
    try { await navigator.share({ files: [f], title: c.nom }); return; } catch (e) { if (e.name === "AbortError") return; }
  }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nomF; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast("Image enregistrée");
});
$("btnRenommer").addEventListener("click", () => {
  const n = prompt("Nouveau nom :", cleOuverte.nom);
  if (n && n.trim()) { cleOuverte.nom = n.trim().slice(0, 40); sauver(); $("hCle").textContent = cleOuverte.nom; }
});
$("btnSuppr").addEventListener("click", () => {
  if (!confirm(`Supprimer « ${cleOuverte.nom} » ?`)) return;
  etat.cles = etat.cles.filter(c => c.id !== cleOuverte.id); sauver(); $("dCle").close(); toast("Supprimé");
});

// ---------- Réglages ----------
$("btnMenu").addEventListener("click", () => $("dMenu").showModal());
$("version").textContent = VERSION;
$("btnExport").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ app: "caabi", version: 1, exporte: new Date().toISOString(), cles: etat.cles }, null, 1)], { type: "application/json" });
  const a = el("a"); a.href = URL.createObjectURL(blob); a.download = "caabi-sauvegarde.json"; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast("Fichier enregistré. Garde-le en lieu sûr.");
});
$("fImport").addEventListener("change", async e => {
  const f = e.target.files[0]; e.target.value = ""; if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    let n = 0;
    for (const c of d.cles || []) {
      if (!lire(c.payload).ok || etat.cles.some(x => x.payload === c.payload && x.nom === c.nom)) continue;
      etat.cles.push({ id: uid(), nom: String(c.nom || "Sans nom").slice(0, 40), cat: CAT[c.cat] ? c.cat : "proche", app: String(c.app || "").slice(0, 30), payload: c.payload, alias: lire(c.payload).alias, pays: lire(c.payload).pays, canal: lire(c.payload).canal, genere: !!c.genere, ajoute: c.ajoute || Date.now() });
      n++;
    }
    sauver(); rendre(); toast(n + " clé(s) importée(s)");
  } catch { toast("Fichier invalide"); }
});
$("btnExemple").addEventListener("click", () => {
  $("dMenu").close();
  montrerResultat(construire({ alias: "341c3e1b-4312-49ec-b75e-4c8c74c10fd7", pays: "SN" }), { genere: true });
  $("fSave").nom.value = "Exemple BCEAO (faux compte)";
});
$("btnTout").addEventListener("click", () => {
  if (!confirm("Effacer toutes les clés de ce téléphone ? C'est définitif.")) return;
  etat = { cles: [] }; sauver(); rendre(); $("dMenu").close(); toast("Tout est effacé");
});

// ---------- Hors ligne ----------
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

rendre();
