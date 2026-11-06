/* Weergave: licht (standaard, huisstijl), donker of volg telefoon. Keuze per toestel, bewaard in de browser.
   Wordt als eerste geladen, zodat de pagina niet eerst in het verkeerde thema verschijnt. */
(function () {
  var k = "btc-thema", t = null;
  try { t = localStorage.getItem(k); } catch (e) {}
  if (t !== "donker" && t !== "auto") t = "licht";
  var r = document.documentElement;
  if (t === "licht") r.setAttribute("data-theme", "light");
  else if (t === "donker") r.setAttribute("data-theme", "dark");
  else r.removeAttribute("data-theme");
  window.BTCThema = {
    huidig: t,
    zet: function (n) { try { localStorage.setItem(k, n); } catch (e) {} location.reload(); }
  };
})();
