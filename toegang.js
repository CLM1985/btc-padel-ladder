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
  if (!window.BTC.token) naarLogin();
  else voorbeeldBalk(lees(VB));
})();
