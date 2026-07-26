import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SRC = process.argv[2]
const OUT = process.argv[3]

function parse(xml) {
  const pts = []
  const re = /<trkpt lat="([-\d.]+)" lon="([-\d.]+)">\s*<ele>([-\d.]+)<\/ele>/g
  let m
  while ((m = re.exec(xml))) pts.push([+m[1], +m[2], +m[3]])
  return pts
}

const R = 6371000
const rad = (d) => (d * Math.PI) / 180
function dist(a, b) {
  const dLat = rad(b[0] - a[0])
  const dLon = rad(b[1] - a[1])
  const la1 = rad(a[0]), la2 = rad(b[0])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Ramer-Douglas-Peucker on lat/lon (degrees, good enough at this scale)
function rdp(pts, eps) {
  if (pts.length < 3) return pts
  let maxD = 0, idx = 0
  const [a, b] = [pts[0], pts[pts.length - 1]]
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perp(pts[i], a, b)
    if (d > maxD) { maxD = d; idx = i }
  }
  if (maxD <= eps) return [a, b]
  return [...rdp(pts.slice(0, idx + 1), eps).slice(0, -1), ...rdp(pts.slice(idx), eps)]
}
function perp(p, a, b) {
  const x = p[1], y = p[0], x1 = a[1], y1 = a[0], x2 = b[1], y2 = b[0]
  const dx = x2 - x1, dy = y2 - y1
  const len2 = dx * dx + dy * dy
  if (len2 === 0) return Math.hypot(x - x1, y - y1)
  let t = ((x - x1) * dx + (y - y1) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy))
}

const files = readdirSync(SRC).filter((f) => f.endsWith('.gpx')).sort()
const days = []

for (const f of files) {
  const pts = parse(readFileSync(join(SRC, f), 'utf8'))
  // cumulative distance + smoothed elevation for gain/loss
  let total = 0
  const cum = [0]
  for (let i = 1; i < pts.length; i++) { total += dist(pts[i - 1], pts[i]); cum.push(total) }

  // moving-average smoothing of elevation to kill GPS noise
  const W = 5
  const sm = pts.map((_, i) => {
    let s = 0, n = 0
    for (let j = Math.max(0, i - W); j <= Math.min(pts.length - 1, i + W); j++) { s += pts[j][2]; n++ }
    return s / n
  })
  let up = 0, down = 0
  const THR = 1.5
  let ref = sm[0]
  for (let i = 1; i < sm.length; i++) {
    const d = sm[i] - ref
    if (d > THR) { up += d; ref = sm[i] }
    else if (d < -THR) { down += -d; ref = sm[i] }
  }
  const eles = pts.map((p) => p[2])

  // simplified line for the map
  const line = rdp(pts.map((p) => [p[0], p[1]]), 0.00015).map(([la, lo]) => [+la.toFixed(5), +lo.toFixed(5)])

  // resampled profile: ~180 evenly-spaced-by-distance samples
  const N = 180
  const profile = []
  let k = 0
  for (let i = 0; i < N; i++) {
    const target = (total * i) / (N - 1)
    while (k < cum.length - 1 && cum[k + 1] < target) k++
    profile.push(Math.round(sm[Math.min(k, sm.length - 1)]))
  }

  days.push({
    file: f,
    km: +(total / 1000).toFixed(1),
    up: Math.round(up / 10) * 10,
    down: Math.round(down / 10) * 10,
    min: Math.round(Math.min(...eles)),
    max: Math.round(Math.max(...eles)),
    startEle: Math.round(eles[0]),
    endEle: Math.round(eles[eles.length - 1]),
    pts: pts.length,
    linePts: line.length,
    line,
    profile,
  })
}

writeFileSync(OUT, JSON.stringify(days))
for (const d of days) {
  console.log(
    `${d.file}: ${d.km} km  +${d.up} / -${d.down} m  ele ${d.min}-${d.max}  ` +
    `(${d.startEle}→${d.endEle})  raw ${d.pts} → line ${d.linePts}`
  )
}
console.log('total km:', days.reduce((s, d) => s + d.km, 0).toFixed(1))
console.log('total up:', days.reduce((s, d) => s + d.up, 0))
console.log('total down:', days.reduce((s, d) => s + d.down, 0))
