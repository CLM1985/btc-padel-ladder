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
- De publieke sleutel in `index.html` en `app.html` geeft enkel toegang tot de publieke ladderfuncties hieronder en hierboven; de tabellen zelf zijn afgeschermd.

## Mijn ladder (`app.html`)

Schermen na aanmelding (naam zoeken + persoonlijke code van 6 tekens; 5 foute pogingen = 15 minuten geblokkeerd).
Sessie van 60 dagen, enkel als willekeurig token in de browser (de database bewaart enkel de hash).

| Scherm | Functies in Supabase |
|---|---|
| Aanmelden / code aanvragen | `ladder_zoek_deelnemer`, `ladder_login`, `ladder_logout`, `ladder_code_aanvragen` |
| Mijn ploegen: wedstrijd plannen, bevestigen, uitslag, bevestigen/betwisten, weer, forfait | `ladder_mijn`, `ladder_plan`, `ladder_plan_bevestig`, `ladder_uitslag`, `ladder_bevestig`, `ladder_weer`, `ladder_forfait` |
| Agenda 0/1/2 per ronde | `ladder_agenda` |
| Stand | `ladder_stand` |
| Partner wijzigen (15 %-regel) | `ladder_zoek_partner`, `ladder_partner` |
