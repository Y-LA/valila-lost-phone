/* جوال يوسف — فريق تسويق ڤاليلا (عرض «ثلاثة على كيفك») */
(() => {
'use strict';

const STORE = 'https://valila.net/ar/%D8%AB%D9%84%D8%A7%D8%AB%D8%A9-%D8%B9%D9%84%D9%8A-%D9%83%D9%8A%D9%81%D9%83/c302175962';
const STORE_LABEL = 'valila.net';
const IMG = 'assets/img/', BOT = 'assets/bottles/';
const OWNER = 'يوسف';

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const AR = '٠١٢٣٤٥٦٧٨٩';
const ar = (v) => String(v).replace(/\d/g, d => AR[d]);
const vib = (p) => { try { if (navigator.vibrate && 'ontouchstart' in window && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(p); } catch(e){} };
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* Real clock. The story was written around ٨:٤٧ م; every story time is shifted so that
   moment lands on the visitor's real "now". The launch is the next quarter hour ≥ ١٣ min away. */
const DAY = 86400000;
const todayAt = (h, m) => { const d = new Date(); d.setHours(h, m, 0, 0); return d; };
const OFF = Date.now() - todayAt(20, 47).getTime();
const T = (hhmm, ds = 0) => { const [h, m] = hhmm.split(':').map(Number); return new Date(todayAt(h, m).getTime() + ds * DAY + OFF); };
const fmt = (d) => { const h = d.getHours(), h12 = ((h + 11) % 12) + 1; return ar(`${h12}:${String(d.getMinutes()).padStart(2,'0')}`) + (h < 12 ? ' ص' : ' م'); };
const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
function dayLabel(d){
  const t = new Date(); if (dayKey(d) === dayKey(t)) return 'اليوم';
  const y = new Date(t.getTime() - DAY); if (dayKey(d) === dayKey(y)) return 'أمس';
  return new Intl.DateTimeFormat('ar', {weekday:'long'}).format(d);
}
function t12(hhmm, ds = 0){ return fmt(T(hhmm, ds)); }
function listTime(hhmm){ if (!hhmm.includes(':')) return hhmm; const d = T(hhmm); const l = dayLabel(d); return l === 'اليوم' ? fmt(d) : l; }
const LAUNCH = (() => { const d = new Date(Date.now() + 13 * 60000); const q = Math.ceil(d.getMinutes() / 15) * 15; d.setMinutes(q, 0, 0); return d; })();
const LAUNCH_IN = Math.max(1, Math.round((LAUNCH - Date.now()) / 60000));
/* text tokens: {L} launch time · {L5} five minutes before launch · {LIN} minutes to launch · {t:HH:MM} time · {d:HH:MM} day + time */
const fx = (str) => String(str)
  .replace(/\{L\}/g, fmt(LAUNCH))
  .replace(/\{L5\}/g, fmt(new Date(LAUNCH - 5 * 60000)))
  .replace(/\{LIN\}/g, ar(LAUNCH_IN))
  .replace(/\{t:(\d+:\d+)\}/g, (_, x) => t12(x))
  .replace(/\{d:(\d+:\d+)\}/g, (_, x) => { const d = T(x); return `${dayLabel(d)} ${fmt(d)}`; });

/* fake clock: the phone was lost at ٨:٤٧ م and keeps ticking from there */
const now = () => new Date();
function clockText(d = now(), withPeriod = false){
  const h = ((d.getHours() + 11) % 12) + 1, m = String(d.getMinutes()).padStart(2, '0');
  return ar(`${h}:${m}`) + (withPeriod ? (d.getHours() < 12 ? ' ص' : ' م') : '');
}
function tickClock(){
  document.querySelectorAll('[data-clock]').forEach(n => n.textContent = clockText());
  document.querySelectorAll('[data-clock-big]').forEach(n => n.textContent = clockText());
}
function dateLine(){
  const d = new Date();
  let g = '', h = '';
  try { g = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-arab', {weekday:'long', day:'numeric', month:'long'}).format(d); } catch(e){ g = ''; }
  try { h = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-arab', {day:'numeric', month:'long'}).format(d).replace(/\s?هـ$/, ''); } catch(e){ h = ''; }
  return h ? `${g} · ${h}` : g;
}

/* ---------- icons ---------- */
const I = {
  back: '<svg viewBox="0 0 12 20"><path d="M2 2l8 8-8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 8 14"><path d="M7 1L1 7l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  ticks: '<svg viewBox="0 0 18 11"><path d="M1 6l3.2 3.2L11 2M7 9.2L14.8 1.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" fill="currentColor"/></svg>',
  search: '<svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  cam: '<svg viewBox="0 0 24 24"><path d="M3 7.5h4l1.8-2.5h6.4L17 7.5h4V19H3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
  dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  video: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="13" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M15.5 10.5l6-3.5v10l-6-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  call: '<svg viewBox="0 0 24 24"><path d="M6.6 3.5l2.6.4 1.3 4-1.8 1.6a12 12 0 0 0 5.8 5.8l1.6-1.8 4 1.3.4 2.6c-.2 1.6-1.6 2.8-3.2 2.6A17 17 0 0 1 4 6.7c-.2-1.6 1-3 2.6-3.2z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  clip: '<svg viewBox="0 0 24 24"><path d="M16.5 7.5l-7.6 7.6a2 2 0 0 0 2.8 2.8l8-8a4 4 0 0 0-5.6-5.6l-8.2 8.2a6 6 0 0 0 8.5 8.5L20 15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  archive: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M5 9v10h14V9M10 13h4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  pin: '<svg class="pin" viewBox="0 0 24 24"><path d="M14.5 3.5l6 6-3 1.2-3.8 3.8.4 4-1.6 1.6-3.6-3.6L4 21l-.9-.9 4.6-4.9-3.6-3.6 1.6-1.6 4 .4L13.5 6.6z" fill="currentColor"/></svg>',
  lock: '<svg viewBox="0 0 12 14"><rect x="1" y="6" width="10" height="7.5" rx="1.8" fill="currentColor"/><path d="M3.3 6V4.4a2.7 2.7 0 0 1 5.4 0V6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  pdf: '<svg viewBox="0 0 40 40"><path d="M9 3h15l9 9v25H9z" fill="#fff"/><path d="M24 3v9h9" fill="#dcdce0"/><rect x="9" y="22" width="24" height="10" fill="#e5392b"/><text x="21" y="30" font-size="8" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial">PDF</text></svg>',
  mp4: '<svg viewBox="0 0 40 40"><path d="M9 3h15l9 9v25H9z" fill="#fff"/><path d="M24 3v9h9" fill="#dcdce0"/><path d="M17 19v10l9-5z" fill="#7a5cff"/></svg>',
  folder: '<svg viewBox="0 0 40 40"><path d="M3 9a3 3 0 0 1 3-3h9l3 3h16a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill="#4aa8ff"/><path d="M3 14h34v17a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill="#63b6ff"/></svg>',
  folderLock: '<svg viewBox="0 0 40 40"><path d="M3 9a3 3 0 0 1 3-3h9l3 3h16a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill="#f6af1a"/><path d="M3 14h34v17a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill="#ffc53d"/><rect x="15" y="21" width="10" height="8" rx="1.5" fill="#15120e"/><path d="M17 21v-2a3 3 0 0 1 6 0v2" fill="none" stroke="#15120e" stroke-width="1.8"/></svg>',
  cart: '<svg viewBox="0 0 24 24"><path d="M3 4h2.5l2.2 11h10.8L21 7.5H6.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="9" cy="19" r="1.5" fill="currentColor"/><circle cx="17" cy="19" r="1.5" fill="currentColor"/></svg>',
};

/* app icons (60×60), drawn to match iOS 18 */
const HANDSET = 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z';
const grad = (id, a, b, x2 = 0, y2 = 1) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
const APPICON = {
  whatsapp: `<svg viewBox="0 0 60 60">${grad('gw','#5fe07a','#1dab3c')}<rect width="60" height="60" fill="url(#gw)"/>
    <path d="M30 12.6a17.4 17.4 0 0 0-15 26.2l-2.4 8.6 8.9-2.3A17.4 17.4 0 1 0 30 12.6z" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/>
    <path d="${HANDSET}" fill="#fff" transform="translate(21.6 21.4) scale(.72)"/></svg>`,
  phone: `<svg viewBox="0 0 60 60">${grad('gp','#6ce67f','#21b83c')}<rect width="60" height="60" fill="url(#gp)"/><path d="${HANDSET}" fill="#fff" transform="translate(13.2 13.2) scale(1.4)"/></svg>`,
  safari: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#fff"/>${grad('gs','#19d3ff','#1a5df0')}<circle cx="30" cy="30" r="24.5" fill="url(#gs)"/>
    <g stroke="#fff" stroke-linecap="round">${Array.from({length:72},(_,i)=>`<line x1="30" y1="7.6" x2="30" y2="${i%18===0?11.6:(i%2?9.2:10)}" stroke-width="${i%18===0?1.1:.55}" stroke-opacity="${i%2?.55:.9}" transform="rotate(${i*5} 30 30)"/>`).join('')}</g>
    <g transform="rotate(45 30 30)"><path d="M30 12.5l3.3 17.5h-6.6z" fill="#ff3b30"/><path d="M30 47.5l-3.3-17.5h6.6z" fill="#fff"/></g><circle cx="30" cy="30" r="1.2" fill="#1a5df0"/></svg>`,
  photos: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#fff"/><g style="mix-blend-mode:multiply">${['#f9a11b','#fcd535','#7ec74a','#3fb8af','#4b83c4','#8a5ba6','#d2508e','#ef4f45'].map((c,i)=>`<rect x="24.6" y="8.5" width="10.8" height="21.5" rx="5.4" fill="${c}" opacity=".92" transform="rotate(${i*45} 30 30)"/>`).join('')}</g></svg>`,
  camera: `<svg viewBox="0 0 60 60">${grad('gc','#ececef','#a7a7ad')}<rect width="60" height="60" fill="url(#gc)"/>
    <path d="M14 20h7l2.6-3.6h12.8L39 20h7a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z" fill="#2b2b2d"/>
    <circle cx="30" cy="33" r="9.6" fill="#d9d9de"/><circle cx="30" cy="33" r="7.6" fill="#141416"/><circle cx="30" cy="33" r="4.6" fill="#263048"/><circle cx="32" cy="31" r="1.5" fill="#8aa4d6" opacity=".9"/><circle cx="44.5" cy="25" r="1.6" fill="#f7c948"/></svg>`,
  notes: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#fff"/>${grad('gn','#ffd84a','#ffc400')}<rect width="60" height="18" fill="url(#gn)"/>
    <g fill="#b7b7bd">${Array.from({length:14},(_,i)=>`<circle cx="${4.5+i*4.2}" cy="20.2" r=".8"/>`).join('')}</g>
    <g stroke="#d1d1d6" stroke-width="1.2"><line x1="6" y1="31" x2="60" y2="31"/><line x1="6" y1="40.5" x2="60" y2="40.5"/><line x1="6" y1="50" x2="60" y2="50"/></g></svg>`,
  files: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#fff"/>${grad('gf','#2fa4ff','#0a72e8')}<path d="M9 19a4 4 0 0 1 4-4h10.5l4 4H47a4 4 0 0 1 4 4v21a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4z" fill="#0a6fe0"/><path d="M9 24h42v20a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4z" fill="url(#gf)"/></svg>`,
  calendar: (d) => `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#fff"/><text x="30" y="17.5" font-size="9.5" font-weight="600" fill="#ff3b30" text-anchor="middle" font-family="-apple-system,'SF Arabic','IBM Plex Sans Arabic',sans-serif">${d.wd}</text><text x="30" y="48" font-size="31" font-weight="300" fill="#1c1c1e" text-anchor="middle" font-family="-apple-system,'SF Arabic','IBM Plex Sans Arabic',sans-serif">${d.day}</text></svg>`,
  clock: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#000"/><circle cx="30" cy="30" r="25.5" fill="#fff"/>
    <g font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="5.6" font-weight="500" fill="#000" text-anchor="middle">${Array.from({length:12},(_,i)=>{const a=(i+1)*Math.PI/6;return `<text x="${(30+20*Math.sin(a)).toFixed(2)}" y="${(32+-20*Math.cos(a)).toFixed(2)}">${i+1}</text>`}).join('')}</g>
    <g stroke="#000" stroke-linecap="round"><line x1="30" y1="30" x2="30" y2="18" stroke-width="2.4" transform="rotate(255 30 30)"/><line x1="30" y1="30" x2="30" y2="12" stroke-width="1.7" transform="rotate(282 30 30)"/></g>
    <line x1="30" y1="35" x2="30" y2="10" stroke="#ff9500" stroke-width=".9" stroke-linecap="round" transform="rotate(60 30 30)"/><circle cx="30" cy="30" r="1.9" fill="#ff9500"/><circle cx="30" cy="30" r=".7" fill="#fff"/></svg>`,
  weather: `<svg viewBox="0 0 60 60">${grad('gwe','#1d6fe0','#5db5fb')}<rect width="60" height="60" fill="url(#gwe)"/>${grad('gsun','#ffe25a','#ffc300')}<circle cx="23" cy="23" r="9" fill="url(#gsun)"/><path d="M20.5 46a8 8 0 0 1 .4-16 10.5 10.5 0 0 1 20 2.6A6.8 6.8 0 0 1 42.2 46z" fill="#fff"/></svg>`,
  calc: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#1c1c1e"/>
    <rect x="9" y="9" width="42" height="11" rx="5.5" fill="#d4d4d2"/>
    ${[0,1,2].map(r=>[0,1,2].map(c=>`<circle cx="${14.5+c*10.5}" cy="${28+r*10.5}" r="4.2" fill="#505052"/>`).join('')).join('')}
    ${[0,1,2].map(r=>`<circle cx="46" cy="${28+r*10.5}" r="4.2" fill="#ff9f0a"/>`).join('')}</svg>`,
  settings: `<svg viewBox="0 0 60 60">${grad('gse','#d1d1d6','#8e8e93')}<rect width="60" height="60" fill="url(#gse)"/>
    <g transform="translate(30 30)"><circle r="21" fill="#3a3a3c"/><circle r="19.4" fill="#c7c7cc"/>
    <g fill="#3a3a3c">${Array.from({length:36},(_,i)=>`<rect x="-.9" y="-19.6" width="1.8" height="3.2" rx=".6" transform="rotate(${i*10})"/>`).join('')}</g>
    <circle r="15" fill="#636366"/><circle r="13.2" fill="#d1d1d6"/>
    <g fill="#636366">${Array.from({length:6},(_,i)=>`<rect x="-1.4" y="-12.5" width="2.8" height="8" rx="1.2" transform="rotate(${i*60})"/>`).join('')}</g>
    <circle r="5.2" fill="#636366"/><circle r="3.4" fill="#c7c7cc"/></g></svg>`,
  maps: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#f2efe6"/><path d="M0 0h26L0 24z" fill="#b8e0a6"/><path d="M60 60H36l24-20z" fill="#a6d4f7"/>
    <path d="M-2 43L62 21" stroke="#fff" stroke-width="7"/><path d="M42 -2L18 62" stroke="#fcd34d" stroke-width="6"/><path d="M42 -2L18 62" stroke="#f0b429" stroke-width="1" stroke-dasharray="2 2"/>
    <rect x="35" y="35" width="13" height="9" rx="2" fill="#1f6feb"/><text x="41.5" y="41.8" font-size="5.5" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial">65</text>
    <path d="M24 18l7 15-7-3.4-7 3.4z" fill="#0a84ff" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  music: `<svg viewBox="0 0 60 60">${grad('gm','#fc5c7d','#f9243f')}<rect width="60" height="60" fill="url(#gm)"/><path d="M25.5 41.5V20.2a1.6 1.6 0 0 1 1.3-1.6l14.6-3a1.6 1.6 0 0 1 1.9 1.6v20.6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/><ellipse cx="21" cy="41.5" rx="5.2" ry="4.4" fill="#fff"/><ellipse cx="38.8" cy="37.6" rx="5.2" ry="4.4" fill="#fff"/></svg>`,
  valila: `<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#15120e"/><image href="assets/img/valila_puzzle_solid_yellow.svg" x="12" y="12" width="36" height="36"/></svg>`,
};

/* ---------- people & chats ---------- */
const P = {
  reem:  {name:'ريم | تصميم',     color:'#ff8fab'},
  fahad: {name:'فهد | إعلانات',   color:'#7ad3ff'},
  sara:  {name:'سارة | محتوى',    color:'#b69cff'},
  nawaf: {name:'نواف | المتجر',   color:'#ffd279'},
};

const CHATS = [
  {
    id:'ceo', name:'CEO ڤاليلا', short:'CEO ڤاليلا', av:{t:'C', bg:'#6b4f2a'}, sub:'آخر ظهور {d:20:40}', unread:3, pinned:true,
    msgs:[
      {day:'اليوم'},
      {me:1, at:'15:10', t:'طال عمرك عندي فكرة عرض جديد 🙏'},
      {at:'15:12', t:'تفضل'},
      {me:1, at:'15:13', t:'العميل يختار ٣ عطور من العطور المختارة… ويدفع حق ٢ بس'},
      {at:'15:13', t:'والثالث؟'},
      {me:1, at:'15:13', t:'هدية 🎁 مجانًا'},
      {at:'15:15', t:'يوسف… كذا نخسر عطر في كل طلب 😐'},
      {me:1, at:'15:16', t:'بالعكس طال عمرك، اللي كان بياخذ عطر واحد بياخذ ثلاثة، والسلة تكبر'},
      {me:1, at:'15:16', t:'وكل واحد بيجرب أكثر من عطر، ويرجع لنا يطلب اللي حبّه'},
      {at:'15:18', t:'والمخزون يكفي؟ لا نعلن وبعدين نقول نفد'},
      {me:1, at:'15:18', t:'كلمت أبو سعد في المستودع، الكميات ممتازة 👌 (إلا MOON وتايقر باقي منهم قليل)'},
      {at:'15:20', t:'والناس اللي تبي تقسيط؟'},
      {me:1, at:'15:21', t:'تابي وتمارا شغالين، يقسطها على ٤ دفعات بدون فوائد'},
      {at:'15:22', t:'طيب وش اسم العرض؟'},
      {me:1, at:'15:22', t:'«ثلاثة على كيفك» 😎'},
      {at:'15:23', t:'😂😂😂'},
      {at:'15:23', t:'خلني أفكر وأرد عليك'},
      {me:1, at:'15:24', img:'offer.jpg', cap:'هذا التصميم طال عمرك'},
      {at:'19:40', t:'يوسف'},
      {at:'19:41', t:'موافق ✅ أطلقوه الساعة {L}'},
      {at:'19:41', t:'بس انتبه… لا أحد يعرف عن العرض قبل الإطلاق 🤐'},
      {me:1, at:'19:42', t:'أبشر طال عمرك، ولا أحد بيدري 🤐'},
      {at:'20:31', t:'يوسف وينك؟'},
      {at:'20:38', t:'اتصلت عليك ٣ مرات'},
      {at:'20:40', t:'لا تقول ضيّعت جوالك 😐'},
    ]
  },
  {
    id:'team', name:'فريق تسويق ڤاليلا 🟡', short:'فريق التسويق', av:{logo:1}, sub:'ريم، فهد، سارة، نواف، أنت', unread:12, pinned:true, group:true,
    msgs:[
      {day:'اليوم'},
      {sys:'🔒 هذه المجموعة خاصة بفريق التسويق. يُمنع نشر أي شيء عن العروض قبل الإطلاق.'},
      {p:'reem', at:'14:04', t:'يا جماعة خلصت تصاميم العرض الجديد 👀'},
      {p:'reem', at:'14:04', img:'offer.jpg'},
      {p:'fahad', at:'14:06', t:'«ثلاثة على كيفك»؟؟ الاسم أسطوري 🔥'},
      {p:'sara', at:'14:07', t:'يعني العميل يختار ٣ عطور ويدفع حق ٢ بس؟'},
      {p:'reem', at:'14:07', t:'إيه، والثالث مجانًا 🎁'},
      {p:'nawaf', at:'14:09', t:'وكل العطور المختارة داخلة؟ نو نيم، مارتن، S6، MOON…'},
      {me:1, at:'14:10', t:'تقريبًا كل العطور المختارة، القائمة حطيتها في الملفات 📁'},
      {p:'reem', at:'14:15', t:'وسويت لكم مجموعات جاهزة للي يحتار وش ياخذ 👇'},
      {p:'reem', at:'14:15', img:'trio3.jpg'},
      {p:'reem', at:'14:15', img:'trio5.jpg'},
      {p:'sara', at:'14:16', t:'فخمة 😍😍'},
      {p:'fahad', at:'14:20', img:'campaign_noname.jpg', cap:'وهذي صورة الإعلان الأولى، وش رأيكم؟'},
      {p:'nawaf', at:'14:22', t:'وتابي وتمارا؟ نبي نكتب «قسّطها»'},
      {me:1, at:'14:23', t:'شغالة ✅ ثلاث عطور وتقسطها على ٤ دفعات'},
      {p:'fahad', at:'14:30', voice:'0:09'},
      {p:'sara', at:'14:30', t:'فهد اكتب، ما نقدر نسمع بالدوام 😂'},
      {p:'fahad', at:'14:31', t:'أقول: الإعلان جاهز، ننتظر بس موافقة المدير'},
      {p:'reem', at:'14:32', t:'يوسف كلمته؟'},
      {me:1, at:'14:33', t:'بكلمه الحين، ادعوا لي 🤲'},
      {me:1, at:'19:45', t:'وافق 🎉🎉 الإطلاق الساعة {L}'},
      {p:'sara', at:'19:45', sticker:'🥳'},
      {p:'fahad', at:'19:46', t:'أخيرًا 😭🔥'},
      {p:'nawaf', at:'20:12', t:'صفحة العرض جاهزة على المتجر ✅', link:true},
      {p:'sara', at:'20:25', t:'يوسف وينك؟ ما ترد'},
      {p:'fahad', at:'20:28', t:'شكله ضيّع جواله مرة ثانية 🙂'},
      {p:'reem', at:'20:31', t:'اللي لقى جوال يوسف… لا يفتح القروب 😭'},
    ]
  },
  {
    id:'noura', name:'نورة 🌸', short:'نورة', av:{t:'ن', bg:'#b0567a'}, sub:'متصل الآن', unread:2,
    msgs:[
      {day:'اليوم'},
      {at:'18:20', t:'يوسف سمعت إن عندكم عرض جديد 👀'},
      {me:1, at:'18:24', t:'مين قالك؟؟'},
      {at:'18:24', t:'عندي مصادري 😏'},
      {at:'18:25', t:'قول بسرعة'},
      {me:1, at:'18:26', t:'ما أقدر… سري لين الساعة {L}'},
      {at:'18:26', t:'طيب بس قول لي وش آخذ 🥺'},
      {me:1, at:'18:28', t:'خذي نو نيم، ناعم ودافي… فانيليا وكراميل ومسك أبيض'},
      {me:1, at:'18:28', t:'ومارتن'},
      {me:1, at:'18:29', t:'والثالث اختاريه على كيفك 😉'},
      {at:'18:29', t:'ثلاثة؟؟ مين بيدفع حقهم 😂'},
      {me:1, at:'18:30', t:'تدفعين حق اثنين بس… والثالث علينا 🤫'},
      {at:'18:30', t:'يعني ثلاثة على كيفي؟ 😳'},
      {me:1, at:'18:31', t:'😶 لا تقولين لأحد'},
      {me:1, at:'18:32', img:'trio1.jpg', cap:'وهذي لو حابة شي فخم'},
      {at:'20:05', t:'بطلب أول ما يفتح الساعة {L} ⏰'},
      {at:'20:05', t:'لا تنسى تحجز لي MOON قبل يخلص 🙏'},
    ]
  },
  {
    id:'cs', name:'خدمة عملاء ڤاليلا', short:'خدمة العملاء', av:{t:'خ', bg:'#3d6b5c'}, sub:'', unread:1,
    msgs:[
      {day:'اليوم'},
      {at:'19:50', t:'يوسف فيه عملاء يسألون: «متى ينزل عرض ثلاثة على كيفك؟» 😳'},
      {at:'19:51', t:'من وين عرفوا؟؟'},
      {me:1, at:'19:55', t:'مدري 😅 قولوا لهم الساعة {L} على المتجر'},
      {at:'19:56', t:'تمام، وبنقول لهم يقدرون يقسطون مع تابي وتمارا 👍'},
    ]
  },
  {
    id:'store', name:'أبو سعد | المستودع', short:'أبو سعد', av:{t:'س', bg:'#5a5a5f'}, sub:'آخر ظهور {d:17:10}', unread:0,
    msgs:[
      {day:'اليوم'},
      {me:1, at:'16:02', t:'أبو سعد، عندنا عرض اليوم: ٣ عطور بسعر ٢'},
      {at:'16:05', t:'الله يعين 😅 كم تتوقعون طلب؟'},
      {me:1, at:'16:05', t:'كثير إن شاء الله. كيف الكميات؟'},
      {at:'16:09', t:'نو نيم ومارتن وجسار عندنا منها كميات ممتازة 👌'},
      {at:'16:09', t:'S6 ودونت تاتش وجرافيتي بعد متوفرة'},
      {at:'16:10', t:'بس MOON وتايقر باقي منهم قليل… اللي يبيهم يستعجل'},
      {me:1, at:'16:12', t:'تمام، والأكياس الصفراء؟'},
      {at:'16:15', t:'وصلت أمس، والمستودع كله صار أصفر 😂📦'},
      {at:'16:15', t:'والتغليف جاهز، أول ما ينزل الطلب نشحنه'},
      {me:1, at:'16:16', t:'الله يعطيك العافية 🙏'},
      {at:'17:10', t:'بس لا تعلنون قبل الساعة {L}، الشباب للحين يرصّون الكراتين'},
    ]
  },
  {
    id:'mom', name:'أمي ❤️', short:'أمي', av:{t:'أ', bg:'#8c5a8f'}, sub:'', unread:0,
    msgs:[
      {day:'اليوم'},
      {at:'16:30', t:'يوسف لا تتأخر على العشا'},
      {me:1, at:'16:31', t:'إن شاء الله يمه، بس عندنا إطلاق اليوم'},
      {at:'16:31', t:'وجيب لي عطر معك 😊'},
      {me:1, at:'16:32', t:'أجيب لك ثلاثة 😄'},
    ]
  },
  {
    id:'print', name:'مطبعة الأكياس', short:'المطبعة', av:{t:'م', bg:'#4a5b8a'}, sub:'', unread:0,
    msgs:[
      {day:'أمس'},
      {at:'11:20', t:'تم تسليم الأكياس الصفراء للمستودع ✅'},
      {me:1, at:'11:45', t:'شكرًا 🙏'},
    ]
  },
];
const LAST_AT = {ceo:'20:40', team:'20:31', noura:'20:05', cs:'19:56', store:'17:10', mom:'16:32', print:'أمس'};

const PRODUCTS = [
  {n:'No Name', f:'no_name', p:180, r:299},
  {n:'مارتن | Marten', f:'martin', p:180, r:300},
  {n:'اس 6 | S6', f:'s6', p:170, r:300},
  {n:'MOON', f:'moon', p:180, r:300, low:1},
  {n:'تايقر | Tiger', f:'tiger', p:180, r:300, low:1},
  {n:'جسار | Jassar', f:'jassar', p:180, r:399},
  {n:'دونت تاتش | Don’t Touch', f:'dont_touch', p:180, r:300},
  {n:'ميد نايت | Midnight', f:'midnight', p:160, r:300},
  {n:'سموكي | Smoky', f:'smoky', p:170, r:250},
  {n:'راو الأخضر | RAW Green', f:'raw_green', p:180, r:250},
  {n:'إيقو | EGO', f:'ego', p:160, r:300},
  {n:'بيلا | Bella', f:'bella', p:160, r:300},
  {n:'سيلين | Celine', f:'celine', p:160, r:249},
  {n:'چرافيتي | Gravity', f:'gravity', p:140, r:249},
  {n:'شوك | Shock', f:'shock', p:140, r:250},
  {n:'دونت درينك مي', f:'dont_drink_me', p:160, r:249},
  {n:'؟ | Question', f:'question', p:169, r:279},
];

/* ---------- DOM refs & state ---------- */
const lock = $('#lock'), home = $('#home'), appwin = $('#appwin'), wall = $('.wallpaper');
const statusbar = $('#statusbar'), indicator = $('#homeIndicator'), toastEl = $('#toast'), viewer = $('#viewer');
let unlocked = false, current = null, stack = [];
const read = new Set();
const today = new Date();
const calData = { wd: new Intl.DateTimeFormat('ar', {weekday:'long'}).format(today), day: ar(today.getDate()) };

/* ---------- fit device to viewport ---------- */
function fit(){
  const d = $('#device');
  if (innerWidth <= 520){ d.style.transform = ''; return; }
  const s = Math.min(1, (innerHeight - 56) / 844, (innerWidth - 24) / 390);
  d.style.transform = `scale(${s})`;
  d.style.margin = `${(844 * (s - 1)) / 2}px 0`;
}
addEventListener('resize', fit); fit();

/* ---------- toast ---------- */
let toastT;
function toast(msg){
  toastEl.textContent = msg; toastEl.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 2400);
}

/* ---------- lock screen ---------- */
const SILHOUETTE = '<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#6a7175"/><circle cx="20" cy="15.5" r="7" fill="#cfd4d6"/><path d="M6 40c0-8.5 6.3-14 14-14s14 5.5 14 14z" fill="#cfd4d6"/></svg>';
function avatarHTML(c, cls = ''){
  if (c.av.logo) return `<div class="avatar logo ${cls}"><img src="${IMG}valila_logo_full.svg" alt="ڤاليلا"></div>`;
  return `<div class="avatar ${cls}">${SILHOUETTE}</div>`;
}
function lastPreview(c){
  const m = [...c.msgs].reverse().find(x => x.t || x.img || x.voice || x.sticker);
  let txt = m.t || (m.img ? '📷 صورة' : m.voice ? '🎤 رسالة صوتية' : m.sticker);
  if (m.img && m.cap) txt = '📷 ' + m.cap;
  if (c.group && m.p) txt = P[m.p].name.split(' |')[0] + ': ' + txt;
  if (m.me) txt = (c.group ? 'أنت: ' : '') + txt;
  return txt;
}
function renderLock(){
  $('#lockDate').textContent = dateLine();
  const items = [
    {ico:APPICON.whatsapp, app:'whatsapp', chat:'ceo', head:'واتساب · CEO ڤاليلا', at:'20:40', text:'لا تقول ضيّعت جوالك 😐'},
    {ico:APPICON.whatsapp, app:'whatsapp', chat:'team', head:'واتساب · فريق تسويق ڤاليلا 🟡', at:'20:31', text:'ريم: اللي لقى جوال يوسف… لا يفتح القروب 😭'},
    {ico:APPICON.phone, app:'phone', head:'مكالمات فائتة (٣)', at:'20:38', text:'CEO ڤاليلا'},
    {ico:APPICON.calendar(calData), app:'calendar', head:'التقويم', at:'20:30', text:fx('🚀 إطلاق «ثلاثة على كيفك» — بعد {LIN} دقيقة')},
  ];
  const box = $('#lockNotifs'); box.innerHTML = '';
  items.forEach(n => {
    const b = el(`<button class="notif"><div class="n-ico">${n.ico}</div><div class="n-body"><div class="n-head"><span>${esc(n.head)}</span><span class="n-time">${t12(n.at)}</span></div><div class="n-text">${esc(n.text)}</div></div></button>`);
    b.addEventListener('click', e => { e.stopPropagation(); unlock(() => openApp(n.app, n.chat)); });
    box.appendChild(b);
  });
  box.appendChild(el(`<div class="notif stack">+ ١٤ إشعار من واتساب</div>`));
}
function unlock(then){
  if (unlocked){ then && then(); return; }
  unlocked = true;
  lock.classList.add('gone');
  wall.classList.add('dim');
  home.classList.add('on'); home.setAttribute('aria-hidden', 'false');
  setTimeout(() => { then && then(); }, then ? 380 : 0);
  scheduleLive();
}
(function lockGestures(){
  let y0 = null;
  lock.addEventListener('pointerdown', e => { if (e.target.closest('.notif')) return; y0 = e.clientY; });
  addEventListener('pointerup', e => {
    if (y0 === null) return;
    const dy = y0 - e.clientY; y0 = null;
    if (dy > 50 || Math.abs(dy) < 6) unlock();
  });
  addEventListener('keydown', e => {
    if (!unlocked && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp')) unlock();
    if (e.key === 'Escape'){ if (viewer.classList.contains('on')) closeViewer(); else if (stack.length > 1) pop(); else closeApp(); }
  });
})();

/* ---------- home ---------- */
const HOME = [
  {widget:true},
  {id:'calendar', lbl:'التقويم'}, {id:'photos', lbl:'الصور'},
  {id:'camera', lbl:'الكاميرا'}, {id:'clock', lbl:'الساعة'},
  {id:'files', lbl:'الملفات'}, {id:'weather', lbl:'الطقس'}, {id:'calc', lbl:'الحاسبة'}, {id:'notes', lbl:'الملاحظات'},
  {id:'valila', lbl:'ڤاليلا'}, {id:'maps', lbl:'الخرائط'}, {id:'settings', lbl:'الإعدادات'},
];
const DOCK = [{id:'phone', badge:3}, {id:'safari'}, {id:'whatsapp', badge:'wa'}, {id:'music'}];
function iconFor(id){ return id === 'calendar' ? APPICON.calendar(calData) : APPICON[id]; }
function waBadge(){ return CHATS.reduce((s, c) => s + (read.has(c.id) ? 0 : c.unread), 0); }
function renderHome(){
  const g = $('#homeGrid'); g.innerHTML = '';
  HOME.forEach(a => {
    if (a.widget){
      const w = el(`<div class="widget-wrap"><button class="widget"><div class="w-head">◉ الملاحظات</div><div class="w-title">خطة الإطلاق 🚀</div><div class="w-line"><s>موافقة المدير</s> ✅</div><div class="w-line">${fx('الإطلاق الساعة {L} 🚀')}</div><div class="w-line">لا أضيّع جوالي 🙃</div></button><span class="lbl">الملاحظات</span></div>`);
      w.querySelector('.widget').addEventListener('click', () => openApp('notes', 'plan'));
      g.appendChild(w); return;
    }
    g.appendChild(appButton(a.id, a.lbl));
  });
  const d = $('#dock'); d.innerHTML = '';
  DOCK.forEach(a => d.appendChild(appButton(a.id, '', a.badge)));
}
function appButton(id, lbl, badge){
  const n = badge === 'wa' ? waBadge() : badge;
  const b = el(`<button class="app" data-app="${id}">${n ? `<span class="badge">${ar(n)}</span>` : ''}<span class="ico">${iconFor(id)}</span><span class="lbl">${lbl}</span></button>`);
  b.addEventListener('click', () => openApp(id));
  return b;
}

/* ---------- app window & navigation ---------- */
function setChrome(dark){ statusbar.classList.toggle('dark', !!dark); indicator.classList.toggle('dark', !!dark); }
function openApp(id, arg){
  const fn = APPS[id];
  if (!fn){ return; }
  const r = fn(arg);
  if (r === false) return; // toast-only apps
  appwin.innerHTML = ''; stack = [];
  current = id;
  push(r, true);
  appwin.classList.add('on'); appwin.setAttribute('aria-hidden', 'false');
  home.classList.add('behind');
}
function push(view, first){
  const v = view.node;
  if (!first) v.classList.add('push');
  appwin.appendChild(v);
  stack.push(view);
  setChrome(view.dark);
  view.after && view.after(v);
}
function pop(){
  if (stack.length <= 1) return closeApp();
  const top = stack.pop();
  top.node.classList.add('pop');
  setTimeout(() => top.node.remove(), 280);
  const under = stack[stack.length - 1];
  setChrome(under.dark);
  under.refresh && under.refresh(under.node);
}
function closeApp(){
  if (!current) return;
  appwin.querySelectorAll('video').forEach(v => v.pause());
  appwin.classList.remove('on'); appwin.setAttribute('aria-hidden', 'true');
  home.classList.remove('behind');
  setChrome(false);
  current = null;
  setTimeout(() => { if (!current){ appwin.innerHTML = ''; stack = []; } }, 420);
  renderHome();
}
indicator.addEventListener('click', () => { if (viewer.classList.contains('on')) closeViewer(); else if (!unlocked) unlock(); else closeApp(); });
function backBtn(label){ const b = el(`<button class="back">${I.back}<span>${label}</span></button>`); b.addEventListener('click', pop); return b; }
function view(cls, html){ return el(`<div class="view ${cls}">${html}</div>`); }

/* ---------- viewer (photos / video) ---------- */
function openViewer({src, video, title = '', cta}){
  viewer.innerHTML = '';
  const top = el(`<div class="v-top"><button>تم</button><span>${esc(title)}</span><span style="width:30px"></span></div>`);
  top.querySelector('button').addEventListener('click', closeViewer);
  const main = el(`<div class="v-main"></div>`);
  if (video){
    const v = el(`<video src="${IMG}${video}" poster="${IMG}ad_poster.jpg" controls playsinline autoplay></video>`);
    main.appendChild(v);
  } else main.appendChild(el(`<img src="${src}" alt="">`));
  viewer.append(top, main);
  if (cta) viewer.appendChild(el(`<a class="cta yellow v-cta" href="${STORE}" target="_blank" rel="noopener">اطلب الآن من ڤاليلا</a>`));
  viewer.classList.add('on');
  setChrome(false);
}
function closeViewer(){
  viewer.querySelectorAll('video').forEach(v => v.pause());
  viewer.classList.remove('on'); viewer.innerHTML = '';
  if (stack.length) setChrome(stack[stack.length - 1].dark);
}

/* ================= APPS ================= */
const APPS = {};

/* ---------- WhatsApp ---------- */
APPS.whatsapp = (chatId) => {
  const v = view('wa', `
    <div class="wa-top">
      <div class="row"><span class="circle">${I.dots}</span><span style="display:flex;gap:10px"><span class="circle">${I.cam}</span><span class="circle" style="background:#25d366;color:#0b141a">${I.plus}</span></span></div>
      <h1>الدردشات</h1>
      <div class="wa-search">${I.search}<span>اسأل Meta AI أو ابحث</span></div>
      <div class="wa-chips"><span class="on">الكل</span><span>غير مقروءة</span><span>المفضلة</span><span>المجموعات</span></div>
    </div>
    <div class="scroll"><div class="wa-archived">${I.archive}<span>المؤرشفة</span></div><div class="list"></div></div>
    <div class="wa-tabs">
      <div><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-dasharray="4 2"/></svg>التحديثات</div>
      <div><svg viewBox="0 0 24 24">${I.call.replace(/<\/?svg[^>]*>/g,'')}</svg>المكالمات</div>
      <div><svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="3.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 19a6 6 0 0 1 12 0M16 6.5a3 3 0 0 1 0 5.5M18 19a5 5 0 0 0-2.5-4.3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>المجتمعات</div>
      <div class="on"><span class="tb tb-wa"></span><svg viewBox="0 0 24 24"><path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5z" fill="currentColor"/></svg>الدردشات</div>
      <div><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M5.2 18.8l2.1-2.1M16.7 7.3l2.1-2.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>الإعدادات</div>
    </div>`);
  const refresh = (node) => {
    const list = node.querySelector('.list'); list.innerHTML = '';
    CHATS.forEach(c => {
      const un = read.has(c.id) ? 0 : c.unread;
      const at = LAST_AT[c.id];
      const row = el(`<button class="chat-row">${avatarHTML(c)}<div class="c-main"><div class="c-top"><span class="c-name">${esc(c.name)}</span><span class="c-time ${un ? 'unread' : ''}">${listTime(at)}</span></div><div class="c-bottom"><span class="c-last">${esc(lastPreview(c))}</span>${un ? `<span class="c-count">${ar(un)}</span>` : (c.pinned ? I.pin : '')}</div></div></button>`);
      row.addEventListener('click', () => push(chatView(c)));
      list.appendChild(row);
    });
    const tb = node.querySelector('.tb-wa'); const n = waBadge();
    tb.textContent = ar(n); tb.style.display = n ? '' : 'none';
  };
  const r = {node:v, dark:false, refresh, after:(node) => { refresh(node); if (chatId){ const c = CHATS.find(x => x.id === chatId); if (c) push(chatView(c)); } }};
  return r;
};

function chatView(c){
  read.add(c.id);
  const v = view('wa', `
    <div class="chat-head"><span class="bk"></span>${avatarHTML(c)}<div class="h-main"><div class="h-name">${esc(c.name)}</div><div class="h-sub">${esc(c.sub || 'اضغط هنا لمعلومات جهة الاتصال')}</div></div><div class="h-ico">${I.video}${I.call}</div></div>
    <div class="chat-body"></div>
    <div class="chat-input">${I.plus}<div class="field">رسالة</div>${I.cam}${I.mic}</div>`);
  v.querySelector('.bk').replaceWith(backBtn(''));
  const body = v.querySelector('.chat-body');
  let prevSide = null, ds = 0, lastDay = null;
  c.msgs.forEach(m => {
    if (m.day){ ds = m.day === 'أمس' ? -1 : 0; return; }
    if (m.at){ const d = T(m.at, ds), k = dayKey(d); if (k !== lastDay){ lastDay = k; body.appendChild(el(`<div class="day">${dayLabel(d)}</div>`)); prevSide = null; } }
    if (m.sys){ body.appendChild(el(`<div class="sysmsg">${esc(m.sys)}</div>`)); prevSide = null; return; }
    const side = m.me ? 'me' : (m.p || 'them');
    const first = side !== prevSide; prevSide = side;
    const meta = `<span class="meta">${m.me ? I.ticks : ''}${t12(m.at, ds)}</span>`;
    const who = (c.group && !m.me && first) ? `<div class="who" style="color:${P[m.p].color}">${esc(P[m.p].name)}</div>` : '';
    let inner, bcls = '';
    if (m.img){
      bcls = 'img' + (m.cap ? ' cap-on' : '');
      inner = `${who ? `<div style="padding:3px 6px 4px">${who}</div>` : ''}<img src="${IMG}${m.img}" alt="" data-full="${IMG}${m.img}">${m.cap ? `<div class="cap">${esc(m.cap)}${meta}</div>` : meta}`;
    } else if (m.voice){
      inner = `${who}<div class="voice"><button class="play">${I.play}</button><div class="wave">${Array.from({length:30},(_, i)=>`<i style="height:${6 + Math.abs(Math.sin(i * 1.7) * 18) + (i % 4) * 2}px"></i>`).join('')}</div><div class="vav" style="background:${P[m.p] ? P[m.p].color : '#6a7175'};color:#0b141a">${(P[m.p] ? P[m.p].name : 'ف')[0]}</div></div><div class="voice-time">${ar(m.voice)}${meta}</div>`;
    } else if (m.sticker){
      bcls = 'sticker'; inner = m.sticker;
    } else if (m.link){
      inner = `${who}<a class="link-card" href="${STORE}" target="_blank" rel="noopener"><img src="${IMG}offer.jpg" alt="" style="object-position:center 20%"><div class="lc-t">ثلاثة على كيفك | عطور ڤاليلا</div><div class="lc-d">اشتر عطرين من العطور المختارة وخذ الثالث مجانًا</div></a>${esc(m.t)}<br><a class="link" href="${STORE}" target="_blank" rel="noopener">${STORE_LABEL}</a>${meta}`;
    } else {
      inner = `${who}${esc(m.t)}${meta}`;
    }
    const row = el(`<div class="msg ${m.me ? 'me' : 'them'} ${first ? 'first' : ''}"><div class="bubble ${bcls}">${inner}</div></div>`);
    body.appendChild(row);
  });
  body.querySelectorAll('.msg').forEach(r => { const n = r.nextElementSibling; if (!n || !n.classList.contains('msg') || n.classList.contains('first')) r.classList.add('last'); });
  body.querySelectorAll('img[data-full]').forEach(img => img.addEventListener('click', () => openViewer({src:img.dataset.full, title:c.short, cta:true})));
  body.querySelectorAll('.voice').forEach(vc => {
    const btn = vc.querySelector('.play'), bars = [...vc.querySelectorAll('.wave i')];
    const total = 9;
    let timer = null, stopAudio = null;
    const stop = () => { clearInterval(timer); timer = null; stopAudio && stopAudio(); stopAudio = null; btn.innerHTML = I.play; bars.forEach(b => b.classList.remove('on')); };
    btn.addEventListener('click', () => {
      if (timer) return stop();
      btn.innerHTML = I.pause;
      stopAudio = playGarbled(total);
      const t0 = Date.now();
      timer = setInterval(() => {
        const p = (Date.now() - t0) / (total * 1000);
        bars.forEach((b, i) => b.classList.toggle('on', i / bars.length <= p));
        if (p >= 1) stop();
      }, 100);
    });
  });
  return {node:v, dark:false, after:() => {
    const go = () => { body.scrollTop = body.scrollHeight; };
    go(); requestAnimationFrame(go);
    const t = Date.now();
    body.querySelectorAll('img').forEach(i => i.addEventListener('load', () => { if (Date.now() - t < 2500) go(); }, {once:true}));
  }};
}

/* ---------- Safari: Valila store ---------- */
APPS.safari = (mode) => {
  const prods = PRODUCTS.map(p => `
    <a class="product" href="${STORE}" target="_blank" rel="noopener">
      ${p.low ? '<span class="tag low">كمية محدودة</span>' : '<span class="tag">ضمن العرض</span>'}
      <div class="pimg"><img src="${BOT}${p.f}.png" alt="${esc(p.n)}" loading="lazy"></div>
      <div class="pname">${esc(p.n)}</div>
      <div class="price">${ar(p.p)} ر.س <s>${ar(p.r)} ر.س</s></div>
    </a>`).join('');
  const v = view('safari', `
    <div class="page">
      <div class="st-head"><span class="cart">${I.cart}<b>٣</b></span><img src="${IMG}valila_wordmark_white.svg" alt="VALILA"><span style="width:26px"></span></div>
      <div class="st-strip"><span>🎁 ثلاثة على كيفك · اشتر عطرين وخذ الثالث مجانًا · قسّطها مع تابي وتمارا 🎁</span></div>
      ${mode === 'found' ? `<div class="found-card"><b>شكرًا إنك لقيت جوال يوسف 🙏</b><span>ردّ الجميل علينا: هذا عرضنا الجديد… اختر ٣ عطور وادفع حق ٢ بس 🎁</span></div>` : ''}
      <a class="st-hero" href="${STORE}" target="_blank" rel="noopener"><img src="${IMG}offer.jpg" alt="ثلاثة على كيفك"></a>
      <div class="st-section"><h2>كيف يشتغل العرض؟</h2>
        <div class="steps">
          <div class="step"><b>١</b><span>اختر العطر الأول</span></div>
          <div class="step"><b>٢</b><span>اختر العطر الثاني</span></div>
          <div class="step free"><b>٣</b><span>الثالث علينا 🎁 مجانًا</span></div>
        </div>
      </div>
      <a class="cta" href="${STORE}" target="_blank" rel="noopener">اطلب الآن</a>
      <div class="pay"><span>قسّطها بكل سهولة مع</span><img src="${IMG}tabby.png" alt="tabby"><img src="${IMG}tamara.png" alt="tamara"></div>
      <div class="st-section"><h2>العطور المختارة</h2><p>اختر أي ثلاثة على كيفك… وادفع حق اثنين بس.</p></div>
      <div class="products">${prods}</div>
      <a class="cta yellow" href="${STORE}" target="_blank" rel="noopener">اختر عطورك الثلاثة</a>
      <div class="st-foot"><img src="${IMG}valila_logo_full_yellow.svg" alt="ڤاليلا"><div>عطور ڤاليلا · تحف عطرية تبقى في الذاكرة</div><a href="${STORE}" target="_blank" rel="noopener">www.valila.net</a></div>
    </div>
    <div class="safari-bar">
      <div class="url">${I.lock}<span>valila.net</span></div>
      <div class="sf-tools"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><svg viewBox="0 0 24 24" opacity=".35"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><svg viewBox="0 0 24 24"><path d="M12 3v12M7.5 7.5L12 3l4.5 4.5M5 12v8h14v-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><svg viewBox="0 0 24 24"><path d="M4 5.5C7 4 10 4 12 6c2-2 5-2 8-.5V19c-3-1.5-6-1.5-8 .5-2-2-5-2-8-.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg><svg viewBox="0 0 24 24"><rect x="4" y="7" width="13" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 4h9.5A2.5 2.5 0 0 1 20 6.5V16" fill="none" stroke="currentColor" stroke-width="1.7"/></svg></div>
    </div>`);
  return {node:v, dark:true};
};
APPS.valila = APPS.safari;

/* ---------- Photos: a real-looking camera roll of perfumes ---------- */
const ROLL = [
  {b:'raw_green'}, {b:'ego'}, {b:'celine'},
  {b:'bella'}, {b:'smoky'}, {b:'dont_touch'},
  {b:'midnight'}, {b:'jassar'}, {b:'tiger'},
  {b:'moon'}, {b:'s6'}, {b:'martin'},
  {b:'no_name'}, {img:'endcard.jpg'}, {img:'campaign_unique.jpg'},
  {img:'trio6.jpg'}, {img:'trio5.jpg'}, {img:'trio4.jpg'},
  {img:'campaign_noname.jpg'}, {img:'trio3.jpg'}, {img:'trio2.jpg'},
  {img:'trio1.jpg'}, {video:'ad.mp4', poster:'ad_poster.jpg', dur:'0:23'}, {img:'offer.jpg'},
];
APPS.photos = () => {
  const cells = ROLL.map((r, i) => {
    if (r.video) return `<button data-i="${i}"><img src="${IMG}${r.poster}" alt="" loading="lazy"><span class="dur">${ar(r.dur)}</span></button>`;
    if (r.b) return `<button data-i="${i}" class="bottle-bg"><img src="${BOT}${r.b}.png" alt="" loading="lazy"></button>`;
    return `<button data-i="${i}"><img src="${IMG}${r.img}" alt="" loading="lazy"></button>`;
  }).join('');
  const v = view('ios photos', `
    <div class="navbar"><div class="nav-row"><span></span><span style="color:#0a84ff;font-size:17px">تحديد</span></div><div class="big-title">المكتبة</div><div style="color:#8e8e93;font-size:14px;margin-top:2px">${ar(ROLL.length + 1183)} صورة، ${ar(41)} فيديو</div></div>
    <div class="scroll"><div class="ph-grid">${cells}</div><div style="text-align:center;color:#8e8e93;font-size:13px;padding:14px">اليوم · الرياض</div></div>
    <div class="ph-tabs"><span>سنوات</span><span>أشهر</span><span>أيام</span><span class="on">كل الصور</span></div>`);
  v.querySelectorAll('.ph-grid button').forEach(b => b.addEventListener('click', () => {
    const r = ROLL[+b.dataset.i];
    if (r.video) openViewer({video:r.video, title:'اليوم', cta:true});
    else openViewer({src: r.b ? `${BOT}${r.b}.png` : IMG + r.img, title:'اليوم', cta:true});
  }));
  return {node:v, dark:false, after:(n) => { const s = n.querySelector('.scroll'); s.scrollTop = s.scrollHeight; }};
};

/* ---------- Notes ---------- */
const NOTES = {
  plan: {title:'خطة إطلاق «ثلاثة على كيفك»', at:'{d:19:45}', html:`
    <div class="check on"><i></i><span>تصاميم الإعلان (ريم)</span></div>
    <div class="check on"><i></i><span>صفحة العرض في المتجر (نواف)</span></div>
    <div class="check on"><i></i><span>التأكد من المخزون (أبو سعد)</span></div>
    <div class="check on"><i></i><span>تفعيل تابي وتمارا</span></div>
    <div class="check on"><i></i><span>إقناع المدير 😅</span></div>
    <div class="check"><i></i><span>الإطلاق الساعة <b class="hl">{L}</b> 🚀</span></div>
    <div class="check"><i></i><span>لا أحد يعرف عن العرض قبل الإطلاق 🤐</span></div>
    <div class="check"><i></i><span>لا أضيّع جوالي 🙃</span></div>`},
  names: {title:'أسماء العرض', at:'أمس', html:`
    <p><s>عرض ٣×٢</s></p><p><s>الثالث علينا</s></p><p><s>ثلاثي ڤاليلا</s></p><p><s>العرض الذهبي</s></p>
    <p>✅ <b class="hl">ثلاثة على كيفك</b></p><p style="color:#8e8e93;font-size:15px">الفكرة: العميل يختار ٣ عطور على ذوقه، ويدفع حق ٢ بس.</p>`},
  list: {title:'العطور المختارة للعرض', at:'{d:14:10}', html:
    PRODUCTS.map(p => `<p>• ${esc(p.n)}${p.low ? ' <b class="hl">(كمية قليلة)</b>' : ''}</p>`).join('')},
  pitch: {title:'كلام للمدير 🙏', at:'{d:15:05}', html:`
    <p>١. العميل ياخذ ٣ بدل ١ = سلة أكبر</p><p>٢. يجرب عطور جديدة ويرجع يطلبها</p><p>٣. تابي وتمارا = يقسّطها بسهولة</p><p>٤. الاسم: ثلاثة على كيفك 😎</p><p style="color:#8e8e93">إذا قال لا… أوريه التصميم 😅</p>`},
};
APPS.notes = (noteId) => {
  const rows = Object.entries(NOTES).map(([k, n]) => `<button class="ios-row" data-k="${k}"><div class="r-main"><div class="r-title">${esc(n.title)}</div><div class="r-sub">${n.at} · ${esc(n.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40))}</div></div></button>`).join('');
  const v = view('ios notes', `<div class="navbar"><div class="nav-row"><span></span><span></span></div><div class="big-title">الملاحظات</div></div><div class="scroll"><div class="ios-list">${rows}</div></div>`);
  const open = (k) => {
    const n = NOTES[k];
    const nv = view('ios notes', `<div class="navbar"><div class="nav-row"><span class="bk"></span><span style="color:#e5b100">${I.dots}</span></div></div><div class="scroll"><div class="note-body"><div class="nd">${n.at}</div><h2>${esc(n.title)}</h2>${n.html}</div></div>`);
    nv.querySelector('.bk').replaceWith(backBtn('الملاحظات'));
    nv.querySelector('.nav-row > span:last-child').style.width = '22px';
    push({node:nv, dark:false});
  };
  v.querySelectorAll('.ios-row').forEach(r => r.addEventListener('click', () => open(r.dataset.k)));
  return {node:v, dark:false, after:() => { if (noteId) open(noteId); }};
};

/* ---------- Files ---------- */
let filesWarned = false;
const FILES = [
  {k:'secret', ico:'pdf', name:'لا_تفتح.pdf', meta:'{d:19:42} · ٢٫١ م.ب 🔒'},
  {k:'video', ico:'mp4', name:'إعلان_العرض_النهائي.mp4', meta:'{d:18:10} · ١ م.ب'},
  {k:'list', ico:'pdf', name:'قائمة_العطور_المختارة.pdf', meta:'{d:14:10} · ٣٤٠ ك.ب'},
  {k:'stock', ico:'pdf', name:'جرد_المستودع.pdf', meta:'{d:16:15} · ١٢٠ ك.ب'},
];
APPS.files = () => {
  const v = view('ios files', `<div class="navbar"><div class="nav-row"><span></span><span></span></div><div class="big-title">التصفح</div></div>
    <div class="scroll"><div class="ios-list"><button class="ios-row" data-folder="1"><span class="file-ico">${I.folderLock}</span><div class="r-main"><div class="r-title">لا تفتح 🔒</div><div class="r-sub">٤ عناصر · أمس</div></div>${I.chev}</button>
    <div class="ios-row"><span class="file-ico">${I.folder}</span><div class="r-main"><div class="r-title">تصاميم ڤاليلا</div><div class="r-sub">٢٣٨ عنصرًا</div></div>${I.chev}</div>
    <div class="ios-row"><span class="file-ico">${I.folder}</span><div class="r-main"><div class="r-title">فواتير</div><div class="r-sub">١٢ عنصرًا</div></div>${I.chev}</div></div></div>`);
  v.querySelectorAll('.ios-row:not([data-folder])').forEach(r => r.addEventListener('click', () => toast('📁 المجلد فاضي… الشغل كله في «لا تفتح»')));
  v.querySelector('[data-folder]').addEventListener('click', () => {
    const fv = view('ios files', `<div class="navbar"><div class="nav-row"><span class="bk"></span><span></span></div><div class="big-title" style="font-size:26px">لا تفتح 🔒</div></div><div class="scroll"><div class="ios-list">${FILES.map(f => `<button class="ios-row" data-k="${f.k}"><span class="file-ico">${I[f.ico]}</span><div class="r-main"><div class="r-title" style="font-size:15px">${esc(f.name)}</div><div class="r-sub">${f.meta}</div></div></button>`).join('')}</div></div>`);
    fv.querySelector('.bk').replaceWith(backBtn('التصفح'));
    fv.querySelectorAll('[data-k]').forEach(r => r.addEventListener('click', () => r.dataset.k === 'secret' ? faceIdThen(() => openFile('secret')) : openFile(r.dataset.k)));
    push({node:fv, dark:false});
    if (!filesWarned){ filesWarned = true; setTimeout(() => { incoming('team', {p:'reem', t:'لا أحد يفتح الملفات اللي في هالجوال 😭'}); banner({head:'فريق تسويق ڤاليلا 🟡', text:'ريم: لا أحد يفتح الملفات اللي في هالجوال 😭', onTap:() => openApp('whatsapp', 'team')}); }, 1200); }
  });
  return {node:v, dark:false};
};
function openFile(k){
  if (k === 'video') return openViewer({video:'ad.mp4', title:'إعلان_العرض_النهائي.mp4', cta:true});
  const f = FILES.find(x => x.k === k);
  let paper = '';
  if (k === 'secret') paper = `
    <span class="stamp">سري — قبل الإطلاق</span>
    <h3>قلنا لك لا تفتح 😅</h3>
    <p>طيب… بما إنك فتحت، خلنا نقولك السر:</p>
    <p style="margin-top:8px"><b>عرض «ثلاثة على كيفك» من ڤاليلا</b><br>اشتر عطرين من العطور المختارة… <b class="free">وخذ الثالث مجانًا 🎁</b></p>
    <img src="${IMG}offer.jpg" alt="" style="border-radius:10px;margin:12px 0">
    <p>وتقدر تقسّطها مع تابي وتمارا.</p>
    <a class="cta" style="margin:14px 0 0" href="${STORE}" target="_blank" rel="noopener">اطلب الآن قبل يخلص المخزون</a>
    <p style="font-size:12px;color:#8a7f72;margin-top:10px;text-align:center">ولا تقول ليوسف إنك شفت الملف 🤫</p>`;
  else if (k === 'list') paper = `
    <h3>العطور المختارة لعرض ثلاثة على كيفك</h3>
    <table><tr><th>العطر</th><th>السعر</th></tr>${PRODUCTS.map(p => `<tr><td>${esc(p.n)}</td><td>${ar(p.p)} ر.س</td></tr>`).join('')}</table>
    <p>اختر أي ٣ → تدفع حق ٢ → <b class="free">الثالث مجانًا</b></p>
    <a class="cta" style="margin:14px 0 0" href="${STORE}" target="_blank" rel="noopener">تسوّق العرض</a>`;
  else if (k === 'stock') paper = `
    <span class="stamp">داخلي</span>
    <h3>جرد المستودع — قبل الإطلاق</h3>
    <table><tr><th>العطر</th><th>الحالة</th></tr>
      ${PRODUCTS.slice(0, 9).map(p => `<tr><td>${esc(p.n)}</td><td>${p.low ? '<b style="color:#c0392b">كمية قليلة ⚠️</b>' : 'متوفر ✅'}</td></tr>`).join('')}
    </table>
    <p>ملاحظة أبو سعد: «الأكياس الصفراء جاهزة، والتغليف جاهز. أول ما ينزل الطلب نشحنه.»</p>`;
  const dv = view('doc', `<div class="navbar"><div class="nav-row"><span class="bk"></span><span style="font-size:14px;color:#aaa;max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(f.name)}</span></div></div><div class="scroll"><div class="paper">${paper}</div></div>`);
  dv.querySelector('.bk').replaceWith(backBtn('رجوع'));
  push({node:dv, dark:false});
}

/* ---------- Calendar ---------- */
APPS.calendar = () => {
  const days = [];
  for (let i = -3; i <= 3; i++){
    const d = new Date(today); d.setDate(d.getDate() + i);
    days.push(`<div class="${i === 0 ? 'on' : ''}">${new Intl.DateTimeFormat('ar', {weekday:'narrow'}).format(d)}<b>${ar(d.getDate())}</b></div>`);
  }
  const month = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-arab', {month:'long', year:'numeric'}).format(today);
  const v = view('ios cal', `<div class="navbar"><div class="nav-row"><span style="color:#ff453a;font-size:17px">${month}</span><span></span></div></div>
    <div class="cal-days">${days.join('')}</div>
    <div class="scroll">
      <div class="cal-ev green"><div class="t">${t12('11:00')}</div><div class="e">اجتماع فريق التسويق<small>تصاميم «ثلاثة على كيفك»</small></div></div>
      <div class="cal-ev"><div class="t">${t12('15:00')}</div><div class="e">إقناع المدير بالعرض 😬<small>مكتب الـCEO</small></div></div>
      <div class="cal-ev"><div class="t">${t12('16:00')}</div><div class="e">تجهيز المستودع والأكياس الصفراء<small>أبو سعد</small></div></div>
      <div class="cal-ev gold"><div class="t">${fmt(LAUNCH)}</div><div class="e">🚀 إطلاق «ثلاثة على كيفك»<small>valila.net · اشتر عطرين وخذ الثالث مجانًا</small></div></div>
      <div class="cal-ev green"><div class="t">${fmt(new Date(LAUNCH.getTime() + 3600000))}</div><div class="e">عشا عند أمي 🍽️</div></div>
    </div>`);
  v.querySelector('.cal-ev.gold').addEventListener('click', () => openApp('safari'));
  return {node:v, dark:false};
};

/* ---------- Phone ---------- */
const CALLS = [
  {n:'CEO ڤاليلا', c:3, at:'20:38', miss:1},
  {n:'نورة 🌸', c:1, at:'20:06', miss:1},
  {n:'فهد | إعلانات', c:2, at:'19:50', miss:1},
  {n:'أبو سعد | المستودع', c:1, at:'16:20', dur:184},
  {n:'CEO ڤاليلا', c:1, at:'15:02', dur:412},
  {n:'أمي ❤️', c:1, at:'13:10', dur:95},
];
APPS.phone = () => {
  const fmtDur = (s) => s >= 60 ? `${ar(Math.round(s / 60))} دقائق` : `${ar(s)} ثانية`;
  const v = view('ios calls', `<div class="navbar"><div class="nav-row"><span></span><span style="color:#0a84ff;font-size:17px">تعديل</span></div><div class="big-title">الأخيرة</div></div>
    <div class="scroll"><div class="ios-list">${CALLS.map(c => `<div class="ios-row ${c.miss ? 'missed' : ''}"><span class="phone-ico">${SILHOUETTE}</span><div class="r-main"><div class="r-title">${esc(c.n)}${c.c > 1 ? ` (${ar(c.c)})` : ''}</div><div class="r-sub">${c.miss ? 'مكالمة فائتة' : 'جوال · ' + fmtDur(c.dur || 1)}</div></div><span style="color:#8e8e93;font-size:14px">${t12(c.at)}</span></div>`).join('')}</div></div>
    <div class="ph-tabs"><span>المفضلة</span><span class="on">الأخيرة</span><span>جهات الاتصال</span><span>لوحة المفاتيح</span></div>`);
  v.querySelectorAll('.ios-row').forEach(r => r.addEventListener('click', () => toast('📵 ما تقدر تتصل من جوال ضايع 😅')));
  return {node:v, dark:false};
};

/* ---------- Calculator ---------- */
APPS.calc = () => {
  const v = view('calc', `<div class="disp"><div class="expr">١٨٠ + ١٨٠ + ١٨٠ − ١٨٠</div><div class="res">٣٦٠</div><div class="memo">٣ عطور… وتدفع حق ٢ بس 😎</div></div>
    <div class="keys">${['AC','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','='].map(k => `<button class="${'AC±%'.includes(k) ? 'fn' : ('÷×−+='.includes(k) ? 'op' : '')} ${k === '0' ? 'zero' : ''}">${ar(k)}</button>`).join('')}</div>`);
  v.querySelectorAll('.keys button').forEach(b => b.addEventListener('click', () => toast('الحسبة خلصت: ٣ عطور بسعر ٢ 🎁')));
  return {node:v, dark:false};
};

/* ---------- toast-only apps ---------- */
const soon = (msg) => () => { toast(msg); return false; };
APPS.weather = soon('☀️ الرياض ٢٢° · صافي');
APPS.maps = soon('📍 آخر موقع: مكتب ڤاليلا');

/* ---------- Camera: live-looking viewfinder over Yousef's desk ---------- */
const SHOTS = [];
APPS.camera = () => {
  const modes = ['حركة','سينمائي','فيديو','صورة','بورتريه','بانوراما'];
  const v = view('cam', `
    <div class="cam-top"><span class="cam-flash">⚡︎</span><span class="cam-chev">⌃</span><span class="cam-live">◎</span></div>
    <div class="cam-view"><div class="cam-scene"><img src="${IMG}trio2.jpg" alt=""></div><div class="cam-grid"></div><div class="cam-focus"></div><div class="cam-shot-flash"></div></div>
    <div class="cam-zoom"><button>٠٫٥</button><button class="on">١×</button><button>٢</button><button>٣</button></div>
    <div class="cam-modes">${modes.map(m => `<span class="${m === 'صورة' ? 'on' : ''}">${m}</span>`).join('')}</div>
    <div class="cam-bottom"><button class="cam-thumb"></button><button class="cam-shutter" aria-label="التقاط"><i></i></button><button class="cam-flip" aria-label="قلب">⟲</button></div>`);
  const scene = v.querySelector('.cam-scene img'), thumb = v.querySelector('.cam-thumb');
  const frames = ['trio2.jpg','trio4.jpg','trio6.jpg','campaign_unique.jpg'];
  let fi = 0;
  const setThumb = () => { thumb.style.backgroundImage = SHOTS.length ? `url(${IMG}${SHOTS[SHOTS.length - 1]})` : `url(${IMG}trio1.jpg)`; };
  setThumb();
  v.querySelectorAll('.cam-zoom button').forEach(b => b.addEventListener('click', () => {
    v.querySelectorAll('.cam-zoom button').forEach(x => x.classList.remove('on')); b.classList.add('on');
    scene.style.setProperty('--z', {'٠٫٥':1.0,'١×':1.15,'٢':1.6,'٣':2.1}[b.textContent]);
  }));
  v.querySelector('.cam-view').addEventListener('click', e => {
    const f = v.querySelector('.cam-focus'), r = e.currentTarget.getBoundingClientRect();
    f.style.left = (e.clientX - r.left) + 'px'; f.style.top = (e.clientY - r.top) + 'px';
    f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
  });
  v.querySelector('.cam-flip').addEventListener('click', () => { fi = (fi + 1) % frames.length; scene.src = IMG + frames[fi]; });
  v.querySelector('.cam-shutter').addEventListener('click', () => {
    const fl = v.querySelector('.cam-shot-flash'); fl.classList.remove('on'); void fl.offsetWidth; fl.classList.add('on');
    vib(15);
    SHOTS.push(frames[fi]); setThumb();
    thumb.classList.remove('pop'); void thumb.offsetWidth; thumb.classList.add('pop');
  });
  thumb.addEventListener('click', () => openViewer({src: IMG + (SHOTS.length ? SHOTS[SHOTS.length - 1] : 'trio1.jpg'), title:'الآن', cta:true}));
  return {node:v, dark:false};
};

/* ---------- Face ID + passcode (first try always fails, second opens) ---------- */
function faceIdThen(onOpen){
  const ov = el(`<div class="lockflow"><div class="faceid"><div class="fid-ico"><svg viewBox="0 0 64 64"><path d="M6 20V12a6 6 0 0 1 6-6h8M44 6h8a6 6 0 0 1 6 6v8M58 44v8a6 6 0 0 1-6 6h-8M20 58h-8a6 6 0 0 1-6-6v-8" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path class="eyes" d="M22 24v5M42 24v5M32 26v12h-3" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path class="mouth" d="M23 44c3 3 6 4 9 4s6-1 9-4" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg></div><div class="fid-title">استخدم Face ID لفتح الملف</div></div></div>`);
  $('#screen').appendChild(ov);
  const card = ov.querySelector('.faceid');
  setTimeout(() => {
    ov.classList.add('fail'); card.classList.add('shake');
    ov.querySelector('.fid-title').textContent = 'لم يتم التعرف على الوجه';
    ov.querySelector('.mouth').setAttribute('d', 'M23 48c3-3 6-4 9-4s6 1 9 4');
    vib([40, 60, 40]);
    const b = el(`<button class="fid-btn">إدخال رمز الدخول</button>`);
    b.addEventListener('click', e => { e.stopPropagation(); passcode(); });
    card.appendChild(b);
    setTimeout(() => card.classList.remove('shake'), 450);
    ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  }, 1200);
  function passcode(){
    let code = '', tries = 0;
    ov.className = 'lockflow pass';
    ov.innerHTML = `<div class="pc-title">أدخل رمز الدخول</div><div class="pc-hint">تلميح: يوم إطلاق العرض… أو أي رقم 😉</div><div class="pc-dots">${'<span></span>'.repeat(4)}</div><div class="pc-err"></div>
      <div class="pc-pad">${[['1',''],['2','ABC'],['3','DEF'],['4','GHI'],['5','JKL'],['6','MNO'],['7','PQRS'],['8','TUV'],['9','WXYZ']].map(([n,l]) => `<button data-n="${n}">${n}<small>${l}</small></button>`).join('')}<span></span><button data-n="0">0</button><span></span></div>
      <div class="pc-actions"><button class="pc-cancel">إلغاء</button></div>`;
    const dots = [...ov.querySelectorAll('.pc-dots span')], err = ov.querySelector('.pc-err'), act = ov.querySelector('.pc-cancel');
    const paint = () => { dots.forEach((d, i) => d.classList.toggle('on', i < code.length)); act.textContent = code ? 'حذف' : 'إلغاء'; };
    act.addEventListener('click', () => { if (code){ code = code.slice(0, -1); paint(); } else ov.remove(); });
    ov.querySelectorAll('[data-n]').forEach(k => k.addEventListener('click', () => {
      if (code.length >= 4) return;
      code += k.dataset.n; err.textContent = ''; paint();
      if (code.length < 4) return;
      setTimeout(() => {
        if (tries === 0){
          tries = 1; err.textContent = 'رمز غير صحيح';
          ov.querySelector('.pc-dots').classList.add('shake'); vib([60, 40, 60]);
          setTimeout(() => { ov.querySelector('.pc-dots').classList.remove('shake'); code = ''; paint(); }, 450);
        } else { ov.remove(); onOpen(); }
      }, 140);
    }));
  }
}

/* ---------- Settings ---------- */
const SETG = {"plane": "<svg viewBox=\"0 0 24 24\"><path d=\"M21 15.5v-1.8l-7.5-4.6V4.2a1.5 1.5 0 0 0-3 0v4.9L3 13.7v1.8l7.5-2.3v4.9l-2 1.5V21l3.5-1 3.5 1v-1.4l-2-1.5v-4.9z\" fill=\"#fff\"/></svg>", "wifi": "<svg viewBox=\"0 0 24 24\"><path d=\"M12 19.5l2.6-3a3.6 3.6 0 0 0-5.2 0zM6.4 13l1.7 2a5.8 5.8 0 0 1 7.8 0l1.7-2a8.4 8.4 0 0 0-11.2 0zM3 9.2l1.7 2a11 11 0 0 1 14.6 0l1.7-2a13.6 13.6 0 0 0-18 0z\" fill=\"#fff\"/></svg>", "bt": "<svg viewBox=\"0 0 24 24\"><path d=\"M7 7.5l10 9-5 4.5V3l5 4.5-10 9\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.9\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></svg>", "cell": "<svg viewBox=\"0 0 24 24\"><path d=\"M12 9v12M8 5.5a5.5 5.5 0 0 0 0 7M16 5.5a5.5 5.5 0 0 1 0 7M5.5 3a9 9 0 0 0 0 12M18.5 3a9 9 0 0 1 0 12\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.8\" stroke-linecap=\"round\"/><circle cx=\"12\" cy=\"9\" r=\"1.8\" fill=\"#fff\"/></svg>", "batt": "<svg viewBox=\"0 0 24 24\"><rect x=\"2.5\" y=\"8\" width=\"17\" height=\"9\" rx=\"2.2\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.6\"/><rect x=\"4.3\" y=\"9.8\" width=\"3\" height=\"5.4\" rx=\".8\" fill=\"#fff\"/><path d=\"M21 11v3\" stroke=\"#fff\" stroke-width=\"1.6\" stroke-linecap=\"round\"/></svg>", "gear": "<svg viewBox=\"0 0 24 24\"><path d=\"M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8.4 5.1l-1.8-.4a6.8 6.8 0 0 0 0-2.4l1.8-.4-.9-2.2-1.6.9a7 7 0 0 0-1.7-1.7l.9-1.6-2.2-.9-.4 1.8a6.8 6.8 0 0 0-2.4 0l-.4-1.8-2.2.9.9 1.6a7 7 0 0 0-1.7 1.7l-1.6-.9-.9 2.2 1.8.4a6.8 6.8 0 0 0 0 2.4l-1.8.4.9 2.2 1.6-.9a7 7 0 0 0 1.7 1.7l-.9 1.6 2.2.9.4-1.8a6.8 6.8 0 0 0 2.4 0l.4 1.8 2.2-.9-.9-1.6a7 7 0 0 0 1.7-1.7l1.6.9z\" fill=\"#fff\"/></svg>", "sun": "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"4.2\" fill=\"#fff\"/><g stroke=\"#fff\" stroke-width=\"1.8\" stroke-linecap=\"round\"><path d=\"M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6\"/></g></svg>", "wall": "<svg viewBox=\"0 0 24 24\"><g fill=\"#fff\"><ellipse cx=\"12\" cy=\"7\" rx=\"2.6\" ry=\"4.6\" transform=\"rotate(0 12 12)\" opacity=\".9\"/><ellipse cx=\"12\" cy=\"7\" rx=\"2.6\" ry=\"4.6\" transform=\"rotate(60 12 12)\" opacity=\".9\"/><ellipse cx=\"12\" cy=\"7\" rx=\"2.6\" ry=\"4.6\" transform=\"rotate(120 12 12)\" opacity=\".9\"/><ellipse cx=\"12\" cy=\"7\" rx=\"2.6\" ry=\"4.6\" transform=\"rotate(180 12 12)\" opacity=\".9\"/><ellipse cx=\"12\" cy=\"7\" rx=\"2.6\" ry=\"4.6\" transform=\"rotate(240 12 12)\" opacity=\".9\"/><ellipse cx=\"12\" cy=\"7\" rx=\"2.6\" ry=\"4.6\" transform=\"rotate(300 12 12)\" opacity=\".9\"/></g></svg>", "bell": "<svg viewBox=\"0 0 24 24\"><path d=\"M12 3a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V9a6 6 0 0 0-6-6zM9.5 19a2.5 2.5 0 0 0 5 0z\" fill=\"#fff\"/></svg>", "hour": "<svg viewBox=\"0 0 24 24\"><path d=\"M6.5 3h11M6.5 21h11M7.5 3c0 5 9 5 9 9s-9 4-9 9M16.5 3c0 5-9 5-9 9s9 4 9 9\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.8\" stroke-linecap=\"round\"/></svg>", "disk": "<svg viewBox=\"0 0 24 24\"><rect x=\"4\" y=\"4.5\" width=\"16\" height=\"15\" rx=\"2.5\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.8\"/><path d=\"M4 14h16\" stroke=\"#fff\" stroke-width=\"1.8\"/><circle cx=\"16.5\" cy=\"17\" r=\"1\" fill=\"#fff\"/></svg>", "hand": "<svg viewBox=\"0 0 24 24\"><path d=\"M8 12V5.5a1.5 1.5 0 0 1 3 0V11V4a1.5 1.5 0 0 1 3 0v7V5.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7-2.5 0-4-1.4-5.2-3.3L3.6 13a1.5 1.5 0 0 1 2.6-1.4z\" fill=\"#fff\"/></svg>"};
APPS.settings = () => {
  const row = (ico, bg, t, val = '') => `<div class="ios-row"><span class="set-ico" style="background:${bg}">${ico}</span><div class="r-main"><div class="r-title" style="font-weight:400">${t}</div></div><span style="color:#8e8e93;font-size:15px">${val}</span>${I.chev}</div>`;
  const v = view('ios', `<div class="navbar"><div class="big-title">الإعدادات</div></div><div class="scroll">
    <div class="ios-list"><div class="ios-row"><span class="avatar" style="width:58px;height:58px">${SILHOUETTE}</span><div class="r-main"><div class="r-title" style="font-size:20px">يوسف</div><div class="r-sub">حساب Apple، iCloud، والمزيد</div></div>${I.chev}</div></div>
    <div class="ios-list">${row(SETG.plane,'#ff9500','وضع الطيران')}${row(SETG.wifi,'#0a84ff','Wi-Fi','Valila-Office')}${row(SETG.bt,'#0a84ff','Bluetooth','تشغيل')}${row(SETG.cell,'#30d158','خلوي')}${row(SETG.batt,'#30d158','البطارية','٩٪')}</div>
    <div class="ios-list">${row(SETG.gear,'#8e8e93','عام')}${row(SETG.sun,'#0a84ff','شاشة العرض والإضاءة')}${row(SETG.wall,'#30b0c7','خلفية الشاشة')}${row(SETG.bell,'#ff3b30','الإشعارات')}${row(SETG.hour,'#5e5ce6','مدة استخدام الجهاز','٧ ساعات يوميًا')}</div>
    <div class="ios-list">${row(SETG.disk,'#8e8e93','تخزين iPhone','٢٤٩ غ.ب من ٢٥٦')}${row(SETG.hand,'#0a84ff','الخصوصية والأمن')}</div>
    <p style="color:#8e8e93;font-size:13px;text-align:center;padding:6px 20px 30px">الاسم: جوال يوسف — تسويق ڤاليلا</p></div>`);
  v.querySelectorAll('.ios-row').forEach(r => r.addEventListener('click', () => toast('🔒 الإعدادات مقفلة')));
  return {node:v, dark:false};
};

/* ---------- Music ---------- */
APPS.music = () => {
  const songs = [['مقادير','طلال مداح'],['المسافر','راشد الماجد'],['ابعتذر','عبدالمجيد عبدالله'],['الأماكن','محمد عبده'],['فوق هام السحب','محمد عبده']];
  const v = view('ios', `<div class="navbar"><div class="big-title">المكتبة</div></div><div class="scroll"><div style="padding:0 16px 6px;color:#8e8e93;font-size:14px">آخر تشغيل</div>
    <div class="ios-list">${songs.map(([s, a]) => `<div class="ios-row"><span class="set-ico" style="background:linear-gradient(135deg,#fa233b,#f6af1a);width:44px;height:44px;border-radius:8px"><svg viewBox="0 0 24 24" style="width:20px;height:20px"><path d="M9 17V6l10-2v11" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="6.8" cy="17" r="2.4" fill="#fff"/><circle cx="16.8" cy="15" r="2.4" fill="#fff"/></svg></span><div class="r-main"><div class="r-title" style="font-weight:500">${s}</div><div class="r-sub">${a}</div></div></div>`).join('')}</div></div>
    <div class="mini-player"><span class="set-ico" style="background:linear-gradient(135deg,#fa233b,#f6af1a)"><svg viewBox="0 0 24 24" style="width:16px;height:16px"><path d="M9 17V6l10-2v11" fill="none" stroke="#fff" stroke-width="2"/><circle cx="6.8" cy="17" r="2.4" fill="#fff"/><circle cx="16.8" cy="15" r="2.4" fill="#fff"/></svg></span><b>مقادير</b><svg viewBox="0 0 24 24" style="width:22px;height:22px"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="#fff"/></svg></div>`);
  v.querySelectorAll('.ios-row').forEach(r => r.addEventListener('click', () => toast('🎧 السماعات مو متصلة')));
  return {node:v, dark:false};
};
APPS.clock = () => { toast(fx('⏰ منبّه {L5} — «الإطلاق بعد ٥ دقائق!»')); return false; };

/* ---------- banners ---------- */
function banner({ico = APPICON.whatsapp, head, text, onTap, ms = 6000}){
  const b = el(`<button class="notif banner-notif"><div class="n-ico">${ico}</div><div class="n-body"><div class="n-head"><span>${esc(head)}</span><span class="n-time">الآن</span></div><div class="n-text">${esc(text)}</div></div></button>`);
  $('#screen').appendChild(b);
  requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('on')));
  vib([30, 40, 30]);
  const hide = () => { b.classList.remove('on'); setTimeout(() => b.remove(), 500); };
  b.addEventListener('click', () => { hide(); closeViewer(); document.querySelectorAll('.lockflow').forEach(x => x.remove()); onTap && onTap(); });
  if (ms) setTimeout(hide, ms);
  return b;
}
const hhmm = () => { const d = new Date(Date.now() - OFF); return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`; };
function incoming(chatId, msg, unread = 1){
  const c = CHATS.find(x => x.id === chatId);
  c.msgs.push(Object.assign({at: hhmm()}, msg));
  LAST_AT[chatId] = hhmm();
  if (read.has(chatId)){ read.delete(chatId); c.unread = 0; }
  c.unread += unread;
  CHATS.splice(CHATS.indexOf(c), 1); CHATS.unshift(c);
  if (!current) renderHome();
  const top = stack[stack.length - 1]; if (current === 'whatsapp' && top && top.refresh) top.refresh(top.node);
}

/* the marketing manager — calls after a minute */
CHATS.splice(2, 0, {
  id:'mgr', name:'مدير تسويق ڤاليلا', short:'مدير التسويق', av:{t:'م', bg:'#a0761c'}, sub:'آخر ظهور الآن', unread:0,
  msgs:[
    {day:'اليوم'},
    {at:'13:30', t:'يوسف، الإعلان والعرض اليوم بإذن الله 🚀'},
    {me:1, at:'13:31', t:'أبشر، كل شي جاهز'},
    {at:'20:33', t:'يوسف؟ جوالك معك؟'},
  ]
});
LAST_AT.mgr = '20:33';

/* ---------- sound (generated live with Web Audio, no files) ---------- */
let AC = null;
function audio(){
  if (!AC){ try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ return null; } }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
/* browsers only allow sound after a tap: wake the audio engine on the visitor's first touches */
['pointerdown', 'touchend', 'keydown'].forEach(ev => addEventListener(ev, () => {
  const a = audio(); if (!a) return;
  const b = a.createBuffer(1, 1, 22050), s = a.createBufferSource(); s.buffer = b; s.connect(a.destination); s.start(0);
}, {passive:true}));

/* ringtone: soft marimba arpeggio, looped */
function marimba(a, out, f, t, v = 1){
  [[1, .55, .9], [3.93, .12, .25], [9.2, .04, .06]].forEach(([mul, amp, dec]) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = f * mul;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp * v, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + dec);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dec + .05);
  });
}
function startRingtone(){
  const a = audio(); if (!a) return () => {};
  const out = a.createGain(); out.gain.value = .32; out.connect(a.destination);
  const N = {E5:659.3, Gs5:830.6, B5:987.8, Cs6:1108.7, E6:1318.5, Fs6:1480, Gs6:1661.2};
  const seq = [[0,'E5'],[.16,'B5'],[.32,'E6'],[.48,'Gs6'],[.64,'Fs6'],[.8,'E6'],[.96,'B5'],[1.12,'Cs6'],[1.28,'E6',1.2]];
  let stopped = false, next = a.currentTime + .05;
  const plan = () => {
    if (stopped) return;
    while (next < a.currentTime + .6){ seq.forEach(([dt, n, v]) => marimba(a, out, N[n], next + dt, v || .9)); next += 2.6; }
    setTimeout(plan, 250);
  };
  plan();
  return () => { stopped = true; out.gain.setTargetAtTime(0, a.currentTime, .05); setTimeout(() => out.disconnect(), 400); };
}

/* voice note: muffled, unclear speech under static (you can tell someone is talking, not what) */
function playGarbled(dur){
  const a = audio(); if (!a) return () => {};
  const t0 = a.currentTime + .03, end = t0 + dur;
  const master = a.createGain(); master.gain.value = .55; master.connect(a.destination);
  // static hiss
  const nb = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), d = nb.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (Math.random() < .002 ? 3 : 1);
  const hiss = a.createBufferSource(); hiss.buffer = nb; hiss.loop = true;
  const hissF = a.createBiquadFilter(); hissF.type = 'bandpass'; hissF.frequency.value = 2400; hissF.Q.value = .5;
  const hissG = a.createGain(); hissG.gain.value = .07;
  hiss.connect(hissF); hissF.connect(hissG); hissG.connect(master);
  // voice: buzzy source through two formants, gated into syllables, then muffled
  const vo = a.createOscillator(); vo.type = 'sawtooth'; vo.frequency.value = 125;
  const syl = a.createGain(); syl.gain.value = 0;
  const f1 = a.createBiquadFilter(); f1.type = 'bandpass'; f1.Q.value = 4;
  const f2 = a.createBiquadFilter(); f2.type = 'bandpass'; f2.Q.value = 5;
  const muffle = a.createBiquadFilter(); muffle.type = 'lowpass'; muffle.frequency.value = 1300;
  const vg = a.createGain(); vg.gain.value = .9;
  vo.connect(syl); syl.connect(f1); syl.connect(f2); f1.connect(muffle); f2.connect(muffle); muffle.connect(vg); vg.connect(master);
  // breathy noise in the voice band too
  const vn = a.createBufferSource(); vn.buffer = nb; vn.loop = true;
  const vnG = a.createGain(); vnG.gain.value = .25; vn.connect(vnG); vnG.connect(syl);
  let t = t0;
  while (t < end - .2){
    const len = .07 + Math.random() * .2, pause = Math.random() < .12 ? .25 + Math.random() * .35 : .02 + Math.random() * .08;
    const pk = .5 + Math.random() * .5;
    syl.gain.setValueAtTime(0, t); syl.gain.linearRampToValueAtTime(pk, t + .025); syl.gain.setValueAtTime(pk * .8, t + len * .7); syl.gain.linearRampToValueAtTime(0, t + len);
    vo.frequency.setTargetAtTime(105 + Math.random() * 60, t, .05);
    f1.frequency.setTargetAtTime(350 + Math.random() * 500, t, .03);
    f2.frequency.setTargetAtTime(1000 + Math.random() * 1200, t, .03);
    // dropouts like a weak line
    if (Math.random() < .08) { vg.gain.setValueAtTime(.15, t); vg.gain.setValueAtTime(.9, t + len); }
    t += len + pause;
  }
  [hiss, vo, vn].forEach(n => { n.start(t0); n.stop(end + .05); });
  master.gain.setValueAtTime(.55, end - .08); master.gain.linearRampToValueAtTime(0, end);
  let done = false;
  return () => { if (done) return; done = true; master.gain.setTargetAtTime(0, a.currentTime, .02); setTimeout(() => { try { [hiss, vo, vn].forEach(n => n.stop()); } catch(e){} master.disconnect(); }, 120); };
}

/* ---------- incoming call ---------- */
const CALLG = {"mute": "<svg viewBox=\"0 0 24 24\"><path d=\"M9 4.5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5.5 10.5a6.5 6.5 0 0 0 13 0M12 17v3.5\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.8\" stroke-linecap=\"round\"/><path d=\"M4 3l16 18\" stroke=\"#fff\" stroke-width=\"1.8\" stroke-linecap=\"round\"/></svg>", "keypad": "<svg viewBox=\"0 0 24 24\" fill=\"#fff\"><circle cx=\"6\" cy=\"4.5\" r=\"1.9\"/><circle cx=\"12\" cy=\"4.5\" r=\"1.9\"/><circle cx=\"18\" cy=\"4.5\" r=\"1.9\"/><circle cx=\"6\" cy=\"9.5\" r=\"1.9\"/><circle cx=\"12\" cy=\"9.5\" r=\"1.9\"/><circle cx=\"18\" cy=\"9.5\" r=\"1.9\"/><circle cx=\"6\" cy=\"14.5\" r=\"1.9\"/><circle cx=\"12\" cy=\"14.5\" r=\"1.9\"/><circle cx=\"18\" cy=\"14.5\" r=\"1.9\"/><circle cx=\"12\" cy=\"19.5\" r=\"1.9\"/></svg>", "speaker": "<svg viewBox=\"0 0 24 24\"><path d=\"M3.5 9h4l5-4.5v15l-5-4.5h-4z\" fill=\"#fff\"/><path d=\"M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.8\" stroke-linecap=\"round\"/></svg>", "add": "<svg viewBox=\"0 0 24 24\"><path d=\"M12 4v16M4 12h16\" stroke=\"#fff\" stroke-width=\"2.2\" stroke-linecap=\"round\"/></svg>", "facetime": "<svg viewBox=\"0 0 24 24\"><rect x=\"2.5\" y=\"6.5\" width=\"13\" height=\"11\" rx=\"3\" fill=\"#fff\"/><path d=\"M16.5 10.5l5-3v9l-5-3z\" fill=\"#fff\"/></svg>", "contacts": "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"8.5\" r=\"4\" fill=\"#fff\"/><path d=\"M4 20.5c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5z\" fill=\"#fff\"/></svg>"};
const CALLER = 'مدير تسويق ڤاليلا';
let callLive = false;
function ringCall(){
  if (callLive) return; callLive = true;
  closeViewer(); document.querySelectorAll('.lockflow').forEach(x => x.remove());
  appwin.querySelectorAll('video').forEach(x => x.pause());
  const ov = el(`<div class="callscreen ringing">
    <div class="call-top"><div class="call-sub">جوال</div><div class="call-name">${CALLER}</div><div class="call-av">${SILHOUETTE}</div></div>
    <div class="call-mid"><span><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="7.5" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M12 9v4l2.5 2" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/></svg>ذكّرني</span><span><svg viewBox="0 0 24 24"><path d="M12 4C6.8 4 3 7.3 3 11.3c0 2.3 1.2 4.3 3.2 5.6L5.5 20l3.6-1.8c.9.2 1.9.4 2.9.4 5.2 0 9-3.3 9-7.3S17.2 4 12 4z" fill="#fff"/></svg>رسالة</span></div>
    <div class="call-actions"><div><button class="cbtn decline" aria-label="رفض"><svg viewBox="0 0 24 24"><path d="M3.5 13.5c4.7-4.5 12.3-4.5 17 0l-2.2 2.6-3.3-1.2-.4-2.6a10 10 0 0 0-5.2 0l-.4 2.6-3.3 1.2z" fill="currentColor"/></svg></button>رفض</div><div><button class="cbtn accept" aria-label="قبول"><svg viewBox="0 0 24 24"><path d="M6.6 3.5l2.6.4 1.3 4-1.8 1.6a12 12 0 0 0 5.8 5.8l1.6-1.8 4 1.3.4 2.6c-.2 1.6-1.6 2.8-3.2 2.6A17 17 0 0 1 4 6.7c-.2-1.6 1-3 2.6-3.2z" fill="currentColor"/></svg></button>قبول</div></div>
  </div>`);
  $('#screen').appendChild(ov);
  setChrome(false);
  const stopTone = startRingtone();
  let buzz = setInterval(() => vib([400, 200, 400]), 2000);
  const stopRing = () => { stopTone(); clearInterval(buzz); clearTimeout(timeout); vib(0); };
  const timeout = setTimeout(() => { stopRing(); ov.remove(); missed(); }, 25000);
  ov.querySelector('.decline').addEventListener('click', () => { stopRing(); ov.remove(); missed(); });
  ov.querySelector('.accept').addEventListener('click', () => { stopRing(); answered(ov); });
}
function restoreChrome(){ callLive = false; setChrome(stack.length ? stack[stack.length - 1].dark : false); }
function missed(){
  restoreChrome();
  CALLS.unshift({n:CALLER, c:1, at:hhmm(), miss:1});
  incoming('mgr', {t:'رد يا رجال 😅 اللي لقى الجوال… افتح المتصفح عشان تقدر ترجع الجوال 🙏'});
  setTimeout(() => banner({head:CALLER, text:'افتح المتصفح عشان تقدر ترجع الجوال 🙏', ms:9000, onTap:() => openApp('safari', 'found')}), 600);
}
function answered(ov){
  ov.classList.remove('ringing'); ov.classList.add('incall');
  ov.innerHTML = `<div class="call-top"><div class="call-sub call-timer">٠:٠٠</div><div class="call-name">${CALLER}</div><div class="call-av">${SILHOUETTE}</div></div>
    <div class="call-say"></div>
    <div class="call-grid">${[[CALLG.speaker,'مكبر الصوت'],[CALLG.facetime,'FaceTime'],[CALLG.mute,'كتم'],[CALLG.add,'إضافة مكالمة'],[CALLG.contacts,'جهات الاتصال'],[CALLG.keypad,'لوحة المفاتيح']].map(([g,t]) => `<div class="cg"><span>${g}</span><small>${t}</small></div>`).join('')}</div>
    <div class="call-actions one"><div><button class="cbtn decline end" aria-label="إنهاء"><svg viewBox="0 0 24 24"><path d="M3.5 13.5c4.7-4.5 12.3-4.5 17 0l-2.2 2.6-3.3-1.2-.4-2.6a10 10 0 0 0-5.2 0l-.4 2.6-3.3 1.2z" fill="currentColor"/></svg></button>إنهاء</div></div>`;
  const t0c = Date.now(), timer = ov.querySelector('.call-timer'), say = ov.querySelector('.call-say');
  const tick = setInterval(() => { const s = Math.floor((Date.now() - t0c) / 1000); timer.textContent = ar(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`); }, 500);
  const lines = [
    'ألو؟ هذا جوال يوسف… الحمدلله إن أحد رد 😮‍💨',
    'جزاك الله خير إنك لقيته',
    'عشان ترجّع الجوال… افتح المتصفح، كتبت لك كل شي هناك 🙏',
  ];
  let li = 0;
  const speak = () => { if (li >= lines.length) return; say.appendChild(el(`<div class="say-line">${esc(lines[li++])}</div>`)); };
  const timers = [setTimeout(speak, 1200), setTimeout(speak, 3600), setTimeout(speak, 5800), setTimeout(() => end(true), 9000)];
  ov.querySelector('.end').addEventListener('click', () => end(li >= 3));
  function end(heard){
    clearInterval(tick); timers.forEach(clearTimeout);
    const secs = Math.max(1, Math.floor((Date.now() - t0c) / 1000));
    CALLS.unshift({n:CALLER, c:1, at:hhmm(), dur:secs});
    ov.innerHTML = `<div class="call-top"><div class="call-sub">انتهت المكالمة</div><div class="call-name">${CALLER}</div><div class="call-av">${SILHOUETTE}</div></div>`;
    setTimeout(() => {
      ov.remove(); restoreChrome();
      if (!heard) incoming('mgr', {t:'انقطع الخط 😅 افتح المتصفح عشان تقدر ترجع الجوال 🙏'});
      banner({ico:APPICON.safari, head:CALLER, text:'افتح المتصفح عشان تقدر ترجع الجوال 🙏', ms:0, onTap:() => openApp('safari', 'found')});
    }, 1100);
  }
}

/* ---------- timeline (starts when the phone is unlocked) ---------- */
let timelineOn = false;
function scheduleLive(){
  if (timelineOn) return; timelineOn = true;
  setTimeout(() => {
    incoming('ceo', {t:'اللي لقى الجوال… لا يفتح الملفات 🙏'});
    banner({head:'CEO ڤاليلا', text:'اللي لقى الجوال… لا يفتح الملفات 🙏', onTap:() => openApp('whatsapp', 'ceo')});
  }, 25000);
  setTimeout(ringCall, location.hash === '#call' ? 3000 : 60000);
  setTimeout(() => {
    document.querySelectorAll('.batt-num').forEach(n => n.textContent = '٥');
    document.querySelector('.batt-fill').style.width = '7%';
    banner({ico:`<svg viewBox="0 0 60 60"><rect width="60" height="60" fill="#30d158"/><rect x="12" y="22" width="32" height="16" rx="4" fill="none" stroke="#fff" stroke-width="3"/><rect x="16" y="26" width="5" height="8" fill="#ff3b30"/><rect x="45" y="27" width="3" height="6" rx="1" fill="#fff"/></svg>`, head:'البطارية', text:'٥٪ من البطارية متبقية — رجّع الجوال لصاحبه قبل يطفي 😅', ms:7000, onTap:() => openApp('safari', 'found')});
  }, 150000);
}

/* ---------- boot ---------- */
CHATS.forEach(c => { c.sub = fx(c.sub || ''); c.msgs.forEach(m => { if (m.t) m.t = fx(m.t); if (m.cap) m.cap = fx(m.cap); }); });
Object.values(NOTES).forEach(n => { n.at = fx(n.at); n.html = fx(n.html); });
FILES.forEach(f => { f.meta = fx(f.meta); });
tickClock(); setInterval(tickClock, 1000 * 5);
renderLock(); renderHome();
})();
