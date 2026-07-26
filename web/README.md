# Karnischer Höhenweg — propagační stránka

Statická jednostránka (žádný build, žádné závislosti k instalaci) s programem
devítidenního treku Sillian → Hermagor, interaktivními mapami a výškovými profily
všech osmi etap.

## Struktura

```
web/
├── index.html          obsah stránky
├── styles.css          design (zelená / žlutá / modrá / oranžová)
├── app.js              mapy, profily, galerie, rozbalování dnů
├── data/tracks.json    parametry a zjednodušené linie etap (generováno z GPX)
├── gpx/den-1..8.gpx    originální GPX ke stažení pro každou etapu
├── img/                fotky zmenšené pro web (*.jpg = 1800 px, *-sm.jpg = 700 px)
└── vercel.json         cache hlavičky pro statický deploy
```

Externí zdroje běží z CDN: Leaflet 1.9.4 (mapy) a Google Fonts
(Barlow Condensed + Inter). Mapové podklady OpenTopoMap / OpenStreetMap.

## Lokální náhled

```bash
cd web
python3 -m http.server 8000
# → http://localhost:8000
```

Stránka musí běžet přes HTTP server, ne přes `file://` — `app.js` načítá
`data/tracks.json` fetchem.

## Nasazení na Vercel

Adresář `web/` je hotový statický výstup, takže se nasazuje bez build kroku.

**Varianta A — Vercel CLI**

```bash
npm i -g vercel      # jednorázově
cd web
vercel login
vercel               # náhledový deploy
vercel --prod        # produkční URL
```

Při prvním `vercel` průvodce ptá na:
- *Set up and deploy?* → **Y**
- *Which scope?* → tvůj účet
- *Link to existing project?* → **N**
- *Project name?* → např. `karnischer-hohenweg`
- *In which directory is your code located?* → **`./`** (jsi už v `web/`)
- *Framework preset* → **Other**, build command i output directory nechat prázdné

**Varianta B — přes Git**

1. Nahraj obsah `web/` do repozitáře na GitHubu.
2. Na vercel.com → *Add New… → Project* → vyber repozitář.
3. Framework Preset: **Other**. Root Directory nastav na `web`, pokud commituješ
   celý projekt včetně `fotky/` a `gpx/`. Build Command a Output Directory nech prázdné.
4. *Deploy*.

**Varianta C — drag & drop**: na vercel.com/new přetáhni adresář `web/`.

## Odkud jsou čísla

Délky, stoupání, klesání a výškové profily jsou spočítané z GPX souborů
v `gpx/` (haversine + vyhlazená elevace, prahování 1,5 m proti šumu GPS).
Časy etap jsou plánované odhady z `Karnske alpy.md`.

Skript pro přepočet, pokud se změní trasování:

```bash
node ../scripts/gpx2json.mjs ../gpx data/tracks.json
```

## Co ještě chybí

Cena výpravy a termín — podle zadání se zatím neřeší. Stránka o ceně nic netvrdí;
až bude kalkulace hotová, přidá se do `index.html` nová sekce.
