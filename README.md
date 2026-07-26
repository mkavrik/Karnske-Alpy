# Karnské Alpy — Karnischer Höhenweg

Podklad pro devítidenní trek po hraničním hřebeni Karnských Alp ze Sillianu do
Hermagoru. 126 km od chaty k chatě, 7,5 trekového dne, lehký batoh.

Repozitář obsahuje propagační web pro cestovní kancelář i zdrojové materiály,
ze kterých je postavený.

| Adresář | Co v něm je |
|---|---|
| [`web/`](web/) | hotová statická stránka — viz [web/README.md](web/README.md) pro lokální náhled a nasazení |
| `gpx/` | originální GPX trasování jednotlivých dnů (`den 1.gpx` … `den 8.gpx`) |
| `fotky/` | fotografie z průzkumu úseku Hochweißsteinhaus → Sillian v plném rozlišení |
| `scripts/` | `gpx2json.mjs` — přepočet GPX na parametry etap a data pro web |
| `Karnske alpy.md` | popis treku: program, logistika, důvody |

## Parametry trasy

| Den | Etapa | Délka | Stoupání | Klesání |
|---|---|---|---|---|
| 1 | Sillian → Sillianer Hütte | 7,6 km | +1 390 m | −30 m |
| 2 | Sillianer Hütte → Porzehütte | 19,9 km | +1 000 m | −1 510 m |
| 3 | Porzehütte → Hochweißsteinhaus | 17,5 km | +980 m | −1 050 m |
| 4 | Hochweißsteinhaus → Wolayerseehütte | 14,1 km | +960 m | −870 m |
| 5 | Wolayerseehütte → Valentinalm (Rauchkofel) | 8,0 km | +490 m | −1 250 m |
| 6 | Valentinalm → Zollnerseehütte | 18,5 km | +1 470 m | −940 m |
| 7 | Zollnerseehütte → Rudnig Alm | 19,4 km | +740 m | −850 m |
| 8 | Rudnig Alm → Hermagor | 21,0 km | +630 m | −1 670 m |
| | **celkem** | **126,0 km** | **+7 660 m** | **−8 170 m** |

Hodnoty jsou spočítané z GPX souborů, ne z odhadů. Den 9 je návratový transfer
z Hermagoru do Brna.

## Nasazení webu

Adresář `web/` je hotový statický výstup bez build kroku. Na Vercelu nastav
**Root Directory** na `web`, framework preset **Other**, build command a output
directory nechej prázdné. Podrobně v [web/README.md](web/README.md).
