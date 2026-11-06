/* Eén login voor alle clubpagina's.
   Elke onderliggende pagina laadt dit script als eerste. Zonder clubsessie gaat de bezoeker naar de
   startpagina om aan te melden, en daarna terug naar de pagina waar hij was. De beveiliging zelf zit in
   de database (elke functie controleert de sessie); dit script regelt enkel de navigatie. */
(function () {
  var SLEUTEL = "btc-club-token", LADDER = "ladder_token";
  var API = "https://povgjkvmzfrhhaxfanwn.supabase.co/rest/v1/rpc/";
  var KEY = "sb_publishable_LfcbY6X1DgOBFW1rH3Umnw__RdObpur";
  function lees(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function wis(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function hier() {
    var d = location.pathname.split("/").filter(Boolean);
    var map = d.length && /\.html$/.test(d[d.length - 1]) ? d.slice(-2).join("/") : (d.slice(-1)[0] || "") + "/";
    return map + location.hash;
  }
  function naarLogin() {
    wis(SLEUTEL); wis(LADDER);
    location.replace("../?terug=" + encodeURIComponent(hier()));
  }
  function post(fn, args) {
    return fetch(API + fn, { method: "POST", keepalive: true, headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, body: JSON.stringify(args) }).catch(function () {});
  }
  function afmelden() {
    var c = lees(SLEUTEL), l = lees(LADDER);
    var klaar = [];
    if (c) klaar.push(post("club_logout", { p_token: c }));
    if (l) klaar.push(post("ladder_logout", { p_token: l }));
    wis(SLEUTEL); wis(LADDER); wis("btc-voorbeeld");
    Promise.all(klaar).then(function () { location.href = "../"; });
  }
  /* Voorbeeldmodus ("Bekijk als rol", enkel beheerders). De rol staat op de sessie in de database;
     de browser onthoudt ze alleen om de balk te tonen. De startpagina ververst dit bij elk bezoek. */
  var VB = "btc-voorbeeld", NAMEN = { lid: "lid", kapitein: "kapitein", trainer: "trainer", hoofdcoach: "hoofdcoach", commissie: "commissielid", bestuur: "bestuurslid" };
  function zet(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  function voorbeeldStop() {
    var c = lees(SLEUTEL); zet(VB, null);
    var p = c ? post("club_voorbeeld", { p_token: c, p_rol: null }) : Promise.resolve();
    p.then(function () { location.reload(); });
  }
  function voorbeeldBalk(rol) {
    var oud = document.getElementById("btcVoorbeeld"); if (oud) oud.remove();
    if (!rol || !NAMEN[rol]) return;
    var b = document.createElement("div"); b.id = "btcVoorbeeld"; b.setAttribute("role", "status");
    b.style.cssText = "position:sticky;top:0;z-index:999;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;"
      + "background:#C5E75A;color:#152B46;font:600 14px Montserrat,system-ui,sans-serif;padding:8px 16px;border-bottom:2px solid #435B28";
    b.innerHTML = "<span>Voorbeeld: je ziet de app als <b>" + NAMEN[rol] + "</b>. Opslaan staat uit.</span>";
    var k = document.createElement("button"); k.type = "button"; k.textContent = "Voorbeeld stoppen";
    k.style.cssText = "font:700 13px Montserrat,system-ui,sans-serif;background:#152B46;color:#F3F1E9;border:0;border-radius:6px;padding:5px 10px;cursor:pointer";
    k.addEventListener("click", voorbeeldStop); b.appendChild(k);
    (document.body ? Promise.resolve() : new Promise(function (r) { document.addEventListener("DOMContentLoaded", r); }))
      .then(function () { document.body.insertBefore(b, document.body.firstChild); });
  }
  window.BTC = { token: lees(SLEUTEL), naarLogin: naarLogin, afmelden: afmelden, voorbeeldBalk: voorbeeldBalk, voorbeeldStop: voorbeeldStop };
  if (window.BTC_START) return;            // startpagina: zelf aanmelden, balk via club_mij
  if (window.BTC_PUBLIEK) { if (window.BTC.token) { voorbeeldBalk(lees(VB)); zijbalk(); } }  // publieke pagina: geen doorverwijzing
  else if (!window.BTC.token) naarLogin();
  else { voorbeeldBalk(lees(VB)); zijbalk(); }

  /* Pc-indeling voor de onderliggende pagina's (vanaf 1024 px, enkel aangemeld):
     links altijd Mijn padel en Clubkalender (360 px), rechts de pagina zelf. Op smallere schermen
     verandert er niets: de zijbalk is dan verborgen en de inhoud staat zoals voorheen. */
  function zijbalk() {
    var klaar = function () {
      var body = document.body, wrap, kop = null, inhoudBron;
      var hoofd = document.querySelector("main > .wrap");
      if (hoofd) { wrap = hoofd; inhoudBron = hoofd; }                       // kop en inhoud elk in een eigen .wrap
      else { wrap = document.querySelector("body > .wrap"); if (!wrap) return;
             kop = wrap.querySelector(":scope > header, :scope > .top"); inhoudBron = wrap; }
      var raster = document.createElement("div"); raster.className = "btc-raster";
      var zij = document.createElement("aside"); zij.className = "btc-zij"; zij.setAttribute("aria-label", "Mijn padel en clubkalender");
      var inhoud = document.createElement("div"); inhoud.className = "btc-inhoud";
      Array.prototype.slice.call(inhoudBron.childNodes).forEach(function (n) {
        if (n === kop || (n.nodeType === 1 && (n.matches("nav.terug") || n.tagName === "SCRIPT"))) return;
        inhoud.appendChild(n);
      });
      zij.innerHTML = kaart("week", "Mijn padel", '<span class="btc-sub" id="btcWeekSub">' + dagenTekst(dagen()) + '</span>',
          '<div id="btcWeekTe" hidden><p class="btc-groep">Te doen</p><div class="btc-lijst" id="btcWeekTeLijst"></div></div>' +
          '<div id="btcWeekPlan" hidden><p class="btc-groep">Gepland</p><div class="btc-lijst" id="btcWeekPlanLijst"></div></div>' +
          '<p class="btc-noot" id="btcWeekNoot">Laden…</p>') +
        kaart("kalender", "Clubkalender", "", '<p class="btc-noot">Hier komen binnenkort de belangrijke clubdata.</p>');
      raster.appendChild(zij); raster.appendChild(inhoud); inhoudBron.appendChild(raster);
      body.classList.add("btc-indeling");
      stijl(); inklappen(zij); laadWeek();
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", klaar); else setTimeout(klaar, 0);
  }
  var PIJL = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>';
  function kaart(id, titel, extra, inhoud) {
    return '<section class="btc-kaart" data-btc-kl="' + id + '" aria-label="' + titel + '"><div class="btc-kop"><h2>' + titel + '</h2>' + extra +
      '<button type="button" class="btc-knop" aria-expanded="true" aria-label="Dichtklappen: ' + titel + '">' + PIJL + '</button></div>' +
      '<div class="btc-body">' + inhoud + '</div></section>';
  }
  function staat() { try { return JSON.parse(localStorage.getItem("btc-kl") || "null") || {}; } catch (e) { return {}; } }
  function inklappen(zij) {
    zij.querySelectorAll("[data-btc-kl]").forEach(function (k) {
      var id = k.getAttribute("data-btc-kl"), b = k.querySelector(".btc-knop"), titel = k.getAttribute("aria-label");
      var zet = function (d) { k.classList.toggle("dicht", d); b.setAttribute("aria-expanded", String(!d)); b.setAttribute("aria-label", (d ? "Openklappen: " : "Dichtklappen: ") + titel); };
      zet(!!staat()[id]);
      b.addEventListener("click", function () { var s = staat(); s[id] = !s[id]; try { localStorage.setItem("btc-kl", JSON.stringify(s)); } catch (e) {} zet(s[id]); });
    });
  }
  function dagen() { var d = 7; try { d = parseInt(localStorage.getItem("btc-dagen"), 10) || 7; } catch (e) {} return [3, 7, 14, 30].indexOf(d) >= 0 ? d : 7; }
  function dagenTekst(d) { return d === 7 ? "komende week" : d === 14 ? "komende 2 weken" : d === 30 ? "komende maand" : "komende " + d + " dagen"; }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function link(u) { if (!u) return "#"; return /^(https?:|\/|#|\.\.\/)/.test(u) ? u : "../" + u; }
  var SOORT = { interclub: "Interclub", les: "Les", ladder: "Ladder" };
  function wk(x) {
    var dag = "", uur = "";
    if (x.wanneer) { var d = new Date(x.wanneer); dag = d.toLocaleDateString("nl-BE", { weekday: "short" }).replace(".", ""); uur = d.toLocaleDateString("nl-BE", { day: "numeric", month: "numeric" }) + " " + x.wanneer.slice(11, 16); }
    return '<a class="btc-wk' + (x.thuis ? " thuis" : "") + '" href="' + esc(link(x.url)) + '"><div class="btc-dag"><b>' + esc(dag || "—") + "</b><span>" + esc(uur) + "</span></div>" +
      '<div class="btc-soort">' + esc(SOORT[x.soort] || x.soort) + '</div><div class="btc-tt">' + esc(x.titel) + "</div>" +
      (x.detail ? '<div class="btc-dt">' + esc(x.detail) + "</div>" : "") + (x.actie ? '<span class="btc-actie">' + esc(x.actie) + "</span>" : "") + "</a>";
  }
  function laadWeek() {
    var tok = lees(SLEUTEL), noot = document.getElementById("btcWeekNoot");
    fetch(API + "club_mijn_week", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_token: tok, p_dagen: dagen() }) })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (!r || r.fout || !r.items) { noot.textContent = "Niet beschikbaar."; return; }
        var te = r.items.filter(function (x) { return x.actie; }), plan = r.items.filter(function (x) { return !x.actie; });
        document.getElementById("btcWeekTeLijst").innerHTML = te.map(wk).join(""); document.getElementById("btcWeekTe").hidden = !te.length;
        document.getElementById("btcWeekPlanLijst").innerHTML = plan.map(wk).join(""); document.getElementById("btcWeekPlan").hidden = !plan.length;
        noot.hidden = r.items.length > 0; noot.textContent = "Niets gepland in deze periode en geen openstaande acties.";
      })
      .catch(function () { noot.textContent = "De server antwoordt niet."; });
  }
  function stijl() {
    var css = ":root{--btc-groen:#435B28;--btc-op-groen:#FFFFFF}" +
      "@media (prefers-color-scheme:dark){:root:not([data-theme=\"light\"]){--btc-groen:#C5E75A;--btc-op-groen:#152B46}}" +
      ":root[data-theme=\"dark\"]{--btc-groen:#C5E75A;--btc-op-groen:#152B46}" +
      ".btc-zij{display:none}.btc-raster,.btc-inhoud{display:contents}" +
      "@media (min-width:1024px){" +
      "body.btc-indeling>.wrap,body.btc-indeling header>.wrap,body.btc-indeling main>.wrap{max-width:1360px!important}" +
      "body.btc-indeling .btc-raster{display:grid;grid-template-columns:minmax(300px,360px) minmax(0,1fr);gap:28px;align-items:start}" +
      "body.btc-indeling .btc-inhoud{min-width:0;display:flex;flex-direction:column;gap:18px}" +
      ".btc-zij{display:flex;flex-direction:column;gap:16px;min-width:0;font-family:Montserrat,system-ui,sans-serif}}" +
      ".btc-kaart{background:var(--surface);border:1px solid var(--line);border-top:4px solid var(--lime,#C5E75A);border-radius:12px;padding:14px 16px;display:grid;gap:10px;color:var(--ink,var(--fg))}" +
      ".btc-kop{display:flex;align-items:baseline;gap:10px;position:relative;padding-right:30px}" +
      ".btc-kop h2{margin:0;color:var(--ink,var(--fg));font:700 20px 'League Spartan','Arial Narrow',Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase}" +
      ".btc-sub{font-size:13px;color:var(--muted)}" +
      ".btc-knop{position:absolute;right:0;top:0;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;background:none;border:0;border-radius:6px;padding:0;color:var(--muted);cursor:pointer}" +
      ".btc-knop:hover{color:var(--ink,var(--fg));background:var(--band,var(--bg))}.btc-knop:focus-visible{outline:2px solid var(--btc-groen);outline-offset:1px}" +
      ".btc-knop svg{transition:transform .15s}.btc-kaart.dicht .btc-knop svg{transform:rotate(-90deg)}.btc-kaart.dicht .btc-body{display:none}" +
      ".btc-body{display:grid;gap:10px}.btc-noot{margin:0;font-size:14px;color:var(--muted)}" +
      ".btc-groep{margin:0 0 6px;font:700 13px 'League Spartan','Arial Narrow',Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}" +
      ".btc-lijst{display:grid;gap:8px}" +
      "a.btc-wk{display:grid;grid-template-columns:3.4em 1fr;gap:2px 12px;align-items:center;text-decoration:none;color:var(--ink,var(--fg));border:1px solid var(--line);border-radius:8px;padding:9px 12px;background:var(--bg)}" +
      "a.btc-wk:hover,a.btc-wk:focus-visible{border-color:var(--btc-groen)}a.btc-wk.thuis{border-color:var(--btc-groen)}" +
      ".btc-dag{grid-row:1/span 3;text-align:center;line-height:1.1}.btc-dag b{display:block;font:800 13px 'League Spartan','Arial Narrow',Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--btc-groen)}" +
      ".btc-dag span{font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}" +
      ".btc-soort{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}" +
      ".btc-tt{font-weight:600;font-size:15px;line-height:1.3}.btc-dt{font-size:13px;color:var(--muted)}" +
      ".btc-actie{grid-column:2;justify-self:start;margin-top:4px;font:700 13px 'League Spartan','Arial Narrow',Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;background:var(--btc-groen);color:var(--btc-op-groen);border-radius:6px;padding:5px 10px}" +
      "@media (prefers-reduced-motion:reduce){.btc-knop svg{transition:none}}";
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  }
})();
