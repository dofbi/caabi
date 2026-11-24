// Couleur choisie par l'utilisateur. Script classique chargé dans <head> pour l'appliquer avant le premier affichage.
// Rien n'est envoyé : la couleur est gardée dans le localStorage du téléphone.
// Les contrastes sont recalculés pour rester lisibles (WCAG 4,5:1), en mode clair comme en mode sombre.
(function () {
  "use strict";
  var CLE = "caabi.couleur", DEFAUT = "#0b6b4f";
  var FOND_CLAIR = "#f6f4ef", FOND_SOMBRE = "#121412";
  var PALETTE = [
    ["#0b6b4f", "Vert Caabi"], ["#1d4ed8", "Bleu"], ["#c2410c", "Orange"], ["#b91c1c", "Rouge"],
    ["#6d28d9", "Violet"], ["#be185d", "Rose"], ["#a16207", "Ocre"], ["#1f2937", "Noir"]
  ];

  function rgb(h) { h = h.replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function hex(c) { return "#" + c.map(function (v) { return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"); }).join(""); }
  function lum(h) {
    var c = rgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contraste(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function melanger(a, b, t) { var x = rgb(a), y = rgb(b); return hex(x.map(function (v, i) { return v + (y[i] - v) * t; })); }
  // Fonce (vers le noir) ou éclaircit (vers le blanc) jusqu'à atteindre le contraste voulu avec le fond.
  function ajuster(c, fond, vers, min) {
    for (var t = 0; t <= 1; t += 0.02) { var x = melanger(c, vers, t); if (contraste(x, fond) >= min) return x; }
    return vers;
  }
  function valide(h) { return typeof h === "string" && /^#[0-9a-f]{6}$/i.test(h); }

  // Calcule les couleurs dérivées. « clair » sert aussi pour les images partagées (fond blanc).
  function calculer(base) {
    base = valide(base) ? base.toLowerCase() : DEFAUT;
    var fort = ajuster(base, FOND_CLAIR, "#000000", 4.5);
    var sombre = ajuster(base, FOND_SOMBRE, "#ffffff", 4.5);
    return {
      base: base,
      clair: { accent: fort, doux: melanger(fort, "#ffffff", 0.86), sur: "#ffffff" },
      sombre: { accent: sombre, doux: melanger(sombre, FOND_SOMBRE, 0.78), sur: contraste(sombre, "#000000") >= contraste(sombre, "#ffffff") ? "#0b0c0b" : "#ffffff" }
    };
  }

  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var actuelle = calculer(lire());

  function lire() { try { return localStorage.getItem(CLE) || DEFAUT; } catch (e) { return DEFAUT; } }
  function poser() {
    var m = media && media.matches ? actuelle.sombre : actuelle.clair, s = document.documentElement.style;
    var meta0 = document.querySelector('meta[name="theme-color"]');
    if (actuelle.base === DEFAUT) { // vert d'origine : on garde les couleurs dessinées à la main dans style.css
      ["--accent", "--accent-soft", "--on-accent"].forEach(function (p) { s.removeProperty(p); });
      if (meta0) meta0.setAttribute("content", DEFAUT);
      return;
    }
    s.setProperty("--accent", m.accent); s.setProperty("--accent-soft", m.doux); s.setProperty("--on-accent", m.sur);
    var meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", actuelle.clair.accent);
  }
  function appliquer(h) {
    actuelle = calculer(h);
    try { localStorage.setItem(CLE, actuelle.base); } catch (e) {}
    poser();
  }
  if (media && media.addEventListener) media.addEventListener("change", poser);
  poser();

  window.CaabiCouleur = {
    PALETTE: PALETTE, DEFAUT: DEFAUT,
    appliquer: appliquer,
    base: function () { return actuelle.base; },
    image: function () { return actuelle.clair; }, // couleurs des images partagées (fond blanc)
    contraste: contraste, calculer: calculer
  };
})();
