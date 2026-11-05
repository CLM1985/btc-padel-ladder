# BTC Wemmel – tennis & padel (GitHub Pages)

| Map | Pagina | Link |
|---|---|---|
| `/` | Startpagina met links | `https://clm1985.github.io/btc-tennis-padel/` |
| `ladder-inschrijving/` | Ladderinschrijving (`index.html`) en Mijn ladder (`app.html`) | `…/ladder-inschrijving/` |
| `beheer/` | Clublogin: codes, rollen, kapiteins, logboek (enkel beheerders) | `…/beheer/` |

Geen enkele pagina bevat namen of gegevens: alles komt live uit Supabase `padel-interclub`
via publieke functies die zelf sessie en rol controleren. De publieke sleutel in de pagina's
geeft enkel toegang tot die functies; tabellen en schema's zijn afgeschermd.

## Clublogin (`beheer/`, schema `club`)
- Eén code per lid (6 tekens), gedeeld met Mijn ladder. Sessie 60 dagen; 5 foute codes = 15 min geblokkeerd.
- Rollen: commissie, bestuur, wedstrijdleider, beheerder (handmatig); kapitein automatisch uit de interclubploegen.
- Functies: `club_zoek`, `club_login`, `club_logout`, `club_mij`, `club_beheer_zoek`, `club_beheer_code`,
  `club_beheer_rol`, `club_beheer_kapiteins`, `club_beheer_koppel`, `club_beheer_logboek`.
- Werkt pas na vrijgave in de database (`11_club_vrijgeven.sql` in het project).

---

## Ladder – inschrijving (`ladder-inschrijving/`)

Inschrijvingsformulier voor de padelladder van BTC Wemmel (Ladderreglement v1.2).
Eén HTML-pagina op GitHub Pages; bevat geen namen of gegevens. Alles komt live uit Supabase
(`padel-interclub`, schema `ladder`) via drie publieke functies:

| Functie | Doel |
|---|---|
| `ladder_config()` | open seizoen en ladders, aantal ploegen (geen persoonsgegevens) |
| `ladder_zoek_lid(ladder, zoekterm, partner_van)` | max. 10 leden van het ledenjaar vanaf 3 letters, met toelating voor die ladder |
| `ladder_inschrijven(ladder, inschrijver, partner, email, website, gsm, gsm_delen, email_delen)` | enkel invoegen: ploeg als `aangemeld`, mailadres voor de inlogcode, gsm en contactkeuze (minstens één kanaal delen) |

Regels in de database: enkel leden van het ledenjaar · dames: enkel speelsters · gemengd: één speler en één speelster ·
niet twee keer in dezelfde ladder · maximaal 2 ladders per speler.

- Simulatie (niets opgeslagen): `?simulatie=1`
- De publieke sleutel in `index.html` en `app.html` geeft enkel toegang tot de publieke ladderfuncties hieronder en hierboven; de tabellen zelf zijn afgeschermd.

### Mijn ladder (`ladder-inschrijving/app.html`)

Schermen na aanmelding (naam zoeken + persoonlijke code van 6 tekens; 5 foute pogingen = 15 minuten geblokkeerd).
Sessie van 60 dagen, enkel als willekeurig token in de browser (de database bewaart enkel de hash).

| Scherm | Functies in Supabase |
|---|---|
| Aanmelden / code aanvragen | `ladder_zoek_deelnemer`, `ladder_login`, `ladder_logout`, `ladder_code_aanvragen` |
| Mijn ploegen: wedstrijd plannen, bevestigen, uitslag, bevestigen/betwisten, weer, forfait | `ladder_mijn`, `ladder_plan`, `ladder_plan_bevestig`, `ladder_uitslag`, `ladder_bevestig`, `ladder_weer`, `ladder_forfait` |
| Agenda 0/1/2 per ronde | `ladder_agenda` |
| Stand (gespeeld, gewonnen, ▲/▼ t.o.v. vorige ronde, 🔥 bij 3+ overwinningen op rij, 💪 meeste wedstrijden, bij gelijkstand meeste overwinningen) + ratingverloop (lijngrafiek per ploeg over de rondes) | `ladder_stand`, `ladder_ratingverloop` |
| Wedstrijden: alle ladders of één ladder, per ronde, met uitslag, ratingwijziging en wissel | `ladder_wedstrijden` |
| Contact: gsm en e-mail delen (opt-in), WhatsApp- en mailknop naar tegenstanders van een lopende wedstrijd | `ladder_contact`, `ladder_mijn` |
| Partner wijzigen (15 %-regel) | `ladder_zoek_partner`, `ladder_partner` |

Privacy: `ladder_mijn` registreert enkel de actieve dag per speler (opvolging ladder, gewist na het seizoen). Gsm-nummers en e-mailadressen worden enkel gedeeld na toestemming (opt-in) en zijn enkel zichtbaar voor de tegenstanders van een lopende wedstrijd.
