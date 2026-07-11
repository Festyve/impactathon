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
    greeting: "Hi, I'm Belong. Tap one picture. I'll show you something nearby.",
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
    settings: "Settings", close: "Close settings", startOver: "Start over",
    textSize: "Text size", textNormal: "Normal", textLarge: "Large", textXlarge: "Extra large",
    contrast: "High contrast", readAloud: "Read aloud", language: "Language",
    on: "On", off: "Off", forOrgs: "For organizations",
    cats: { food:"Food", people:"Meet people", kids:"Kids & family", health:"Health", learn:"Learn", money:"Money help" },
    notSure: "I'm not sure — show me anything", back: "Go back",
    free: "Free",
    register: "Register", registrationNeeded: "Sign-up needed",
    justWalkIn: "Just walk in", stepFree: "Step-free", asl: "ASL",
    onbSkip: "Skip setup", onbNext: "Next", onbBack: "Back", onbDone: "Done",
    locTitle: "Where are you?", locSub: "This helps me find things close to you.",
    loc: { kitchener:"Kitchener", waterloo:"Waterloo", cambridge:"Cambridge", townships:"Townships", notsure:"Not sure" },
    intTitle: "What are you interested in?", intSub: "Pick as many as you like.",
    ageTitle: "What's your age group?", ageSub: "This helps me show the right things for you.",
    age: { child:"Under 12", teen:"13 to 17", adult:"18 to 64", senior:"65 and up" },
    accessTitle: "Any accessibility needs?", accessSub: "Pick as many as you like. This is just for you.",
    access: { lowvision:"Low vision or blind", deaf:"Deaf or hard of hearing", mobility:"Physical or mobility needs", intellectual:"Intellectual or learning disability", sensory:"Autism or sensory sensitivity", none:"None of these" },
    tabFind: "Find things",
    tabBooked: "My bookings",
    bookedTitle: "Your booked activities",
    bookedHelp: "Tap a booking to select it. Then tap the big red button to cancel it.",
    bookedEmpty: "No bookings yet.",
    bookedEmptyHint: "When you tap \"I'll go\" on an activity, it will show up here.",
    selectWord: "Select", selectedWord: "Selected",
    cancelBtn: "Cancel selected bookings",
    selectFirst: "First tap a booking above, then tap the red button.",
    confirmQ: "Are you sure you want to cancel?",
    confirmYes: "Yes, cancel", confirmNo: "No, keep",
    cancelledMsg: "Done — cancelled. You can book it again any time.",
    bookedAdded: "Saved to My bookings. You can see or cancel it in the My bookings tab.",
  },
  fr: {
    greeting: "Bonjour, je m'appelle Belong. Touche une image. Je te montrerai quelque chose près de chez toi.",
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
    settings: "Réglages", close: "Fermer les réglages", startOver: "Recommencer",
    textSize: "Taille du texte", textNormal: "Normale", textLarge: "Grande", textXlarge: "Très grande",
    contrast: "Contraste élevé", readAloud: "Lecture à voix haute", language: "Langue",
    on: "Activé", off: "Désactivé", forOrgs: "Pour les organismes",
    cats: { food:"Nourriture", people:"Rencontrer des gens", kids:"Enfants et famille", health:"Santé", learn:"Apprendre", money:"Aide financière" },
    notSure: "Je ne sais pas — montre-moi tout", back: "Retour",
    free: "Gratuit",
    register: "S'inscrire", registrationNeeded: "Inscription requise",
    justWalkIn: "Entre sans rendez-vous", stepFree: "Sans marches", asl: "ASL",
    onbSkip: "Passer", onbNext: "Suivant", onbBack: "Retour", onbDone: "Terminé",
    locTitle: "Où es-tu ?", locSub: "Ça m'aide à trouver des activités près de chez toi.",
    loc: { kitchener:"Kitchener", waterloo:"Waterloo", cambridge:"Cambridge", townships:"Cantons ruraux", notsure:"Je ne sais pas" },
    intTitle: "Qu'est-ce qui t'intéresse ?", intSub: "Choisis-en autant que tu veux.",
    ageTitle: "Quel est ton groupe d'âge ?", ageSub: "Ça m'aide à te montrer les bonnes activités.",
    age: { child:"Moins de 12 ans", teen:"13 à 17 ans", adult:"18 à 64 ans", senior:"65 ans et plus" },
    accessTitle: "As-tu des besoins d'accessibilité ?", accessSub: "Choisis-en autant que tu veux. C'est juste pour toi.",
    access: { lowvision:"Basse vision ou aveugle", deaf:"Sourd ou malentendant", mobility:"Besoins physiques ou de mobilité", intellectual:"Déficience intellectuelle ou trouble d'apprentissage", sensory:"Autisme ou sensibilité sensorielle", none:"Aucun de ces besoins" },
    tabFind: "Trouver",
    tabBooked: "Mes réservations",
    bookedTitle: "Tes activités réservées",
    bookedHelp: "Touche une réservation pour la choisir. Ensuite, touche le grand bouton rouge pour l'annuler.",
    bookedEmpty: "Aucune réservation pour l'instant.",
    bookedEmptyHint: "Quand tu touches « J'y vais », l'activité apparaît ici.",
    selectWord: "Choisir", selectedWord: "Choisie",
    cancelBtn: "Annuler les réservations choisies",
    selectFirst: "Touche d'abord une réservation, puis le bouton rouge.",
    confirmQ: "Es-tu sûr de vouloir annuler ?",
    confirmYes: "Oui, annuler", confirmNo: "Non, garder",
    cancelledMsg: "C'est fait — annulé. Tu peux réserver à nouveau quand tu veux.",
    bookedAdded: "Ajouté à Mes réservations. Tu peux la voir ou l'annuler dans l'onglet Mes réservations.",
  },
  es: {
    greeting: "Hola, soy Belong. Toca una imagen. Te mostraré algo cerca de ti.",
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
    settings: "Ajustes", close: "Cerrar los ajustes", startOver: "Empezar de nuevo",
    textSize: "Tamaño del texto", textNormal: "Normal", textLarge: "Grande", textXlarge: "Muy grande",
    contrast: "Contraste alto", readAloud: "Leer en voz alta", language: "Idioma",
    on: "Activado", off: "Desactivado", forOrgs: "Para organizaciones",
    cats: { food:"Comida", people:"Conocer gente", kids:"Niños y familia", health:"Salud", learn:"Aprender", money:"Ayuda con dinero" },
    notSure: "No estoy seguro — muéstrame todo", back: "Volver",
    free: "Gratis",
    register: "Inscribirme", registrationNeeded: "Inscripción necesaria",
    justWalkIn: "Entra sin cita", stepFree: "Sin escalones", asl: "ASL",
    onbSkip: "Omitir", onbNext: "Siguiente", onbBack: "Atrás", onbDone: "Listo",
    locTitle: "¿Dónde estás?", locSub: "Esto me ayuda a encontrar cosas cerca de ti.",
    loc: { kitchener:"Kitchener", waterloo:"Waterloo", cambridge:"Cambridge", townships:"Zonas rurales", notsure:"No estoy seguro" },
    intTitle: "¿Qué te interesa?", intSub: "Elige tantos como quieras.",
    ageTitle: "¿Cuál es tu grupo de edad?", ageSub: "Esto me ayuda a mostrarte lo correcto.",
    age: { child:"Menos de 12", teen:"13 a 17", adult:"18 a 64", senior:"65 o más" },
    accessTitle: "¿Tienes alguna necesidad de accesibilidad?", accessSub: "Elige tantas como quieras. Esto es solo para ti.",
    access: { lowvision:"Baja visión o ciego", deaf:"Sordo o con dificultad auditiva", mobility:"Necesidades físicas o de movilidad", intellectual:"Discapacidad intelectual o de aprendizaje", sensory:"Autismo o sensibilidad sensorial", none:"Ninguna de estas" },
    tabFind: "Buscar",
    tabBooked: "Mis reservas",
    bookedTitle: "Tus actividades reservadas",
    bookedHelp: "Toca una reserva para elegirla. Después toca el botón rojo grande para cancelarla.",
    bookedEmpty: "Todavía no tienes reservas.",
    bookedEmptyHint: "Cuando toques «Voy a ir», la actividad aparecerá aquí.",
    selectWord: "Elegir", selectedWord: "Elegida",
    cancelBtn: "Cancelar las reservas elegidas",
    selectFirst: "Primero toca una reserva, después el botón rojo.",
    confirmQ: "¿Seguro que quieres cancelar?",
    confirmYes: "Sí, cancelar", confirmNo: "No, conservar",
    cancelledMsg: "Listo — cancelado. Puedes reservar otra vez cuando quieras.",
    bookedAdded: "Guardado en Mis reservas. Puedes verla o cancelarla en la pestaña Mis reservas.",
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

/* Voices load asynchronously — cache them and refresh on `voiceschanged`. */
let _voices = [];
function refreshVoices() {
  if (!('speechSynthesis' in window)) return;
  _voices = speechSynthesis.getVoices() || [];
}
if ('speechSynthesis' in window) {
  refreshVoices();
  speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
}

/* Names that signal a modern, natural-sounding voice… */
const GOOD_VOICE = /natural|neural|google|siri|samantha|premium|enhanced|aria|jenny|libby|guy/i;
/* …and legacy/novelty voices that sound robotic ("alien"). */
const BAD_VOICE  = /albert|zarvox|fred|bad news|cellos|bells|boing|bubbles|deranged|hysterical|trinoids|whisper|wobble|organ|good news|jester|superstar|junior|kathy|ralph|bahh|novelty/i;

/* Pick the most human-sounding installed voice for a language tag. */
function pickVoice(langTag) {
  if (!_voices.length) refreshVoices();
  const base = langTag.split('-')[0].toLowerCase();
  const candidates = _voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(base));
  if (!candidates.length) return null;
  const score = v => {
    let s = 0;
    if (v.lang.toLowerCase() === langTag.toLowerCase()) s += 3; /* exact regional match */
    if (GOOD_VOICE.test(v.name)) s += 5;
    if (BAD_VOICE.test(v.name)) s -= 10;
    if (v.localService === false) s += 2; /* online voices tend to be neural */
    if (v.default) s += 1;
    return s;
  };
  return candidates.slice().sort((a, b) => score(b) - score(a))[0];
}

/* Fallback: browser Web Speech API (used when ElevenLabs is unavailable). */
function speakLocal(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = VOICE_LANG[state.lang];
  const voice = pickVoice(u.lang);
  if (voice) u.voice = voice;
  u.rate = 0.98;  /* natural, unhurried cadence */
  u.pitch = 1.0;  /* neutral, human tone */
  speechSynthesis.speak(u);
}

/* ---------- Generative Voice AI (ElevenLabs) ----------
   Paste an ElevenLabs API key below to get natural, human-sounding speech.
   NOTE: this is a client-side demo key — it is visible in the page source.
   Use a free-tier / usage-restricted key. If left empty, the app cleanly
   falls back to the browser's built-in voice (speakLocal). */
const ELEVEN_API_KEY  = '653d8c29147ad8e3cd2f3a57fab476ad5dd992a7e1f7f9fe3113d960242869e2'; /* <-- ElevenLabs key */
const ELEVEN_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL';   /* "Sarah" — warm, reassuring, free-plan voice */
const ELEVEN_MODEL    = 'eleven_multilingual_v2'; /* handles en / fr / es */

let currentAudio = null;
const _ttsCache = new Map();

/* Browsers block audio until the user interacts with the page. Track that
   first gesture so the opening greeting can play in the ElevenLabs voice. */
let audioUnlocked = false;
let pendingGreeting = null;
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  if (pendingGreeting) { const txt = pendingGreeting; pendingGreeting = null; speak(txt); }
}
['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
  document.addEventListener(ev, unlockAudio, { once: false })
);

/* Show a small, one-time notice if the natural voice can't be used, so a
   failed ElevenLabs call is visible instead of silently sounding robotic. */
let _ttsWarned = false;
function warnTTS(reason) {
  console.error('[Belong TTS] ElevenLabs unavailable — using browser voice.', reason);
  if (_ttsWarned) return;
  _ttsWarned = true;
  try {
    const note = el(`<div class="row guide"><div class="bubble" style="opacity:.7;font-size:.85em"></div></div>`);
    note.querySelector('.bubble').textContent = '⚠️ Natural voice unavailable — using the built-in voice. (See console for details.)';
    chat.appendChild(note); scroll();
  } catch (_) {}
}

/* Stop whatever is currently speaking (ElevenLabs audio or Web Speech). */
function stopSpeech() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

function playAudioUrl(url, fallbackText) {
  stopSpeech();
  const audio = new Audio(url);
  currentAudio = audio;
  audio.play().catch(err => {
    /* Autoplay blocked before the first user gesture: expected, not an error —
       just fall back to the built-in voice so it's never silent. */
    if (fallbackText) speakLocal(fallbackText);
  });
}

async function speak(text) {
  if (!text) return;
  if (!ELEVEN_API_KEY) { stopSpeech(); speakLocal(text); return; }

  /* Before the first user interaction, audio can't play at all — stay silent
     and remember the line so unlockAudio() can speak it in the natural voice
     the moment the user taps/clicks (avoids a robotic greeting on load). */
  if (!audioUnlocked) { pendingGreeting = text; return; }

  const key = state.lang + '|' + text;
  if (_ttsCache.has(key)) { playAudioUrl(_ttsCache.get(key), text); return; }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: { 'xi-api-key': ELEVEN_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          model_id: ELEVEN_MODEL,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      }
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText} ${detail}`.trim());
    }
    const url = URL.createObjectURL(await res.blob());
    _ttsCache.set(key, url);
    playAudioUrl(url, text);
  } catch (err) {
    /* Network/CORS failure (common when opened via file://) or a non-OK
       status (401 bad key, 402 plan/voice). Surface it, then fall back. */
    warnTTS(err && err.message ? err.message : err);
    speakLocal(text);
  }
}

/* ---------- chat primitives ---------- */
function addGuide(text, { spoken } = {}) {
  const row = el(`<div class="row guide"><div class="bubble"></div></div>`);
  row.querySelector('.bubble').textContent = text;
  const say = spoken || text;
  const replay = el(
    `<button type="button" class="replay"><span class="ms" aria-hidden="true">volume_up</span></button>`
  );
  replay.setAttribute('aria-label', t('readAgain'));
  replay.setAttribute('title', t('readAgain'));
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
      wrap.remove();
      o.onPick();
    });
    box.appendChild(btn);
  });
  chat.appendChild(wrap);
  scroll();
}

/* Easy Read card: one fact + one picture per row. */
function addCard(ev) {
  const dayName = ev.date
    ? new Date(`${ev.date}T12:00:00`).toLocaleDateString(VOICE_LANG[state.lang], { weekday:'long', month:'long', day:'numeric' })
    : DAY_NAMES[state.lang][ev.day];
  let chips = (ev.access || []).map(a => {
    const chipPict = { stepFree:'wheelchair', asl:'deaf', justWalkIn:'welcome' }[a];
    return `<span class="chip"><img src="${pict(chipPict)}" alt="">${t(a)}</span>`;
  }).join('');
  if (ev.registrationRequired) chips += `<span class="chip"><span class="ms" aria-hidden="true">how_to_reg</span>${t('registrationNeeded')}</span>`;
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
        <a class="btn act-register" hidden target="_blank" rel="noopener"><span class="ms" aria-hidden="true">how_to_reg</span>${t('register')}</a>
      </div>
    </div></div>`);
  card.querySelector('.card-title').textContent = ev.title;
  card.querySelector('.card-org').textContent = ev.org;
  card.querySelector('.card-place').textContent = ev.place;
  if (ev.registrationRequired && ev.registrationUrl) {
    const registerLink = card.querySelector('.act-register');
    registerLink.href = ev.registrationUrl;
    registerLink.hidden = false;
  }


  const spokenCard = `${ev.title}. ${dayName}, ${ev.time}. ${ev.place}. ${t('free')}.`;
  card.querySelector('.act-go').addEventListener('click', function () {
    this.disabled = true;
    /* analytics seed: count "I'll go" taps (the spec's nice-to-have) */
    const n = +(localStorage.getItem('belong-going') || 0) + 1;
    localStorage.setItem('belong-going', n);
    addBooking(ev);
    addUser(t('go'));
    addGuide(t('great'));
    addGuide(t('bookedAdded'));
    askReminder(ev);
  });
  chat.appendChild(card);
  if (state.sound) speak(spokenCard);
  scroll();
  return card;
}

/* ---------- onboarding survey (first visit only) ----------
   Four tap-to-choose menus: location, interests, age group,
   accessibility needs. Same rule as the rest of the app: every
   option is colour + icon + word, always together. Colours are
   reused from the six category hues above — each menu is a
   separate full screen, so there's no ambiguity in reusing them. */
const REGIONS = [
  { key:'kitchener', ms:'location_city',   cls:'c-food' },
  { key:'waterloo',  ms:'account_balance', cls:'c-people' },
  { key:'cambridge', ms:'cottage',         cls:'c-kids' },
  { key:'townships', ms:'landscape',       cls:'c-health' },
  { key:'notsure',   pict:'help',          cls:'c-learn' },
];
const AGE_GROUPS = [
  { key:'child',  ms:'child_care', cls:'c-food' },
  { key:'teen',   ms:'school',     cls:'c-people' },
  { key:'adult',  ms:'person',     cls:'c-kids' },
  { key:'senior', ms:'elderly',    cls:'c-health' },
];
const ACCESS_NEEDS = [
  { key:'lowvision',    ms:'visibility_off', cls:'c-food' },
  { key:'deaf',         pict:'deaf',         cls:'c-people' },
  { key:'mobility',     pict:'wheelchair',   cls:'c-kids' },
  { key:'intellectual', ms:'psychology',     cls:'c-health' },
  { key:'sensory',      ms:'spa',            cls:'c-learn' },
  { key:'none',         ms:'check_circle',   cls:'c-money' },
];
const ONB_STEPS = ['location', 'interests', 'age', 'access'];
let onbIndex = 0;
const onbAnswers = { location: null, interests: [], age: null, access: [] };

function makeOptBtn(o, label) {
  const visual = o.pict
    ? `<span class="dot"><img src="${pict(o.pict)}" alt=""></span>`
    : `<span class="dot"><span class="ms" aria-hidden="true">${o.ms}</span></span>`;
  const btn = el(`<button type="button" class="opt ${o.cls}">${visual}<span class="opt-label"></span></button>`);
  btn.dataset.key = o.key;
  btn.querySelector('.opt-label').textContent = label;
  return btn;
}

function makeSingleOpt(o, label, onPick) {
  const btn = makeOptBtn(o, label);
  btn.addEventListener('click', () => {
    $('#onbOptions').querySelectorAll('.opt').forEach(b => { b.disabled = true; });
    btn.classList.add('picked');
    onPick();
  });
  return btn;
}

/* `exclusiveKey` (e.g. "none of these") clears/blocks the rest of the group. */
function makeMultiOpt(o, label, targetArr, exclusiveKey) {
  const btn = makeOptBtn(o, label);
  btn.classList.add('multi');
  btn.appendChild(el(`<span class="check ms" aria-hidden="true">check_circle</span>`));
  if (targetArr.includes(o.key)) btn.classList.add('selected');
  btn.addEventListener('click', () => {
    const idx = targetArr.indexOf(o.key);
    if (idx !== -1) { targetArr.splice(idx, 1); btn.classList.remove('selected'); return; }
    if (exclusiveKey && o.key === exclusiveKey) {
      targetArr.length = 0;
      $('#onbOptions').querySelectorAll('.opt.selected').forEach(b => b.classList.remove('selected'));
    } else if (exclusiveKey) {
      const ni = targetArr.indexOf(exclusiveKey);
      if (ni !== -1) {
        targetArr.splice(ni, 1);
        $('#onbOptions').querySelector(`.opt[data-key="${exclusiveKey}"]`)?.classList.remove('selected');
      }
    }
    targetArr.push(o.key);
    btn.classList.add('selected');
  });
  return btn;
}

function actionBtn(label, ms, cls, onClick) {
  const btn = el(`<button type="button" class="btn ${cls || ''}"><span class="ms" aria-hidden="true">${ms}</span><span></span></button>`);
  btn.querySelector('span:last-child').textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}

function onbProgressHTML() {
  return ONB_STEPS.map((_, i) =>
    `<span class="dot ${i < onbIndex ? 'done' : ''} ${i === onbIndex ? 'active' : ''}"></span>`
  ).join('');
}

function renderOnboardStep() {
  const step = ONB_STEPS[onbIndex];
  const progress = $('#onbProgress');
  progress.innerHTML = onbProgressHTML();
  progress.setAttribute('aria-label', `Step ${onbIndex + 1} of ${ONB_STEPS.length}`);
  $('#onbSkip').textContent = t('onbSkip');

  const options = $('#onbOptions');
  const actions = $('#onbActions');
  options.innerHTML = '';
  actions.innerHTML = '';

  if (onbIndex > 0) actions.appendChild(actionBtn(t('onbBack'), 'arrow_back', '', onbBack));

  if (step === 'location') {
    $('#onbTitle').textContent = t('locTitle');
    $('#onbSub').textContent = t('locSub');
    options.className = 'onb-options stack';
    REGIONS.forEach(r => options.appendChild(makeSingleOpt(r, t('loc')[r.key], () => { onbAnswers.location = r.key; onbNext(); })));
  } else if (step === 'interests') {
    $('#onbTitle').textContent = t('intTitle');
    $('#onbSub').textContent = t('intSub');
    options.className = 'onb-options';
    CATS.forEach(c => options.appendChild(makeMultiOpt(c, t('cats')[c.key], onbAnswers.interests)));
    actions.appendChild(actionBtn(t('onbNext'), 'arrow_forward', 'primary', onbNext));
  } else if (step === 'age') {
    $('#onbTitle').textContent = t('ageTitle');
    $('#onbSub').textContent = t('ageSub');
    options.className = 'onb-options stack';
    AGE_GROUPS.forEach(a => options.appendChild(makeSingleOpt(a, t('age')[a.key], () => { onbAnswers.age = a.key; onbNext(); })));
  } else if (step === 'access') {
    $('#onbTitle').textContent = t('accessTitle');
    $('#onbSub').textContent = t('accessSub');
    options.className = 'onb-options';
    ACCESS_NEEDS.forEach(a => options.appendChild(makeMultiOpt(a, t('access')[a.key], onbAnswers.access, 'none')));
    actions.appendChild(actionBtn(t('onbDone'), 'check', 'primary', finishOnboarding));
  }

  $('#onboarding').scrollTop = 0;
  $('#onbTitle').focus({ preventScroll: true });
}

function onbNext() {
  if (onbIndex < ONB_STEPS.length - 1) { onbIndex++; renderOnboardStep(); }
  else finishOnboarding();
}
function onbBack() {
  if (onbIndex > 0) { onbIndex--; renderOnboardStep(); }
}
function finishOnboarding() {
  localStorage.setItem('belong-prefs', JSON.stringify(onbAnswers));
  localStorage.setItem('belong-onboarded', '1');
  $('#onboarding').hidden = true;
  $('#app').hidden = false;
  greet();
}
function startOnboarding() {
  $('#app').hidden = true;
  $('#onboarding').hidden = false;
  onbIndex = 0;
  renderOnboardStep();
}
$('#onbSkip')?.addEventListener('click', finishOnboarding);

/* ---------- conversation flow ---------- */
function greet() {
  addGuide(t('greeting'));
  askCategory(t('whatNeed'));
}

function askCategory(prompt) {
  addGuide(prompt);
  const choices = CATS.map(c => ({
    pict: c.pict, cls: c.cls, label: t('cats')[c.key],
    onPick: () => { addUser(t('cats')[c.key], c.pict); state.cat = c.key; askWhen(); },
  }));
  choices.push({ pict:'help', cls:'c-learn', label:t('notSure'), onPick:() => {
    addUser(t('notSure'), 'help'); state.cat = null; askWhen();
  }});
  addOptions(choices);
}

function askWhen() {
  addGuide(t('whenGo'));
  addOptions([
    { ms:'today',          label:t('today'), onPick:() => { addUser(t('today')); pickEvents('today'); } },
    { ms:'date_range',     label:t('week'),  onPick:() => { addUser(t('week'));  pickEvents('week'); } },
    { ms:'all_inclusive',  label:t('any'),   onPick:() => { addUser(t('any'));   pickEvents('any'); } },
    { ms:'arrow_back',     label:t('back'),  onPick:() => { addUser(t('back')); askCategory(t('whatNeed')); } },
  ], { stack:true });
}

function pickEvents(when) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const inCat = EVENTS.filter(e => {
    if (state.cat && e.cat !== state.cat) return false;
    if (!e.date) return true;
    const eventDate = new Date(`${e.date}T12:00:00`);
    const visibleFrom = e.notifyAt ? new Date(e.notifyAt) : new Date(eventDate);
    if (!e.notifyAt) visibleFrom.setDate(visibleFrom.getDate() - (e.noticeDays || 3));
    return now >= visibleFrom && eventDate >= now;
  });
  let list = inCat;
  let intro = t('hereOne');
  if (when === 'today') {
    const todayIso = new Date().toISOString().slice(0, 10);
    const todays = inCat.filter(e => e.date ? e.date === todayIso : e.day === new Date().getDay());
    if (todays.length) list = todays;
    else if (inCat.length) intro = t('noneToday'); /* graceful fallback, never a dead end */
  }
  if (when === 'week') {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const dated = inCat.filter(e => !e.date || new Date(`${e.date}T12:00:00`) <= weekEnd);
    if (dated.length) list = dated;
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

$('#composer')?.addEventListener('submit', e => {
  e.preventDefault();
  const input = $('#msgInput');
  if (input.value.trim()) routeText(input.value.trim());
  input.value = '';
});

$('#btnMic')?.addEventListener('click', () => {
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

/* ---------- accessibility controls (in the settings overlay) ---------- */
function applySettings() {
  document.documentElement.dataset.text = state.text;
  document.documentElement.dataset.contrast = state.contrast ? 'high' : 'normal';
  $('#btnContrast').setAttribute('aria-pressed', String(state.contrast));
  $('#btnSound').setAttribute('aria-pressed', String(state.sound));
  document.querySelectorAll('.lang-row').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));

  /* Localize the panel + header so a language switch re-labels everything. */
  $('#settingsTitle').textContent = t('settings');
  $('#settingsClose').setAttribute('aria-label', t('close'));
  $('#btnSettings').setAttribute('aria-label', t('settings'));
  $('#labelText').textContent = t('textSize');
  $('#labelContrast').textContent = t('contrast');
  $('#labelSound').textContent = t('readAloud');
  $('#labelLang').textContent = t('language');
  $('#orgLink').textContent = t('forOrgs');
  $('.home-label').textContent = t('startOver');
  $('#startOver').setAttribute('aria-label', t('startOver'));

  /* Every setting shows its current state in words, not just a toggle. */
  $('#valueText').textContent = { normal:t('textNormal'), large:t('textLarge'), xlarge:t('textXlarge') }[state.text];
  $('#valueContrast').textContent = state.contrast ? t('on') : t('off');
  $('#valueSound').textContent = state.sound ? t('on') : t('off');

  /* Tabs (remote feature) re-label with the language too. */
  $('#tabFindLabel').textContent = t('tabFind');
  $('#tabBookedLabel').textContent = t('tabBooked');
  updateBookedBadge();
  if (!$('#panelBooked').hidden) renderBooked(); /* re-label in the new language */
}

/* Full-screen settings panel, opened from the header gear. The chat keeps
   living behind it (a real page change would wipe the conversation). */
const settingsPanel = $('#settings');
let settingsReturnFocus = null;
function openSettings() {
  settingsReturnFocus = document.activeElement;
  settingsPanel.hidden = false;
  $('#app').inert = true;
  $('#settingsTitle').focus({ preventScroll: true });
}
function closeSettings() {
  settingsPanel.hidden = true;
  $('#app').inert = false;
  settingsReturnFocus?.focus?.();
}
$('#btnSettings').addEventListener('click', openSettings);
$('#settingsClose').addEventListener('click', closeSettings);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !settingsPanel.hidden) closeSettings();
});

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
  if (state.sound) speak(t('soundOn')); else stopSpeech();
});

document.querySelectorAll('.lang-row').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.lang === state.lang) return;
    state.lang = btn.dataset.lang;
    localStorage.setItem('belong-lang', state.lang);
    applySettings();
    closeSettings(); /* before restart(), so the panel never covers onboarding */
    restart();       /* re-greet in the new language */
  });
});

function restart() {
  stopSpeech();
  chat.innerHTML = '';
  state.cat = null; state.queue = []; state.shown = 0;
  switchTab(0);
  greet();
}
$('#startOver').addEventListener('click', restart);

/* ============================================================
   Tabs + booked appointments
   Same ground rules as the rest of the app: big targets, colour
   never alone, every action announced, and no dead ends — the red
   button explains itself instead of silently doing nothing.
   ============================================================ */

/* ---------- tabs (WAI-ARIA pattern: roving tabindex, arrows move) ---------- */
const TABS = [
  { btn: $('#tabFind'),   panel: $('#panelFind') },
  { btn: $('#tabBooked'), panel: $('#panelBooked') },
];
let activeTab = 0;

function switchTab(i, { focus } = {}) {
  activeTab = i;
  TABS.forEach((tab, j) => {
    const on = i === j;
    tab.btn.setAttribute('aria-selected', String(on));
    tab.btn.tabIndex = on ? 0 : -1;
    tab.panel.hidden = !on;
  });
  $('#composer')?.toggleAttribute('hidden', i !== 0); /* typing to Robin only applies while finding */
  if (i === 1) renderBooked();
  if (focus) TABS[i].btn.focus();
  if (state.sound) speak(i === 1 ? t('bookedTitle') : t('tabFind'));
}

TABS.forEach((tab, i) => tab.btn.addEventListener('click', () => switchTab(i)));

$('.tabs').addEventListener('keydown', e => {
  const jump = { Home: 0, End: TABS.length - 1 };
  const step = { ArrowLeft: -1, ArrowRight: 1 };
  if (e.key in step) {
    e.preventDefault();
    switchTab((activeTab + step[e.key] + TABS.length) % TABS.length, { focus: true });
  } else if (e.key in jump) {
    e.preventDefault();
    switchTab(jump[e.key], { focus: true });
  }
});

/* ---------- booked storage ---------- */
const loadBooked = () => JSON.parse(localStorage.getItem('belong-booked') || '[]');
const saveBookedList = list => localStorage.setItem('belong-booked', JSON.stringify(list));
const selectedIds = new Set();

function addBooking(ev) {
  const list = loadBooked();
  if (list.some(b => b.title === ev.title && b.day === ev.day && b.time === ev.time)) return;
  list.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: ev.title, org: ev.org, day: ev.day, time: ev.time,
    place: ev.place, cat: ev.cat, pict: ev.pict,
  });
  saveBookedList(list);
  updateBookedBadge();
}

/* Count on the tab, and in its spoken name for screen readers. */
function updateBookedBadge() {
  const n = loadBooked().length;
  const badge = $('#bookedBadge');
  badge.hidden = !n;
  badge.textContent = n;
  $('#tabBooked').setAttribute('aria-label', t('tabBooked') + (n ? `, ${n}` : ''));
}

/* role="status" region: screen readers announce this without moving focus. */
function setBookedStatus(msg) {
  $('#bookedStatus').textContent = msg;
  if (state.sound && msg) speak(msg);
}

const hideConfirm = () => { $('#confirmBox').hidden = true; };

function syncCancelBtn() {
  const n = selectedIds.size;
  $('#btnCancelLabel').textContent = n ? `${t('cancelBtn')} (${n})` : t('cancelBtn');
  /* aria-disabled, not disabled: stays reachable, and tapping it explains
     the next step instead of doing nothing (COGA: no dead ends). */
  $('#btnCancel').setAttribute('aria-disabled', String(!n));
}

function renderBooked() {
  const list = loadBooked();
  selectedIds.forEach(id => { if (!list.some(b => b.id === id)) selectedIds.delete(id); });

  $('#bookedTitle').textContent = t('bookedTitle');
  $('#bookedHelp').textContent = t('bookedHelp');
  $('#bookedHelp').hidden = !list.length;
  $('#bookedEmptyText').textContent = t('bookedEmpty');
  $('#bookedEmptyHint').textContent = t('bookedEmptyHint');
  $('#bookedEmpty').hidden = !!list.length;
  $('#btnCancel').hidden = !list.length;
  hideConfirm();

  const ul = $('#bookedList');
  ul.innerHTML = '';
  list.forEach(b => {
    /* Selectable card: a real button with role="checkbox", so Enter and
       Space both work and the checked state is spoken. Selection is shown
       three ways — accent border, filled check, and the word itself. */
    const li = el(`
      <li class="booked-item">
        <button type="button" class="booked-card c-${b.cat}" role="checkbox" aria-checked="false">
          <span class="dot"><img src="${pict(b.pict)}" alt=""></span>
          <span class="booked-info">
            <span class="booked-name"></span>
            <span class="booked-org"></span>
            <span class="booked-meta"><img src="${pict('clock')}" alt="">${DAY_NAMES[state.lang][b.day]}, ${b.time}</span>
            <span class="booked-meta"><img src="${pict('place')}" alt=""><span class="booked-place"></span></span>
          </span>
          <span class="booked-check"><span class="ms" aria-hidden="true">check</span><span class="booked-check-word"></span></span>
        </button>
      </li>`);
    li.querySelector('.booked-name').textContent = b.title;
    li.querySelector('.booked-org').textContent = b.org;
    li.querySelector('.booked-place').textContent = b.place;
    const btn = li.querySelector('.booked-card');
    const word = li.querySelector('.booked-check-word');
    const sync = () => {
      const on = selectedIds.has(b.id);
      btn.setAttribute('aria-checked', String(on));
      word.textContent = on ? t('selectedWord') : t('selectWord');
    };
    sync();
    btn.addEventListener('click', () => {
      selectedIds.has(b.id) ? selectedIds.delete(b.id) : selectedIds.add(b.id);
      sync();
      syncCancelBtn();
      hideConfirm();
      setBookedStatus('');
      if (state.sound) speak(`${b.title}. ${selectedIds.has(b.id) ? t('selectedWord') : t('selectWord')}`);
    });
    ul.appendChild(li);
  });

  syncCancelBtn();
  updateBookedBadge();
}

/* Big red button → confirm step → cancel. Never destroys on first tap. */
$('#btnCancel').addEventListener('click', () => {
  if (!selectedIds.size) return setBookedStatus(t('selectFirst'));
  setBookedStatus('');
  $('#confirmText').textContent = t('confirmQ');
  $('#confirmYesLabel').textContent = t('confirmYes');
  $('#confirmNoLabel').textContent = t('confirmNo');
  const box = $('#confirmBox');
  box.hidden = false;
  box.focus(); /* the reader lands on the question, not past it */
  if (state.sound) speak(t('confirmQ'));
});

$('#btnConfirmYes').addEventListener('click', () => {
  const all = loadBooked();
  const gone = all.filter(b => selectedIds.has(b.id));
  saveBookedList(all.filter(b => !selectedIds.has(b.id)));
  /* a cancelled booking shouldn't still fire its reminder */
  const reminders = JSON.parse(localStorage.getItem('belong-reminders') || '[]')
    .filter(r => !gone.some(b => b.title === r.title && b.day === r.day && b.time === r.time));
  localStorage.setItem('belong-reminders', JSON.stringify(reminders));
  selectedIds.clear();
  renderBooked();
  setBookedStatus(t('cancelledMsg'));
  $('#bookedTitle').focus(); /* confirm box is gone; land somewhere real */
});

$('#btnConfirmNo').addEventListener('click', () => {
  hideConfirm();
  setBookedStatus('');
  $('#btnCancel').focus();
});

/* ---------- go ---------- */
applySettings();
greet();
