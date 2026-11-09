// Traductions de Caabi. Le français est la langue source : il reste dans index.html et app.js.
// WO_HTML : textes de index.html (clé = attribut data-i18n / data-i18n-aria / data-i18n-ph).
// WO : chaînes de app.js et emv.js, indexées par le texte français exact ; {x} = variable.
// Wolof : orthographe officielle (CLAD), lexique validé dans docs/lexique-wolof.md du projet PI-SPI.

export const LANGUES = { fr: "Français", wo: "Wolof" };
const CLE_LANGUE = "caabi.lang";

export let LANG = (() => { try { return localStorage.getItem(CLE_LANGUE) === "wo" ? "wo" : "fr"; } catch { return "fr"; } })();

export const WO_HTML = {
  sousTitre: "Sa caabi PI-SPI · dara du génn sa telefon",
  ariaConseils: "Ay digle ngir fey njëg yu néew",
  ariaMenu: "Réglages ak xibaar",
  tabMoi: "Samay caabi",
  tabCarnet: "Sama téere",
  phRecherche: "Seet benn tur…",
  ariaRecherche: "Seet ci sama téere",
  btnScan: "📷 Jàng QR bi (scanner)",
  btnAjout: "＋ Yokk",
  hScan: "Jàng QR PI-SPI (scanner)",
  scanAide: "Jublul QR bi. Man nga tànn itam benn capture d'écran.",
  choisirImage: "🖼️ Tànn benn nataal",
  annuler: "Neenal",
  nom: "Tur",
  phNom: "ex. Tata Awa, Bitigu Modou, Sama Wave",
  cestA: "Mooy…",
  catMoi: "sama bos",
  catProche: "benn mbokk",
  catMarchand: "benn jaaykat",
  compteApp: "Kont / app",
  phApp: "ex. Wave, Orange Money, Ecobank (bu la neexee)",
  enregistrer: "Denc",
  hAjout: "Yokk ak adresse de paiement",
  ajoutAide: "Sa app (Wave, Orange Money, bànk…) man na wone sa <b>adresse de paiement PI-SPI</b> : 36 araf, ni <code>341c3e1b-4312-49ec-b75e-4c8c74c10fd7</code>. Taqal ko fii, Caabi dina defar QR bi ni BCEAO tëralee.",
  adresseShid: "Adresse de paiement (SHID)",
  paysCompte: "Réewu kont bi",
  continuer: "Dem ci kanam",
  ariaFermer: "Tëj",
  codeVerif: "Kood vérification",
  montantDemande: "Xaalis bi nga laaj (bu la neexee)",
  monLogo: "🏪 Sama logo",
  logoRetirer: "Delloo logo Caabi",
  affiche: "Afiisu bitig : yokk « Fey ma ci PI-SPI, 8 000 F bés bu nekk, amul fey » ci nataal bi",
  logoAide: "Defal logo sa bitig, du logo benn réseau walla BCEAO. Mu ngi des ci sa telefon.",
  partager: "📤 Séddoo nataal bi",
  copier: "📋 Copi adresse bi",
  renommer: "✏️ Soppi tur bi",
  supprimer: "🗑️ Far",
  hConseils: "💡 Fey njëg yu néew ak PI-SPI",
  conseilsIntro: "Ay digle la, du ay sàrt. Lim yi jóge nañu ci <a href=\"https://observatoire-pispi.netlify.app\" rel=\"noopener\">Observatoire des frais PI-SPI</a> (seetkat yi).",
  ariaDuo: "Ay digle ngir jaay ak ngir jënd",
  star: "⭐ <b>Tànnal réseau yi amul fey.</b> 0&nbsp;F ci yónnee : <b>Orange Money, app Ecobank, ay bànk</b>. Bu jaaykat yi ak jëndkat yi bokkee ci réseau yu amul fey, ñépp dinañu fey lu néew.",
  hVendez: "🏪 Dangay jaay",
  hAchetez: "🛒 Dangay jënd",
  v1: "<b>Wonel sa QR PI-SPI</b> ci sa kontuwaar te séddoo ko.",
  a1: "<b>Laajal QR PI-SPI</b> bu jaaykat bi te fey ak sa app.",
  v2: "<b>Jot xaalis diggante nit ku nekk : 0&nbsp;F</b> (BCEAO). Kont <b>jaaykat</b> : amul sàrt bu ñu siiwal, njëg man na am. Laajal sa réseau.",
  a2: "<b>0&nbsp;F ba 8&nbsp;000&nbsp;F</b> yu nga yónnee bés bu nekk, ak bépp app.",
  v3: "<b>Feyal say fournisseurs</b> ak kont bu amul fey : Orange Money, Ecobank, bànk yi.",
  a3: "<b>Lu ëpp 8&nbsp;000&nbsp;F</b>, feyal ak réseau bu amul fey : Orange Money, Ecobank, bànk. Wave : 0,94&nbsp;%.",
  v4: "<b>Bul faral di génne xaalis</b> : génne xaalis, 1&nbsp;% (benn ci téeméer) la ca ajaŋ ba.",
  a4: "<b>Feyal ak sa app</b>, bañ a génne xaalis.",
  v5: "<b>Seetal</b> xaalis bi nga jot te denc SMS bi.",
  a5: "<b>Jàngal « Frais »</b> ak tur bi balaa ngay dëggal. Du 0&nbsp;F ? Neenal.",
  conseilsFin: "Njëg yi man nañu soppiku saa su nekk : li sa écran wone moo wóor. Seetal sa relevé, du écran bi rekk.",
  fermer: "Tëj",
  menuIntro: "Caabi (« clé » ci wolof) dafay denc say QR PI-SPI ak yu nit ñi nga faral di fey.",
  menuP1: "<b>Dara du yónneeku</b> : amul kont, amul serveur, amul statistik. Say caabi ngi des ci navigateur bii.",
  menuP2: "<b>Caabi du fey</b> : dafay wone walla jàng QR. Fey bi ci sa app lay ame (Wave, Orange Money, bànk…).",
  menuP3: "<b>Balaa ngay fey</b>, seetal tur bi sa app wone.",
  menuP4: "Liggéeyu askan wi, amul benn lëkkalloo ak BCEAO walla réseau yi.",
  langue: "Làkk",
  hSauvegarde: "Denc ab copie",
  sauvegardeAide: "Boo soppee telefon walla nga far navigateur bi, say caabi dinañu réer. Dencal ab copie.",
  exporter: "⬇️ Génne samay caabi (exporter)",
  importer: "⬆️ Dugal (importer)",
  hTester: "Seet",
  exemple: "Wone benn QR misaal",
  toutEffacer: "Far lépp",
  codeSource: "Kood bi ubbi na : <a href=\"https://github.com/dofbi/caabi\" id=\"lienCode\" rel=\"noopener\">github.com/dofbi/caabi</a> · version <span id=\"version\"></span>",
};

export const WO = {
  // Catégories et types de QR
  "à moi": "sama bos", "proche": "mbokk", "marchand": "jaaykat",
  "QR marchand (statique)": "QR jaaykat (statique)",
  "QR dynamique (une seule transaction)": "QR dynamique (benn fey rekk)",
  "QR de transfert (particulier)": "QR yónnee (nit ku nekk)",
  // Liste
  "Aucun résultat.": "Amul dara.",
  "Aucune clé. Ouvre ton app (Wave, Orange Money, banque), affiche ton QR PI-SPI, fais une capture d'écran puis « Scanner un QR » → « Choisir une image ».":
    "Amoo benn caabi. Ubbil sa app (Wave, Orange Money, bànk), wonel sa QR PI-SPI, defal capture d'écran, ba noppi « Jàng QR bi » → « Tànn benn nataal ».",
  "Ton carnet est vide. Scanne le QR PI-SPI d'un proche ou d'un marchand pour l'enregistrer.":
    "Sa téere amul dara. Jàngal QR PI-SPI bu benn mbokk walla benn jaaykat ngir denc ko.",
  // Scanner
  "Ouverture de la caméra…": "Ñungi ubbi caméra bi…",
  "Vise le QR. Tu peux aussi choisir une capture d'écran.": "Jublul QR bi. Man nga tànn itam benn capture d'écran.",
  "Caméra indisponible. Choisis plutôt une capture d'écran du QR.": "Caméra bi jàppul. Tànnal benn capture d'écran bu QR bi.",
  "Aucun QR trouvé dans cette image. Recadre la capture autour du QR et réessaie.":
    "Gisuñu benn QR ci nataal bii. Wàññil nataal bi ba QR bi rekk des, te jéemaat.",
  "Image illisible.": "Nataal bi jàngu wul.",
  "Image illisible": "Nataal bi jàngu wul",
  // Résultat
  "Les apps affichent parfois leur propre QR (Wave, Orange Money…) qui n'est pas un QR PI-SPI. Cherche dans ton app l'option « PI-SPI » ou « interopérable ».":
    "Yenn app yi dañuy wone seen QR (Wave, Orange Money…), te du QR PI-SPI. Seetal ci sa app « PI-SPI » walla « interopérable ».",
  "QR non reconnu": "QR bi xamuñu ko",
  "QR fabriqué": "QR bi defar nañu ko",
  "QR PI-SPI valide ✓": "QR PI-SPI bi wóor na ✓",
  "✓ QR construit selon la norme BCEAO.": "✓ QR bi defar nañu ko ni BCEAO tëralee.",
  "✓ Somme de contrôle correcte, schéma PI-SPI reconnu.": "✓ Somme de contrôle baax na, QR PI-SPI la.",
  "Cette adresse est déjà enregistrée sous « {nom} ».": "Adresse bii denc nañu ko ba noppi ci « {nom} ».",
  "Adresse": "Adresse", "Pays": "Réew", "Type": "Xeet", "Montant": "Xaalis bi", "Référence": "Référence", "Vérification": "Kood vérification",
  "Le nom du titulaire n'est pas dans le QR : ton app l'affichera au moment de payer. Vérifie-le.":
    "Turu boroom kont bi nekkul ci QR bi : sa app dina ko wone bu ngay fey. Seetal ko.",
  "Enregistré : {nom}": "Denc nañu ko : {nom}",
  // Messages de emv.js
  "Structure du QR illisible": "QR bi jàngu wul",
  "Ce QR n'est pas un QR de paiement (format EMV non reconnu).": "QR bii du QR fey (format EMV xamuñu ko).",
  "Somme de contrôle (CRC) absente.": "Somme de contrôle (CRC) amul.",
  "Somme de contrôle (CRC) fausse : le QR est abîmé ou modifié.": "Somme de contrôle (CRC) baaxul : QR bi yàqu na walla soppi nañu ko.",
  "Ce QR n'est pas un QR PI-SPI (identifiant de schéma différent).": "QR bii du QR PI-SPI (identifiant bi wuute na).",
  "Ce QR n'est pas un QR PI-SPI (c'est sans doute le QR propre à une app).": "QR bii du QR PI-SPI (xéy na QR bu benn app la).",
  "Données complémentaires illisibles.": "Yenn xibaar yi jàngu wuñu.",
  "Aucune adresse de paiement dans ce QR.": "Amul benn adresse de paiement ci QR bii.",
  "L'adresse n'a pas le format SHID habituel.": "Adresse bi amul format SHID bi ñu xam.",
  "QR dynamique : il sert à une seule transaction. Ne l'enregistre pas.": "QR dynamique : benn fey rekk lay def. Bul ko denc.",
  "L'adresse de paiement doit être un SHID (36 caractères, format 8-4-4-4-12).": "Adresse de paiement bi war na doon SHID (36 araf, format 8-4-4-4-12).",
  "Code pays invalide.": "Kood réew bi baaxul.",
  "Montant invalide.": "Xaalis bi baaxul.",
  "Référence trop longue (25 caractères maximum).": "Référence bi dafa gudd (25 araf rekk).",
  // Affichage d'une clé
  "QR avec montant ({m}) fabriqué par Caabi. La personne qui scanne peut encore vérifier avant de payer.":
    "QR ak xaalis ({m}), Caabi moo ko defar. Ki koy jàng man na seet balaa muy fey.",
  "Montre ce QR à la personne qui te paie. Elle le scanne avec son app.": "Wonel QR bii ki lay fey. Dina ko jàng ak app am.",
  "Pour payer : copie l'adresse et colle-la dans ton app, ou montre ce QR à un autre téléphone. Vérifie le nom affiché avant de valider.":
    "Ngir fey : copil adresse bi te taqal ko ci sa app, walla wonel QR bii beneen telefon. Seetal tur bi balaa ngay dëggal.",
  " QR construit à partir de l'adresse saisie.": " QR bi defar nañu ko ak adresse bi nga bind.",
  "Adresse copiée. Colle-la dans ton app.": "Adresse bi copi nañu ko. Taqal ko ci sa app.",
  "Copie l'adresse :": "Copil adresse bi :",
  "Image enregistrée": "Nataal bi denc nañu ko",
  "Logo ajouté. Vérifie que le QR se scanne bien.": "Logo bi yokk nañu ko. Seetal ndax QR bi mun nañu koy jàng.",
  "Logo Caabi remis": "Logo Caabi delsi na",
  "Nouveau nom :": "Tur bu bees :",
  "Supprimer « {nom} » ?": "Far « {nom} » ?",
  "Supprimé": "Far nañu ko",
  // Image partagée et affiche
  "Code de vérification {code}": "Kood vérification {code}",
  "Scanne avec ton app (Wave, Orange Money, banque…)": "Jàngal ko ak sa app (Wave, Orange Money, bànk…)",
  "et vérifie le nom affiché avant de payer.": "te seetal tur bi balaa ngay fey.",
  "Payez-moi par PI-SPI": "Fey ma ci PI-SPI",
  "depuis Wave, Orange Money ou votre banque": "ak Wave, Orange Money walla sa bànk",
  "0 F de frais jusqu'à 8 000 F par jour": "8 000 F bés bu nekk, amul fey",
  "Règle BCEAO · vérifiez les frais sur votre écran avant de valider": "Sàrtu BCEAO · seetal frais yi ci sa écran balaa ngay dëggal",
  "Fait avec Caabi · projet citoyen, sans lien avec la BCEAO": "Ak Caabi · liggéeyu askan wi, amul lëkkalloo ak BCEAO",
  // Réglages
  "Fichier enregistré. Garde-le en lieu sûr.": "Fichier bi denc nañu ko. Dencal ko fu wóor.",
  "{n} clé(s) importée(s)": "{n} caabi dugg nañu",
  "Fichier invalide": "Fichier bi baaxul",
  "Exemple BCEAO (faux compte)": "Misaal BCEAO (kont bu dëggul)",
  "Effacer toutes les clés de ce téléphone ? C'est définitif.": "Far say caabi yépp ci telefon bii ? Doo ko mana delloo.",
  "Tout est effacé": "Lépp far nañu ko",
};

// Traduit une chaîne française ; repli sur le français si la traduction manque.
export function T(fr, vars = {}) {
  const s = (LANG === "wo" && WO[fr]) || fr;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

// Applique la langue aux éléments marqués dans index.html. Le français d'origine est gardé au premier passage.
export function appliquerHtml(racine = document) {
  document.documentElement.lang = LANG;
  for (const [attr, prop] of [["data-i18n", "innerHTML"], ["data-i18n-ph", "placeholder"], ["data-i18n-aria", "aria-label"]]) {
    racine.querySelectorAll(`[${attr}]`).forEach(e => {
      const k = e.getAttribute(attr), memo = "fr_" + attr;
      if (!(memo in e)) e[memo] = prop === "innerHTML" ? e.innerHTML : e.getAttribute(prop);
      const v = LANG === "wo" && WO_HTML[k] != null ? WO_HTML[k] : e[memo];
      if (prop === "innerHTML") e.innerHTML = v; else e.setAttribute(prop, v);
    });
  }
}

export function changerLangue(l) {
  LANG = l === "wo" ? "wo" : "fr";
  try { localStorage.setItem(CLE_LANGUE, LANG); } catch {}
  appliquerHtml();
}
