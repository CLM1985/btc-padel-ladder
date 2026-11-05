# BTC Wemmel – tennis & padel (GitHub Pages)

| Map | Pagina | Link |
|---|---|---|
| `/` | Mijn padel: startpagina met links naar alle clubpagina's | `https://clm1985.github.io/btc-tennis-padel/` |
| `ladder-inschrijving/` | Ladderinschrijving (`index.html`) en Mijn ladder (`app.html`) | `…/ladder-inschrijving/` |
| `beheer/` | Clublogin: codes, rollen, kapiteins, logboek (enkel beheerders) | `…/beheer/` |
| `klassementsimulator/` | Klassementsimulator (iedereen met een code; bereik volgens rol) | `…/klassementsimulator/` |
| `opstellingsplanner/` | Opstellingsplanner interclub (kapiteins, commissie, bestuur) | `…/opstellingsplanner/` |

Geen enkele pagina bevat namen of gegevens: alles komt live uit Supabase `padel-interclub`
via publieke functies die zelf sessie en rol controleren. De publieke sleutel in de pagina's
geeft enkel toegang tot die functies; tabellen en schema's zijn afgeschermd.

## Clublogin (`beheer/`, schema `club`)
- Eén code per lid (6 tekens), gedeeld met Mijn ladder. Sessie 60 dagen; 5 foute codes = 15 min geblokkeerd.
- Rollen: commissie, bestuur, wedstrijdleider, beheerder (handmatig); kapitein automatisch uit de interclubploegen.
- Functies: `club_zoek`, `club_login`, `club_logout`, `club_mij`, `club_beheer_zoek`, `club_beheer_code`,
  `club_beheer_rol`, `club_beheer_kapiteins`, `club_beheer_koppel`, `club_beheer_logboek`.
- Vrijgegeven op 5/11/2026.

## Mijn padel (`/`) – één login
- De startpagina is de enige aanmeldpagina (`club_zoek`, `club_login`). Na aanmelden verschijnen de links volgens de rol
  (`club_mij.onderdelen`): opstellingsplanner enkel voor kapitein/commissie/bestuur, beheer enkel voor beheerders.
- Elke onderliggende pagina laadt eerst `toegang.js`: zonder (geldige) clubsessie → `../?terug=<pagina>`; na aanmelden
  terug naar die pagina (enkel pagina's van deze site). Afmelden op eender welke pagina meldt overal af.
- Mijn ladder vraagt met de clubsessie een laddersessie aan (`club_ladder_sessie`), zodat er geen tweede code nodig is.
  Zolang die functie niet bestaat, blijft de laddercode als reserve.
- Publiek (zonder login): enkel het inschrijvingsformulier `ladder-inschrijving/`.
- De beveiliging zit in de database (elke functie controleert de sessie); de pagina's zelf bevatten geen namen.

## Padellessen (`lessen/`)
- Voorstel 09_Leden_Groei (lessen), sectie 10; database: schema `club` (`les_momenten`, `les_inschrijvingen`, `les_piekuren`).
- **Leden**: groepsles (3) of individueel; enkel momenten op hun niveaus (klassement ±1 + rond de speelsterkte);
  inschrijven met akkoord over 50% voorschot; wachtlijst; max. 2 openstaande inschrijvingen; uitschrijven/afzeggen.
- **Trainers** (rol `trainer`): momenten 60/90 min, minstens 8 dagen en hoogstens 5 weken vooruit, wekelijks herhalen;
  controle op interclubthuiswedstrijden, tornooien op BTC en piekuren (max. 1 terrein, terrein 4); bericht voor Dominique
  (terrein in Elit), daarna "Terrein gereserveerd" → zichtbaar voor leden; bevestigen als volzet; betalingen manueel markeren.
- Functies: `club_les_data`, `club_les_inschrijven`, `club_les_uitschrijven`, `club_les_trainer`, `club_les_controle`,
  `club_les_voorstellen`, `club_les_terrein`, `club_les_bevestig`, `club_les_sluit`, `club_les_betaling`.

## Tornooien (`tornooien/`)
- Lijst van alle interne BTC-padeltornooien (`club_tornooien_lijst`) voor wie aangemeld is: naam, datum, aantal reeksen.
- Detail per tornooi in de lay-out van het tornooirapport (poules, berekende stand, volledige bracket, overzicht reeksen).
  Het model wordt in de pagina opgebouwd uit de ruwe rijen van `club_tornooi_rapport`, met dezelfde rekenregels als
  `scraper/tornooi_rapport.py` (pariteit getest op W21 en Padelladder-finaleweekend).
- Toegang tot de details: iedereen die aangemeld is, alle tornooien (B2 aangepast op 5/11/2026).
  Jeugdreeksen worden niet doorgegeven.
- Links per tornooi en reeks: `tornooien/#t<tornooi-ID>-<reeks>`.

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

## Opstellingsplanner (`opstellingsplanner/`, fase 3)
- Zelfde login. Gegevens live via `club_planner_data` (ploegen, wedstrijden, poule, spelerslijsten met speelsterkte).
- Kapitein: enkel eigen ploeg(en), mag plannen · commissie: alle ploegen, mag plannen · bestuur: alle ploegen, inzage.
- Plannen in `club.opstellingen` via `club_planner_plan` / `club_planner_bewaar` met versiecontrole:
  wie op een verouderde versie bewaart, krijgt de nieuwste versie terug in plaats van te overschrijven.

## Klassementsimulator (`klassementsimulator/`)
- Zelfde login. Gegevens via `club_simulator_data` (zelfde inhoud als `simulator_bulk`, gefilterd per rol):
  commissie alle interclubspelers 2026 · kapitein zichzelf + ploegspelers · anderen enkel zichzelf.
- Tegenstanders enkel met klassement, zonder namen.
