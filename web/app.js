/* ==========================================================================
   Karnischer Höhenweg — interakce, mapy a výškové profily
   Parametry etap jsou naměřené z GPX souborů (web/data/tracks.json).
   ========================================================================== */

const PAL = {
  green:  '#1f9a5f',
  blue:   '#1573c9',
  orange: '#f4772e',
  yellow: '#d99b00',
};

const DAYS = [
  {
    n: 1, color: 'green',
    from: 'Brno / Sillian', to: 'Sillianer Hütte',
    time: '4:45 h', endEle: 2449,
    sub: 'Přejezd do Alp a výstup na hřeben',
    note: 'Ráno vyrážíme dodávkou z Brna — 630 km a necelých sedm hodin cesty. V Sillianu (1 080 m) zaparkujeme u vlakového nádraží, přehodíme batohy na ramena a jde se rovnou nahoru. Výstup na hřeben je jediné opravdové „zaplacení vstupenky“ celého treku: skoro 1 400 výškových metrů v jednom kuse. Nahoře na Sillianer Hütte (2 449 m) se ale večer sedí na terase se Sextenskými Dolomity přímo proti sobě — a od téhle chvíle už týden nesejdeme z hřebene.',
    facts: ['Dodávkou 630 km / 6:45 h', 'Parkování u nádraží v Sillianu', 'Výstup 4:45 h', 'První noc už na hřebeni'],
  },
  {
    n: 2, color: 'blue',
    from: 'Sillianer Hütte', to: 'Porzehütte',
    time: '8:00 h', endEle: 1939,
    sub: 'Nejvyšší a nejdelší hřebenový den',
    note: 'Královská etapa. Celý den se jde po hraniční linii mezi Rakouskem a Itálií: po levici Vysoké Taury, po pravici italská Karnie a při ohlédnutí Sextenské Dolomity, které se za vámi pomalu vzdalují. Trasa míjí Obstansersee Hütte a hřebenovou Filmoor-Standschützenhütte a v polovině dne vystoupá do nejvyššího bodu celého treku — 2 669 m. Je to zároveň úsek, kde je frontová linie z let 1915–1917 nejlépe čitelná: chodí se po vojenských stezkách, kolem zákopů a vstupů do kaveren. Den končí sestupem k Porzehütte (1 939 m).',
    facts: ['Nejvyšší bod trasy 2 669 m', 'Obstansersee Hütte na cestě', 'Zákopy a kaverny z 1. sv. války', 'Nejnáročnější den treku'],
  },
  {
    n: 3, color: 'orange',
    from: 'Porzehütte', to: 'Hochweißsteinhaus',
    time: '7:00 h', endEle: 1868,
    sub: 'Střed hřebene, výhledy na dvě strany',
    note: 'Vyrovnaný den s téměř stejným stoupáním i klesáním — hřeben se tu vlní v sériích sedel a kopců a cesta pořád přeskakuje z rakouské na italskou stranu. Rozdíl je znát: severní strana je zelená a vlhčí, jižní vyprahlá a slunečná. Nocleh na Hochweißsteinhaus (1 868 m), jedné z nejklidnějších chat celého přechodu, pod masivem Hochweißstein / Monte Peralba.',
    facts: ['Klimatický předěl na vlastní kůži', 'Hřeben stále na hranici dvou států', 'Konec úseku, který známe z průzkumu'],
  },
  {
    n: 4, color: 'yellow',
    from: 'Hochweißsteinhaus', to: 'Wolayerseehütte',
    time: '6:00 h', endEle: 1960,
    sub: 'K jezeru Wolayer See',
    note: 'Kratší, ale krásný den směřující k nejfotogeničtějšímu místu trasy — jezeru Wolayer See, které leží v kotli pod vápencovými stěnami přímo na hranici. Wolayerseehütte (1 960 m) stojí pár desítek metrů od vody, v chráněném území. Kdo má večer sílu, může si v jezeře smočit nohy; kdo ne, zůstane na terase.',
    facts: ['Jezero Wolayer See u chaty', 'Chráněné území', 'Vápencové stěny nad kotlem'],
  },
  {
    n: 5, color: 'green',
    from: 'Wolayerseehütte', to: 'Almgasthof Valentinalm',
    time: '4:00 h', endEle: 1200,
    sub: 'Odpočinkový den s vrcholem Rauchkofel (2 460 m)',
    note: 'Nejkratší den je záměrně zařazený jako odpočinkový — uprostřed týdne se to vyplatí. Ráno se dá vyjít nad jezero na Rauchkofel (2 460 m), odkud je hřeben vidět na obě strany naráz. Pak už jen dlouhý sestup Valentinskou dolinou k Almgasthof Valentinalm (1 200 m) pod Plöckenpassem — sedlem, které bylo jedním z nejtvrději bráněných bodů celé horské fronty. Odpoledne volno.',
    facts: ['Odbočka na Rauchkofel 2 460 m', 'Nejkratší etapa — 8 km', 'Odpoledne volno', 'Oblast Plöckenpassu'],
  },
  {
    n: 6, color: 'blue',
    from: 'Almgasthof Valentinalm', to: 'Zollnerseehütte',
    time: '8:00 h', endEle: 1738,
    sub: 'Zpátky nahoru — největší stoupání treku',
    note: 'Cena za včerejší odpočinek. Z doliny se vracíme na hřeben a nasbíráme přitom nejvíc metrů z celého treku, téměř 1 500. Zato se jde z lesa přes horské pastviny až na otevřený hřeben a krajina se během dne třikrát úplně změní. Nocleh na Zollnerseehütte (1 738 m).',
    facts: ['Největší stoupání: +1 470 m', 'Z doliny zpět na hřeben', 'Tři vegetační pásma za jeden den'],
  },
  {
    n: 7, color: 'orange',
    from: 'Zollnerseehütte', to: 'Rudnig Alm',
    time: '7:00 h', endEle: 1624,
    sub: 'Dlouhé hřebenové putování na východ',
    note: 'Nejsvižnější dlouhý den — devatenáct kilometrů s mírným profilem po zvolna klesajícím hřebeni. Karnské Alpy tady ztrácejí ostrost a přecházejí do zelenějších, pastvinami protkaných hřbetů. Nocleh na Rudnig Alm (1 624 m) v oblasti Nassfeldu, poslední noc nahoře.',
    facts: ['19,4 km, ale mírný profil', 'Pastviny a alpské salaše', 'Poslední noc na hřebeni'],
  },
  {
    n: 8, color: 'yellow',
    from: 'Rudnig Alm', to: 'Hermagor',
    time: '7:30 h', endEle: 590,
    sub: 'Sestup do Korutan a zakončení treku',
    note: 'Poslední hřebenové kilometry a pak už jen dlouhý, více než 1 600 metrů hluboký sestup do Hermagoru (590 m). Cíl je zároveň konec trasy: 126 kilometrů po hranici je za námi. Zakončení treku patří místní hospodě — a korutanské kuchyni jako protiváze osmi dnů chatového jídelníčku.',
    facts: ['Nejdelší den: 21 km', 'Sestup −1 670 m', 'Cíl: Hermagor 590 m', 'Oslava v místní hospodě'],
  },
];

const TRANSFER = {
  n: 9,
  sub: 'Vyzvednutí auta a návrat domů',
  note: 'Průvodce vyráží ráno vlakem z Hermagoru do Sillianu pro dodávku — skupina má do té doby volno. Sraz je na P+R v Hermagoru a pak už jen 530 km a asi šest hodin cesty do Brna.',
  facts: ['Vlakem Hermagor → Sillian pro auto', 'Sraz na P+R v Hermagoru', 'Návrat 530 km / 6 h'],
};

/* Mozaika galerie: 4 široké dlaždice (jen snímky 16:9) na 16 fotek — při čtyřech
   sloupcích to dá 20 jednotek, tedy 5 přesně zaplněných řad bez děr.
   Široké musí zůstat na indexech 0, 4, 8 a 9, jinak se řady rozsypou. */
const PHOTOS = [
  { f: 'IMG_5300', alt: 'Hřebenová stezka s výhledem na vápencové stěny Dolomit', wide: true },
  { f: 'IMG_5263', alt: 'Trekař na skalním hřebeni fotí panorama Karnských Alp' },
  { f: 'IMG_5227', alt: 'Skupina trekařů s dětmi sestupuje k horskému jezírku mezi podzimními borůvčími a modříny' },
  { f: 'IMG_5286', alt: 'Členitý hraniční hřeben Karnských Alp se zbytky sněhu' },
  { f: 'IMG_5270', alt: 'Vápencový vrchol nad horskou chatou v travnaté kotlině', wide: true },
  { f: 'IMG_5242', alt: 'Panorama Sextenských Dolomit za dolinou, v popředí hřeben Karnských Alp' },
  { f: 'IMG_5273', alt: 'Dítě s batohem na hřebenové stezce mezi sutí a travnatými svahy' },
  { f: 'IMG_5265', alt: 'Pohled z hřebene do doliny s horským jezerem a chatou' },
  { f: 'IMG_5233', alt: 'Odložený batoh a hůrky u červenobílé značky na kamenité stezce pod vrcholem', wide: true },
  { f: 'IMG_5325', alt: 'Západ slunce z terasy horské chaty', wide: true },
  { f: 'IMG_5305', alt: 'Panorama Sextenských Dolomit z hraničního hřebene' },
  { f: 'IMG_5255', alt: 'Skupina trekařů na travnatém hřebeni, v pozadí vzdálené italské hřbety' },
  { f: 'IMG_5277', alt: 'Výhled z hřebene na severní stranu — Villgratenské hory a za nimi zasněžený hlavní alpský hřeben' },
  { f: 'IMG_5307', alt: 'Trekaři na hřebeni se zbytky sněhu a mohutnou oblohou' },
  { f: 'IMG_5245', alt: 'Kamenitá hřebenová stezka nad sutí se sestupem do korutanské doliny' },
  { f: 'IMG_5279', alt: 'Horské jezero s chatou hluboko pod hřebenem' },
];

let TRACKS = [];

/* ---------------------------------------------------------------- helpers */
const nb = (n) => n.toLocaleString('cs-CZ'); // v cs-CZ je oddělovač už nezlomitelná mezera
const km = (n) => n.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------------------------------------------------------------- header */
const head = document.getElementById('siteHead');
const onScroll = () => head.classList.toggle('stuck', window.scrollY > 8);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

const burger = document.getElementById('burger');
const nav = document.querySelector('.nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

/* ---------------------------------------------------------------- reveal */
const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target) }
  }),
  { rootMargin: '-40px 0px -80px' }
);
// .map-overview je vynechaná záměrně: transform na obalu rozhodí Leafletu drag
const markReveal = () =>
  document.querySelectorAll('.sec h2, .sec-lead, .why, .card, .fact, .ph, .quote, .checks, .huts, .day, .gitem')
    .forEach((el) => { if (!el.classList.contains('rv')) { el.classList.add('rv'); io.observe(el) } });

/* ---------------------------------------------------------------- program */
function renderDays() {
  const ol = document.getElementById('days');

  const html = DAYS.map((d) => {
    const t = TRACKS[d.n - 1];
    const c = PAL[d.color];
    return `
<li class="day" id="den-${d.n}" style="border-left-color:${c}">
  <h3 class="day-h">
    <button class="day-btn" id="btn-${d.n}" data-day="${d.n}" aria-expanded="false" aria-controls="body-${d.n}">
      <span class="day-tag" style="background:${c}"><small>Den</small><b>${d.n}</b></span>
      <span class="day-head">
        <span class="day-title">${esc(d.from)} → ${esc(d.to)}</span>
        <span class="day-sub">${esc(d.sub)} · ${d.time} · cíl ${nb(d.endEle)} m n. m.</span>
      </span>
      <span class="day-stats">
        <span class="st"><b>${km(t.km)} km</b><span>délka</span></span>
        <span class="st st-up"><b>+${nb(t.up)} m</b><span>stoupání</span></span>
        <span class="st st-dn"><b>−${nb(t.down)} m</b><span>klesání</span></span>
      </span>
      <span class="chev" aria-hidden="true">▾</span>
    </button>
  </h3>
  <div class="day-body" id="body-${d.n}" role="region" aria-labelledby="btn-${d.n}">
    <div><div class="day-inner">
      <p class="day-note">${esc(d.note)}</p>
      <div class="day-facts">
        <span class="tagf">${km(t.km)} km · ${d.time}</span>
        <span class="tagf">+${nb(t.up)} m / −${nb(t.down)} m</span>
        <span class="tagf">${nb(t.min)}–${nb(t.max)} m n. m.</span>
        ${d.facts.map((f) => `<span class="tagf">${esc(f)}</span>`).join('')}
        <a class="tagf tagf-dl" href="./gpx/den-${d.n}.gpx" download>↓ GPX etapy</a>
      </div>
      <div class="day-viz">
        <div class="viz-box">
          <h4>Mapa etapy</h4>
          <div class="map map-day" id="map-${d.n}"></div>
        </div>
        <div class="viz-box">
          <h4>Výškový profil</h4>
          <div class="prof" id="prof-${d.n}"></div>
        </div>
      </div>
    </div></div>
  </div>
</li>`;
  }).join('');

  const tr = `
<li class="day day-transfer" id="den-9">
  <div class="day-btn day-btn-static">
    <span class="day-tag" style="background:${PAL.blue}"><small>Den</small><b>9</b></span>
    <span class="day-head">
      <span class="day-title">Hermagor → Brno</span>
      <span class="day-sub">${esc(TRANSFER.sub)} · 530 km / 6 h</span>
    </span>
  </div>
  <div class="day-body day-body-open">
    <div><div class="day-inner">
      <p class="day-note">${esc(TRANSFER.note)}</p>
      <div class="day-facts">${TRANSFER.facts.map((f) => `<span class="tagf">${esc(f)}</span>`).join('')}</div>
    </div></div>
  </div>
</li>`;

  ol.innerHTML = html + tr;
  ol.querySelectorAll('.day-btn[data-day]').forEach((btn) => {
    btn.addEventListener('click', () => toggleDay(+btn.dataset.day, btn));
  });
}

const built = new Map(); // n -> { map, redrawProfile }

function toggleDay(n, btn) {
  const li = document.getElementById('den-' + n);
  const open = !li.classList.contains('open');
  li.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));

  if (!open) return;

  if (!built.has(n)) {
    // Element existuje hned, ale výšku dostane až po animaci rozbalení (380 ms).
    // Mapu i profil proto po dokončení animace ještě jednou přepočítáme.
    requestAnimationFrame(() => {
      const map = buildDayMap(n);
      const redrawProfile = buildProfile(n);
      built.set(n, { map, redrawProfile });
      setTimeout(() => { map.invalidateSize(); map.fitBounds(map._trackBounds, { padding: [52, 52] }); redrawProfile() }, 440);
    });
  } else {
    const b = built.get(n);
    setTimeout(() => { b.map.invalidateSize(); b.redrawProfile() }, 440);
  }
}

/* ---------------------------------------------------------------- mapy */
function tileLayers() {
  return {
    'Turistická': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Mapa © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA), data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }),
    'Základní': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }),
  };
}

const dot = (ll, color, size = 14) => L.marker(ll, {
  keyboard: false,
  icon: L.divIcon({
    className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2],
    html: `<div class="pt-dot" style="width:${size}px;height:${size}px;background:${color}"></div>`,
  }),
});

let overview;
const overviewLines = [];

function buildOverview() {
  const layers = tileLayers();
  overview = L.map('mapAll', { scrollWheelZoom: false });
  layers['Turistická'].addTo(overview);
  L.control.layers(layers, null, { position: 'topright' }).addTo(overview);
  L.control.scale({ imperial: false }).addTo(overview);

  const all = [];
  DAYS.forEach((d) => {
    const t = TRACKS[d.n - 1];
    L.polyline(t.line, { color: '#fff', weight: 8, opacity: .85 }).addTo(overview);
    const line = L.polyline(t.line, { color: PAL[d.color], weight: 4.2 }).addTo(overview);
    line.bindTooltip(
      `<b>Den ${d.n}</b><br>${esc(d.from)} → ${esc(d.to)}<br>${km(t.km)} km · +${nb(t.up)} m`,
      { sticky: true }
    );
    overviewLines[d.n] = { line, bounds: L.polyline(t.line).getBounds() };
    all.push(...t.line);
  });

  const stops = [{ ll: TRACKS[0].line[0], label: 'Sillian 1 080 m', c: '#2b3b32' }];
  DAYS.forEach((d) => {
    const t = TRACKS[d.n - 1];
    stops.push({ ll: t.line[t.line.length - 1], label: `${d.to} ${nb(d.endEle)} m`, c: PAL[d.color] });
  });
  stops.forEach((s, i) => {
    const top = i % 2 === 0;
    const ends = i === 0 || i === stops.length - 1; // Sillian a Hermagor mapu ukotví
    dot(s.ll, s.c).addTo(overview)
      .bindTooltip(s.label, {
        className: 'hut-pin', permanent: ends,
        direction: top ? 'top' : 'bottom', offset: [0, top ? -7 : 7],
      });
  });

  const allBounds = L.polyline(all).getBounds();
  overview.fitBounds(allBounds, { padding: [26, 26] });

  const leg = document.getElementById('mapLegend');
  leg.innerHTML =
    `<button class="leg on" data-day="0"><i style="background:linear-gradient(90deg,${PAL.green},${PAL.blue},${PAL.orange},${PAL.yellow})"></i>Celá trasa · 126 km</button>` +
    DAYS.map((d) => `<button class="leg" data-day="${d.n}"><i style="background:${PAL[d.color]}"></i>Den ${d.n} · ${km(TRACKS[d.n - 1].km)} km</button>`).join('');

  leg.addEventListener('click', (e) => {
    const b = e.target.closest('.leg');
    if (!b) return;
    leg.querySelectorAll('.leg').forEach((x) => x.classList.toggle('on', x === b));
    const n = +b.dataset.day;
    if (n === 0) {
      overview.fitBounds(allBounds, { padding: [26, 26] });
      DAYS.forEach((d) => overviewLines[d.n].line.setStyle({ opacity: 1, weight: 4.2 }));
    } else {
      overview.fitBounds(overviewLines[n].bounds, { padding: [34, 34] });
      DAYS.forEach((d) => overviewLines[d.n].line.setStyle(
        d.n === n ? { opacity: 1, weight: 5.6 } : { opacity: .25, weight: 3 }
      ));
    }
  });
}

function buildDayMap(n) {
  const d = DAYS[n - 1];
  const t = TRACKS[n - 1];
  const layers = tileLayers();
  const map = L.map('map-' + n, { scrollWheelZoom: false, zoomControl: false });
  L.control.zoom({ position: 'bottomleft' }).addTo(map);
  layers['Turistická'].addTo(map);
  L.control.layers(layers, null, { position: 'topright' }).addTo(map);

  L.polyline(t.line, { color: '#fff', weight: 8, opacity: .85 }).addTo(map);
  L.polyline(t.line, { color: PAL[d.color], weight: 4.4 }).addTo(map);

  const a = t.line[0], b = t.line[t.line.length - 1];
  dot(a, '#2b3b32', 15).addTo(map)
    .bindTooltip('Start · ' + esc(d.from), { className: 'hut-pin', direction: 'top', permanent: true, offset: [0, -8] });
  dot(b, PAL[d.color], 15).addTo(map)
    .bindTooltip('Cíl · ' + esc(d.to), { className: 'hut-pin', direction: 'bottom', permanent: true, offset: [0, 8] });

  map._trackBounds = L.polyline(t.line).getBounds();
  map.fitBounds(map._trackBounds, { padding: [52, 52] });
  return map;
}

/* ---------------------------------------------------------------- profil */
/* Kreslí se do viewBoxu o rozměrech skutečného kontejneru v px, takže text
   ani kroužky se nedeformují. Vrací funkci pro překreslení po změně velikosti. */
function buildProfile(n) {
  const host = document.getElementById('prof-' + n);
  const d = DAYS[n - 1];
  const t = TRACKS[n - 1];
  const c = PAL[d.color];
  const P = t.profile;

  function draw() {
    const W = Math.max(320, Math.round(host.clientWidth || 640));
    const H = Math.max(180, Math.round(host.clientHeight || 280));
    const M = { t: 16, r: 14, b: 32, l: 48 };
    const iw = W - M.l - M.r, ih = H - M.t - M.b;

    const step = 250;
    const lo = Math.floor(t.min / step) * step;
    const hi = Math.ceil(t.max / step) * step;
    const x = (i) => M.l + (i / (P.length - 1)) * iw;
    const y = (v) => M.t + ih - ((v - lo) / (hi - lo)) * ih;

    let stroke = `M ${x(0).toFixed(1)} ${y(P[0]).toFixed(1)}`;
    for (let i = 1; i < P.length; i++) stroke += ` L ${x(i).toFixed(1)} ${y(P[i]).toFixed(1)}`;
    const area = `${stroke} L ${x(P.length - 1).toFixed(1)} ${M.t + ih} L ${M.l} ${M.t + ih} Z`;

    const yTicks = [];
    for (let v = lo; v <= hi; v += step) yTicks.push(v);
    const xTicks = [0, .25, .5, .75, 1];

    host.innerHTML = `
<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"
     aria-label="Výškový profil dne ${n}: ${esc(d.from)} → ${esc(d.to)}. Délka ${km(t.km)} kilometrů, stoupání ${t.up} metrů, klesání ${t.down} metrů, nejnižší bod ${t.min} a nejvyšší ${t.max} metrů nad mořem.">
  <defs>
    <linearGradient id="g${n}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${c}" stop-opacity=".55"/>
      <stop offset="100%" stop-color="${c}" stop-opacity=".05"/>
    </linearGradient>
  </defs>
  ${yTicks.map((v) => `<line x1="${M.l}" x2="${W - M.r}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="#e8e4d8"/>` +
    `<text x="${M.l - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#8d9a92" font-family="Inter,sans-serif">${nb(v)}</text>`).join('')}
  <path d="${area}" fill="url(#g${n})"/>
  <path d="${stroke}" fill="none" stroke="${c}" stroke-width="2.6" stroke-linejoin="round"/>
  ${xTicks.map((f) => {
      const px = M.l + f * iw;
      const dec = (f === 0 || f === 1) ? 0 : 1;
      const lbl = (t.km * f).toLocaleString('cs-CZ', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      return `<text x="${px.toFixed(1)}" y="${H - 10}" text-anchor="${f === 0 ? 'start' : f === 1 ? 'end' : 'middle'}" font-size="11" fill="#8d9a92" font-family="Inter,sans-serif">${lbl} km</text>`;
    }).join('')}
  <line x1="${M.l}" x2="${W - M.r}" y1="${M.t + ih}" y2="${M.t + ih}" stroke="#cfc9b8" stroke-width="1.5"/>
  <circle cx="${x(0).toFixed(1)}" cy="${y(P[0]).toFixed(1)}" r="4.5" fill="#2b3b32" stroke="#fff" stroke-width="2"/>
  <circle cx="${x(P.length - 1).toFixed(1)}" cy="${y(P[P.length - 1]).toFixed(1)}" r="4.5" fill="${c}" stroke="#fff" stroke-width="2"/>
  <line class="cursor" x1="0" x2="0" y1="${M.t}" y2="${M.t + ih}" stroke="${c}" stroke-width="1.5" stroke-dasharray="3 3" opacity="0"/>
</svg>
<div class="prof-tip" aria-hidden="true"></div>`;

    const svg = host.querySelector('svg');
    const cur = svg.querySelector('.cursor');
    const tip = host.querySelector('.prof-tip');

    const move = (ev) => {
      const r = svg.getBoundingClientRect();
      const cx = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
      const f = Math.min(1, Math.max(0, (cx * (W / r.width) - M.l) / iw));
      const i = Math.round(f * (P.length - 1));
      cur.setAttribute('x1', x(i)); cur.setAttribute('x2', x(i)); cur.setAttribute('opacity', '1');
      tip.classList.add('on');
      tip.textContent = `${km(t.km * f)} km · ${nb(P[i])} m n. m.`;
      tip.style.left = (x(i) / W * r.width) + 'px';
      tip.style.top = (y(P[i]) / H * r.height) + 'px';
    };
    const leave = () => { cur.setAttribute('opacity', '0'); tip.classList.remove('on') };

    svg.addEventListener('mousemove', move);
    svg.addEventListener('mouseleave', leave);
    svg.addEventListener('touchmove', move, { passive: true });
    svg.addEventListener('touchend', leave);
  }

  draw();
  return draw;
}

/* překreslení všech otevřených profilů + mapek po změně velikosti okna */
let rzT;
addEventListener('resize', () => {
  clearTimeout(rzT);
  rzT = setTimeout(() => {
    built.forEach(({ map, redrawProfile }) => { map.invalidateSize(); redrawProfile() });
    if (overview) overview.invalidateSize();
  }, 200);
});

/* ---------------------------------------------------------------- galerie */
function renderGallery() {
  const g = document.getElementById('gallery');
  g.innerHTML = PHOTOS.map((p, i) => `
    <button class="gitem${p.wide ? ' wide' : ''}" data-i="${i}" aria-label="Zvětšit fotku: ${esc(p.alt)}">
      <img src="./img/${p.f}-sm.jpg" alt="${esc(p.alt)}" loading="lazy">
    </button>`).join('');

  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  let cur = 0, opener = null;

  const show = (i) => {
    cur = (i + PHOTOS.length) % PHOTOS.length;
    img.src = `./img/${PHOTOS[cur].f}.jpg`;
    img.alt = PHOTOS[cur].alt;
  };
  const open = (i, btn) => {
    opener = btn; show(i); lb.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lbClose').focus();
  };
  const close = () => {
    lb.hidden = true; document.body.style.overflow = '';
    if (opener) opener.focus();
  };

  g.addEventListener('click', (e) => {
    const b = e.target.closest('.gitem');
    if (b) open(+b.dataset.i, b);
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', () => show(cur - 1));
  document.getElementById('lbNext').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close() });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(cur - 1);
    else if (e.key === 'ArrowRight') show(cur + 1);
  });
}

/* ---------------------------------------------------------------- init */
fetch('./data/tracks.json')
  .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() })
  .then((data) => {
    TRACKS = data;
    renderDays();
    renderGallery();
    buildOverview();
    markReveal();

    const m = location.hash.match(/^#den-([1-8])$/);
    if (m) {
      const btn = document.querySelector(`.day-btn[data-day="${m[1]}"]`);
      if (btn) { toggleDay(+m[1], btn); setTimeout(() => btn.scrollIntoView({ block: 'center' }), 250) }
    }
  })
  .catch((err) => {
    console.error('Nepodařilo se načíst data tras:', err);
    document.getElementById('days').innerHTML =
      '<li class="day" style="padding:26px 28px">Data tras se nepodařilo načíst. Zkuste stránku prosím obnovit.</li>';
  });
