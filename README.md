# BTC Padel Ladder – inschrijving

Inschrijvingsformulier voor de padelladder van BTC Wemmel (Ladderreglement v1.2).
Eén HTML-pagina op GitHub Pages; bevat geen namen of gegevens. Alles komt live uit Supabase
(`padel-interclub`, schema `ladder`) via drie publieke functies:

| Functie | Doel |
|---|---|
| `ladder_config()` | open seizoen en ladders, aantal ploegen (geen persoonsgegevens) |
| `ladder_zoek_lid(ladder, zoekterm, partner_van)` | max. 10 leden van het ledenjaar vanaf 3 letters, met toelating voor die ladder |
| `ladder_inschrijven(ladder, inschrijver, partner, email, website)` | enkel invoegen: ploeg als `aangemeld`, mailadres voor de inlogcode |

Regels in de database: enkel leden van het ledenjaar · dames: enkel speelsters · gemengd: één speler en één speelster ·
niet twee keer in dezelfde ladder · maximaal 2 ladders per speler.

- Simulatie (niets opgeslagen): `?simulatie=1`
- De publieke sleutel in `index.html` geeft enkel toegang tot deze drie functies.
