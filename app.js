/* ============================================================
   Belong — app logic
   Grounded in established accessibility practice:
   - PECS/AAC-informed: the user initiates by tapping a picture,
     and every tap produces an immediate, concrete result.
   - Makaton principle: symbol + word + optional speech, always together.
   - Easy Read: one fact + one picture per row on every card.
   - First-Then boards: the flow is announced before it happens.
   - W3C COGA: no time limits, no memory demands, no dead ends.
   Symbols: ARASAAC (arasaac.org) — Sergio Palao / Gobierno de
   Aragón, CC BY-NC-SA. Free for non-commercial community use.
   ============================================================ */
'use strict';

const $ = s => document.querySelector(s);
const chat = $('#chat');

/* ---------- state (restored across visits — COGA: no data loss) ---------- */
const state = {
  lang: localStorage.getItem('belong-lang') || 'en',
  sound: localStorage.getItem('belong-sound') === 'on',
  text: localStorage.getItem('belong-text') || 'normal',
  contrast: localStorage.getItem('belong-contrast') === 'high',
  cat: null,
  queue: [],
  shown: 0,
};

/* ---------- strings (English, French, Spanish) ---------- */
const S = {
  en: {
    greeting: "Hi, I'm Robin. I help you find free things to do near you.",
    firstThen: "First: tap a picture. Then: I show you what's on.",
    whatNeed: "What do you need today?",
    whenGo: "When do you want to go?",
    today: "Today", week: "This week", any: "Anytime",
    hereOne: "Here's one close to you:",
    hereAnother: "Here's another one:",
    go: "I'll go", another: "Show me another", noThanks: "No thanks",
    directions: "Directions",
    great: "Great choice!",
    remindQ: "Want me to remind you that morning?",
    remindYes: "Yes, remind me",
    saved: "Done! I'll remind you. You can bring a friend — everyone is welcome.",
    anythingElse: "Do you want anything else?",
    more: "Find something else", done: "I'm done",
    bye: "Okay. I'm always here when you need me. Tap Start over any time.",
    noneToday: "Nothing on today. Here's what's coming up:",
    noneCat: "I don't have anything there right now. Try another picture:",
    noMore: "That's everything I have there. Try another picture:",
    dontUnderstand: "I can help with these:",
    listening: "I'm listening…",
    noMic: "Speaking isn't available here, but you can tap any picture.",
    soundOn: "Read aloud is on. I will speak every message out loud.",
    readAgain: "Read again",
    cats: { food:"Food", people:"Meet people", kids:"Kids & family", health:"Health", learn:"Learn", money:"Money help" },
    free: "Free",
    justWalkIn: "Just walk in", stepFree: "Step-free", asl: "ASL",
  },
  fr: {
    greeting: "Bonjour, je m'appelle Robin. Je t'aide à trouver des activités gratuites près de chez toi.",
    firstThen: "D'abord : touche une image. Ensuite : je te montre ce qu'il y a.",
    whatNeed: "De quoi as-tu besoin aujourd'hui ?",
    whenGo: "Quand veux-tu y aller ?",
    today: "Aujourd'hui", week: "Cette semaine", any: "N'importe quand",
    hereOne: "En voici une près de chez toi :",
    hereAnother: "En voici une autre :",
    go: "J'y vais", another: "Montre-m'en une autre", noThanks: "Non merci",
    directions: "Itinéraire",
    great: "Bon choix !",
    remindQ: "Veux-tu un rappel ce matin-là ?",
    remindYes: "Oui, rappelle-moi",
    saved: "C'est fait ! Je te le rappellerai. Tu peux venir avec quelqu'un — tout le monde est bienvenu.",
    anythingElse: "As-tu besoin d'autre chose ?",
    more: "Trouver autre chose", done: "J'ai fini",
    bye: "D'accord. Je suis toujours là. Touche Recommencer quand tu veux.",
    noneToday: "Rien aujourd'hui. Voici ce qui s'en vient :",
    noneCat: "Je n'ai rien pour l'instant. Essaie une autre image :",
    noMore: "C'est tout ce que j'ai. Essaie une autre image :",
    dontUnderstand: "Je peux aider avec ceci :",
    listening: "Je t'écoute…",
    noMic: "Parler n'est pas possible ici, mais tu peux toucher une image.",
    soundOn: "La lecture à voix haute est activée.",
    readAgain: "Relire",
    cats: { food:"Nourriture", people:"Rencontrer des gens", kids:"Enfants et famille", health:"Santé", learn:"Apprendre", money:"Aide financière" },
    free: "Gratuit",
    justWalkIn: "Entre sans rendez-vous", stepFree: "Sans marches", asl: "ASL",
  },
  es: {
    greeting: "Hola, soy Robin. Te ayudo a encontrar cosas gratis cerca de ti.",
    firstThen: "Primero: toca una imagen. Después: te muestro qué hay.",
    whatNeed: "¿Qué necesitas hoy?",
    whenGo: "¿Cuándo quieres ir?",
    today: "Hoy", week: "Esta semana", any: "Cualquier día",
    hereOne: "Aquí hay una cerca de ti:",
    hereAnother: "Aquí hay otra:",
    go: "Voy a ir", another: "Muéstrame otra", noThanks: "No, gracias",
    directions: "Cómo llegar",
    great: "¡Buena elección!",
    remindQ: "¿Quieres que te lo recuerde esa mañana?",
    remindYes: "Sí, recuérdamelo",
    saved: "¡Listo! Te lo recordaré. Puedes traer a alguien — todos son bienvenidos.",
    anythingElse: "¿Necesitas algo más?",
    more: "Buscar otra cosa", done: "Terminé",
    bye: "Está bien. Siempre estoy aquí. Toca Empezar de nuevo cuando quieras.",
    noneToday: "Hoy no hay nada. Esto es lo que viene:",
    noneCat: "No tengo nada ahora. Prueba otra imagen:",
    noMore: "Eso es todo lo que tengo. Prueba otra imagen:",
    dontUnderstand: "Puedo ayudarte con esto:",
    listening: "Te escucho…",
    noMic: "Hablar no está disponible aquí, pero puedes tocar una imagen.",
    soundOn: "La lectura en voz alta está activada.",
    readAgain: "Leer otra vez",
    cats: { food:"Comida", people:"Conocer gente", kids:"Niños y familia", health:"Salud", learn:"Aprender", money:"Ayuda con dinero" },
    free: "Gratis",
    justWalkIn: "Entra sin cita", stepFree: "Sin escalones", asl: "ASL",
  },
};
const t = key => S[state.lang][key];

/* ---------- categories (ARASAAC pictogram + word, always together) ---------- */
const CATS = [
  { key:'food',   pict:'food',   cls:'c-food' },
  { key:'people', pict:'people', cls:'c-people' },
  { key:'kids',   pict:'kids',   cls:'c-kids' },
  { key:'health', pict:'health', cls:'c-health' },
  { key:'learn',  pict:'learn',  cls:'c-learn' },
  { key:'money',  pict:'money',  cls:'c-money' },
];

/* Typed/spoken words → category (never a dead end: unknown re-offers pictures) */
const KEYWORDS = {
  food:['food','eat','lunch','dinner','hungry','meal','comida','comer','manger','nourriture','faim'],
  people:['people','friend','friends','lonely','social','talk','gente','amigos','gens','amis','seul'],
  kids:['kid','kids','child','children','family','son','daughter','niños','familia','enfant','famille'],
  health:['health','doctor','dentist','sick','salud','médico','santé','malade'],
  learn:['learn','class','english','read','study','school','aprender','clase','inglés','apprendre','cours','anglais'],
  money:['money','tax','taxes','bill','bills','broke','dinero','impuestos','argent','impôts'],
};

/* ---------- demo events (would come from the shared platform + org form) ---------- */
const BUILTIN_EVENTS = [
  { cat:'food',   pict:'food',    title:'Community hot lunch',        org:"St. John's Kitchen",              day:2, time:'12:00 pm', place:'97 Victoria St N, Kitchener',  access:['stepFree','justWalkIn'] },
  { cat:'food',   pict:'food',    title:'Free grocery pick-up',       org:'Food Bank of Waterloo Region',    day:4, time:'10:00 am', place:'50 Alpine Ct, Kitchener',      access:['stepFree'] },
  { cat:'people', pict:'people',  title:'Coffee & board games',       org:'KW Habilitation',                 day:3, time:'6:30 pm',  place:'99 Ottawa St S, Kitchener',    access:['stepFree','justWalkIn','asl'] },
  { cat:'people', pict:'music',   title:'Community music night',      org:'Extend-A-Family',                 day:5, time:'7:00 pm',  place:'91 Moore Ave, Kitchener',      access:['stepFree'] },
  { cat:'kids',   pict:'sport',   title:'Free family swim',           org:'City of Kitchener',               day:6, time:'1:00 pm',  place:'Forest Heights Pool',          access:['stepFree','justWalkIn'] },
  { cat:'kids',   pict:'library', title:'Story time for kids',        org:'Kitchener Public Library',        day:6, time:'10:30 am', place:'85 Queen St N, Kitchener',     access:['stepFree','justWalkIn','asl'] },
  { cat:'health', pict:'health',  title:'Free dental check day',      org:'Community Healthcaring KW',       day:1, time:'9:00 am',  place:'44 Francis St S, Kitchener',   access:['stepFree'] },
  { cat:'health', pict:'sport',   title:'Gentle walking group',       org:'Sunnyside Wellness',              day:2, time:'10:00 am', place:'Victoria Park clock tower',    access:['justWalkIn'] },
  { cat:'learn',  pict:'learn',   title:'English conversation circle',org:'KW Multicultural Centre',         day:3, time:'5:30 pm',  place:'102 King St W, Kitchener',     access:['stepFree','justWalkIn'] },
  { cat:'learn',  pict:'library', title:'Free computer help',         org:'Kitchener Public Library',        day:5, time:'2:00 pm',  place:'85 Queen St N, Kitchener',     access:['stepFree','justWalkIn'] },
  { cat:'money',  pict:'money',   title:'Free tax clinic',            org:'The Working Centre',              day:4, time:'1:00 pm',  place:'58 Queen St S, Kitchener',     access:['stepFree'] },
];
/* Events posted by organizations through post.html join the same pool. */
const EVENTS = BUILTIN_EVENTS.concat(JSON.parse(localStorage.getItem('belong-events') || '[]'));

const DAY_NAMES = {
  en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  fr:['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],
  es:['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
};

/* ---------- tiny DOM helpers ---------- */
const el = html => { const tp = document.createElement('template'); tp.innerHTML = html.trim(); return tp.content.firstElementChild; };
/* Synchronous on purpose: pictogram images have fixed CSS sizes, so
   layout is final at append time — and rAF never fires in hidden tabs. */
const scroll = () => { chat.scrollTop = chat.scrollHeight; };
const pict = name => `assets/pictograms/${name}.png`;

/* ---------- speech out (light SGD-style voice output) ---------- */
const VOICE_LANG = { en:'en-CA', fr:'fr-CA', es:'es-ES' };
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = VOICE_LANG[state.lang];
  u.rate = 0.92; /* a touch slower than default — easier to follow */
  speechSynthesis.speak(u);
}

/* ---------- chat primitives ---------- */
function addGuide(text, { spoken } = {}) {
  const row = el(`<div class="row guide"><div class="bubble"></div></div>`);
  row.querySelector('.bubble').textContent = text;
  const say = spoken || text;
  const replay = el(
    `<button type="button" class="replay"><span class="ms" aria-hidden="true">volume_up</span>${t('readAgain')}</button>`
  );
  replay.addEventListener('click', () => speak(say));
  row.appendChild(replay);
  chat.appendChild(row);
  if (state.sound) speak(say);
  scroll();
}

function addUser(label, pictName) {
  const img = pictName ? `<img src="${pict(pictName)}" alt="">` : '';
  const row = el(`<div class="row user"><div class="bubble">${img}<span></span></div></div>`);
  row.querySelector('span').textContent = label;
  chat.appendChild(row);
  scroll();
}

/* One question, a handful of big buttons. Buttons disable after use so
   scrolling back up never re-triggers old steps. */
function addOptions(options, { stack } = {}) {
  const wrap = el(`<div class="row guide"><div class="options${stack ? ' stack' : ''}"></div></div>`);
  const box = wrap.querySelector('.options');
  options.forEach(o => {
    const visual = o.pict
      ? `<span class="dot"><img src="${pict(o.pict)}" alt=""></span>`
      : (o.ms ? `<span class="ms" aria-hidden="true">${o.ms}</span>` : '');
    const btn = el(`<button type="button" class="opt ${o.cls || ''} ${o.pict ? '' : 'simple'}">${visual}<span></span></button>`);
    btn.querySelector('span:last-child').textContent = o.label;
    btn.addEventListener('click', () => {
      box.querySelectorAll('button').forEach(b => { b.disabled = true; });
      btn.classList.add('picked');
      o.onPick();
    });
    box.appendChild(btn);
  });
  chat.appendChild(wrap);
  scroll();
}

/* Easy Read card: one fact + one picture per row. */
function addCard(ev) {
  const dayName = DAY_NAMES[state.lang][ev.day];
  const chips = (ev.access || []).map(a => {
    const chipPict = { stepFree:'wheelchair', asl:'deaf', justWalkIn:'welcome' }[a];
    return `<span class="chip"><img src="${pict(chipPict)}" alt="">${t(a)}</span>`;
  }).join('');
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ev.place);
  const card = el(`
    <div class="row guide"><div class="card">
      <div class="card-top c-${ev.cat}"><img src="${pict(ev.pict)}" alt=""></div>
      <div class="card-body">
        <div class="card-head">
          <p class="card-title"></p>
          <span class="badge-free">${t('free')}</span>
        </div>
        <p class="card-org"></p>
        <div class="card-line"><img src="${pict('clock')}" alt="">${dayName}, ${ev.time}</div>
        <div class="card-line"><img src="${pict('place')}" alt=""><span class="card-place"></span></div>
        <div class="chips">${chips}</div>
        <div class="card-actions">
          <button type="button" class="btn primary act-go"><span class="ms" aria-hidden="true">check</span>${t('go')}</button>
          <a class="btn" href="${mapsUrl}" target="_blank" rel="noopener"><span class="ms" aria-hidden="true">map</span>${t('directions')}</a>
        </div>
      </div>
    </div></div>`);
  card.querySelector('.card-title').textContent = ev.title;
  card.querySelector('.card-org').textContent = ev.org;
  card.querySelector('.card-place').textContent = ev.place;

  const spokenCard = `${ev.title}. ${dayName}, ${ev.time}. ${ev.place}. ${t('free')}.`;
  card.querySelector('.act-go').addEventListener('click', function () {
    this.disabled = true;
    /* analytics seed: count "I'll go" taps (the spec's nice-to-have) */
    const n = +(localStorage.getItem('belong-going') || 0) + 1;
    localStorage.setItem('belong-going', n);
    addUser(t('go'));
    addGuide(t('great'));
    askReminder(ev);
  });
  chat.appendChild(card);
  if (state.sound) speak(spokenCard);
  scroll();
  return card;
}

/* ---------- conversation flow ---------- */
function greet() {
  addGuide(t('greeting'));
  addGuide(t('firstThen'));   /* First-Then board: announce the sequence */
  askCategory(t('whatNeed'));
}

function askCategory(prompt) {
  addGuide(prompt);
  addOptions(CATS.map(c => ({
    pict: c.pict, cls: c.cls, label: t('cats')[c.key],
    onPick: () => { addUser(t('cats')[c.key], c.pict); state.cat = c.key; askWhen(); },
  })));
}

function askWhen() {
  addGuide(t('whenGo'));
  addOptions([
    { ms:'today',          label:t('today'), onPick:() => { addUser(t('today')); pickEvents('today'); } },
    { ms:'date_range',     label:t('week'),  onPick:() => { addUser(t('week'));  pickEvents('week'); } },
    { ms:'all_inclusive',  label:t('any'),   onPick:() => { addUser(t('any'));   pickEvents('any'); } },
  ], { stack:true });
}

function pickEvents(when) {
  const inCat = EVENTS.filter(e => e.cat === state.cat);
  let list = inCat;
  let intro = t('hereOne');
  if (when === 'today') {
    const todays = inCat.filter(e => e.day === new Date().getDay());
    if (todays.length) list = todays;
    else if (inCat.length) intro = t('noneToday'); /* graceful fallback, never a dead end */
  }
  if (!list.length) { addGuide(t('noneCat')); return askCategory(t('whatNeed')); }
  state.queue = list.slice();
  state.shown = 0;
  addGuide(intro);
  showNext();
}

function showNext() {
  const ev = state.queue[state.shown];
  const cardRow = addCard(ev);
  state.shown++;
  const opts = [];
  if (state.shown < state.queue.length) {
    opts.push({ ms:'skip_next', label:t('another'), onPick:() => { addUser(t('another')); addGuide(t('hereAnother')); showNext(); } });
  }
  opts.push({ ms:'close', label:t('noThanks'), onPick:() => {
    addUser(t('noThanks'));
    if (state.shown >= state.queue.length) addGuide(t('noMore'));
    askAnythingElse();
  } });
  addOptions(opts, { stack:true });
  /* Keep the card itself on screen — the reader starts at its top,
     not at the buttons below it (COGA: don't make people hunt). */
  cardRow.scrollIntoView({ block: 'start' });
}

function askReminder(ev) {
  addGuide(t('remindQ'));
  addOptions([
    { ms:'notifications_active', label:t('remindYes'), onPick:() => {
      addUser(t('remindYes'));
      const saved = JSON.parse(localStorage.getItem('belong-reminders') || '[]');
      saved.push({ title: ev.title, day: ev.day, time: ev.time });
      localStorage.setItem('belong-reminders', JSON.stringify(saved));
      addGuide(t('saved'));
      askAnythingElse();
    } },
    { ms:'close', label:t('noThanks'), onPick:() => { addUser(t('noThanks')); askAnythingElse(); } },
  ], { stack:true });
}

function askAnythingElse() {
  addGuide(t('anythingElse'));
  addOptions([
    { ms:'search',    label:t('more'), onPick:() => { addUser(t('more')); askCategory(t('whatNeed')); } },
    { ms:'thumb_up',  label:t('done'), onPick:() => { addUser(t('done')); addGuide(t('bye')); } },
  ], { stack:true });
}

/* ---------- free text & speech in (typed words route to pictures) ---------- */
function routeText(raw) {
  const text = raw.toLowerCase();
  for (const [cat, words] of Object.entries(KEYWORDS)) {
    if (words.some(w => text.includes(w))) {
      const c = CATS.find(x => x.key === cat);
      addUser(raw);
      state.cat = cat;
      addUser(t('cats')[c.key], c.pict);
      return askWhen();
    }
  }
  addUser(raw);
  askCategory(t('dontUnderstand'));
}

$('#composer').addEventListener('submit', e => {
  e.preventDefault();
  const input = $('#msgInput');
  if (input.value.trim()) routeText(input.value.trim());
  input.value = '';
});

$('#btnMic').addEventListener('click', () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return addGuide(t('noMic'));
  const rec = new SR();
  rec.lang = VOICE_LANG[state.lang];
  const mic = $('#btnMic');
  mic.classList.add('listening');
  addGuide(t('listening'), { spoken:' ' });
  rec.onresult = e => routeText(e.results[0][0].transcript);
  rec.onend = () => mic.classList.remove('listening');
  rec.onerror = () => mic.classList.remove('listening');
  rec.start();
});

/* ---------- accessibility controls ---------- */
function applySettings() {
  document.documentElement.dataset.text = state.text;
  document.documentElement.dataset.contrast = state.contrast ? 'high' : 'normal';
  $('#btnContrast').setAttribute('aria-pressed', String(state.contrast));
  $('#btnSound').setAttribute('aria-pressed', String(state.sound));
  $('#langLabel').textContent = { en:'English', fr:'Français', es:'Español' }[state.lang];
}

$('#btnText').addEventListener('click', () => {
  state.text = { normal:'large', large:'xlarge', xlarge:'normal' }[state.text];
  localStorage.setItem('belong-text', state.text);
  applySettings();
});

$('#btnContrast').addEventListener('click', () => {
  state.contrast = !state.contrast;
  localStorage.setItem('belong-contrast', state.contrast ? 'high' : 'normal');
  applySettings();
});

$('#btnSound').addEventListener('click', () => {
  state.sound = !state.sound;
  localStorage.setItem('belong-sound', state.sound ? 'on' : 'off');
  applySettings();
  if (state.sound) speak(t('soundOn')); else speechSynthesis?.cancel();
});

$('#btnLang').addEventListener('click', () => {
  state.lang = { en:'fr', fr:'es', es:'en' }[state.lang];
  localStorage.setItem('belong-lang', state.lang);
  applySettings();
  restart(); /* re-greet in the new language */
});

function restart() {
  speechSynthesis?.cancel();
  chat.innerHTML = '';
  state.cat = null; state.queue = []; state.shown = 0;
  greet();
}
$('#startOver').addEventListener('click', restart);

/* ---------- go ---------- */
applySettings();
greet();
