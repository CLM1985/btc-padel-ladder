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
    wis(SLEUTEL); wis(LADDER);
    Promise.all(klaar).then(function () { location.href = "../"; });
  }
  window.BTC = { token: lees(SLEUTEL), naarLogin: naarLogin, afmelden: afmelden };
  if (!window.BTC.token) naarLogin();
})();
