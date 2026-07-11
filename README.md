# Belong 💬

**A texting-style way to find free things to do near you — built for the people the community calendar leaves behind.**

Belong replaces "search a cluttered calendar" with a conversation. A friendly guide named Robin asks one simple question at a time; you answer by tapping big picture buttons; you get one clear, visual event card. It feels like texting a friend who knows everything happening in Kitchener-Waterloo — because texting is the interface our users already know.

Built for the KW Habilitation Impact-a-thon 2026 challenge (The Belonging Collective community calendar).

## Try it

No build, no dependencies — it's plain HTML/CSS/JS:

```bash
python3 -m http.server 4173
# open http://localhost:4173            ← the community member app
# open http://localhost:4173/post.html  ← the organization posting form
```

> **Open it through the server (`http://localhost:…`), not by double-clicking `index.html`.**
> A `file://` page has no real origin, so browsers (Firefox especially) block the cross-origin `fetch()` to the ElevenLabs voice API and can serve a stale cached `app.js` — the read-aloud silently falls back to the robotic built-in voice. Serving over HTTP fixes both.

## The two flows (the deliverables)

1. **How a community member discovers an event:** open the app with no setup → Robin asks "What do you need today?" → tap a picture (e.g. Food) → tap when → get one Easy Read event card → tap "I'll go" → optional reminder. Two taps from opening the app to seeing where lunch is; typing is never required.
2. **How a nonprofit posts one:** open `post.html` → seven quick fields (same effort as a calendar entry, ~1 minute) → Post it → the opportunity is immediately discoverable in the prototype on the same device.

See [`HANDOFF.md`](HANDOFF.md) for the participant-package alignment, implementation boundary, decisions, gaps, and continuation plan. See [`PITCH.md`](PITCH.md) for the 60-second pitch and 2.5-minute demo route.

## Why it looks the way it does — every choice is grounded in established practice

This app is built on methods disability services already use every day. It's not "icons because icons are nice":

| Design choice | Grounded in |
|---|---|
| Tap a picture to make your choice known; every tap gives an immediate result | **PECS-informed** (Picture Exchange Communication System, Bondy & Frost 1985). We say *informed* deliberately — real PECS is a physical card-exchange protocol; we borrow its initiation-and-reward structure, not its name. |
| Every choice = symbol + word + optional speech, always together | **Makaton's multimodal principle** and standard **aided AAC** practice (ASHA) |
| All pictures are real AAC pictograms, not clip-art | **ARASAAC** — the free, government-maintained symbol library used across disability services worldwide (see licence below) |
| Event cards: one fact + one picture per row | **Easy Read**, the accessible-information format used by disability services |
| "First: tap a picture. Then: I show you what's on" | **First-Then boards** — visual supports are an evidence-based autism practice (100+ studies) |
| One question at a time, tap don't type, "show me another / no thanks" | **Talking Mats**-style structured choice-making |
| No time limits, nothing lost on reload, no memory demands, no dead ends (unknown input re-offers the pictures) | **W3C COGA** — "Making Content Usable for People with Cognitive and Learning Disabilities" |
| Read-aloud on every message and card | Light **speech-generating device** (SGD) behaviour from high-tech AAC |
| Atkinson Hyperlegible typeface | Designed by the **Braille Institute** for low-vision readers |

### Accessibility features in the build

- **Fat-finger safe:** every target ≥ 56px, most much larger (verified by hit-testing in the browser).
- **Screen readers:** the chat is a `role="log"` live region — each new message is announced; every control is a real, labelled `<button>`; pictograms are `alt=""` because their word label is always beside them.
- **High-contrast mode:** one tap → pure black/white/yellow, symbols lifted onto white pills.
- **Text size:** one tap cycles 18 → 22 → 27px root size; the whole UI scales (all rem units).
- **Read aloud:** one tap → every message and card is spoken with a natural, human-sounding voice (ElevenLabs Generative Voice AI), falling back to the browser's built-in Web Speech voice when offline or no API key is set; every bubble has a "Read again" button.
- **Speak instead of typing:** mic button (Web Speech recognition where the browser supports it; graceful message where it doesn't).
- **Three languages:** English / Français / Español — the whole conversation, one tap.
- **Colour = meaning, never colour alone:** each category owns one colour + one pictogram + one word; green is reserved for "Free"; works in greyscale.
- **No overwhelm:** one question at a time; a card scrolls to its own top so it's never pushed off-screen; used buttons stay visible for context but can't re-fire.
- **`prefers-reduced-motion` respected;** no animations depend on timing.

## What we built vs. what we'd build next

**In the prototype:**
- The full discovery conversation (category → when → Easy Read cards → "I'll go" → reminder), 11 seeded realistic KW events + any events posted through the form
- The organization posting form, feeding the same event pool (localStorage as the stand-in database), with a free map picker, a default 3-day notice window, and optional registration details
- All accessibility modes above, working
- "I'll go" analytics seed (a tap counter — the spec's engagement nice-to-have)

**Next (in rough order):**
1. **Real shared backend** — swap localStorage for a small hosted DB (e.g. Supabase/Postgres: `events` + `orgs` tables; the front end already treats events as one JSON array, so this is a thin swap). Add org accounts + per-org permissions, edit/remove, scheduled postings, auto-archiving of past events (all straightforward once a DB exists).
2. **Embeddable widget** — the chat is already a self-contained column; package it as an `<iframe>`/`<script>` embed with a `?org=` filter so each organization's website shows all opportunities, only theirs, or a custom filtered view.
3. **SMS twin** — the same question/answer script over text messages (Twilio webhook, ~150 lines): serves people with flip phones/no data, and Deaf users for whom text is primary. The conversation design already *is* an SMS conversation.
4. **More filters as questions** — age group, virtual/in-person, interests — each is one more friendly question, not a filter panel.
5. **Registration links & photos on cards**, org profiles/branding, remaining spec items (export/import, API).

## What we didn't solve (honest gaps)

- **Reminders and outbound notices are simulated** — the prototype applies 1-, 3-, or 7-day visibility timing locally and stores reminders locally; actually sending SMS, email, or push notifications needs a shared backend and delivery service.
- **Posting is device-local in the prototype** — a submitted opportunity is stored in `localStorage`, so it appears in the discovery flow on that browser only. Shared multi-organization contribution, accounts, editing, and moderation require the planned backend.
- **Deaf users who sign as a first language:** text + pictures serve low-literacy Deaf users, but ASL-first users would be best served by sign-language video, which needs real production work — flagged, not faked. (The ✋ ASL event tag exists so interpreted events are findable today.)
- **Blind + no phone:** no remote tool reaches someone with no device; our answer is the helper-mediated flow (a caseworker uses the app with them) and, later, the SMS/voice line at libraries and shelters.
- **Event translations:** the interface is trilingual; event titles/places stay as posted. Machine-translating event content is possible but we'd want a human-in-the-loop before promising it.
- **Not yet tested with real users.** This follows the established frameworks, but Easy Read and AAC practice are clear: nothing counts until people with intellectual disabilities, low vision, and low literacy actually try it. That's the first thing KW Hab should do with it — and the co-design session is the point of the handoff.

## How someone continues this

- **Stack: none.** Three static files (`index.html`, `app.js`, `styles.css`) + `post.html`. Any web host serves it (GitHub Pages works today); no build step, no framework, nothing to learn.
- All conversation text lives in one `S` object at the top of `app.js` (EN/FR/ES); categories in `CATS`; events in `BUILTIN_EVENTS`. Change the words without touching logic.
- Pictograms are cached PNGs in `assets/pictograms/`, fetched from the ARASAAC public API (`https://api.arasaac.org/api/pictograms/{lang}/search/{term}` — no key needed). Add a category = add one PNG + one `CATS` entry + one colour pair in `styles.css`.
- WCAG 2.1 AA self-audit notes: contrast ratios pass in both modes; keyboard path works end-to-end (tab → enter); focus is always visible (4px ring). A formal audit with axe/WAVE + a screen-reader user is the recommended next check.

## Licences & credit

- **Pictograms: ARASAAC** — author Sergio Palao, owner Gobierno de Aragón, licence **CC BY-NC-SA**. Free for exactly this kind of non-commercial community use, with attribution (shown in the app footer). ⚠️ The NonCommercial clause means a future *paid* version of this tool could not ship these symbols — a deliberate constraint we accept; this should stay free.
- **Typeface: Atkinson Hyperlegible** (Braille Institute, SIL Open Font License) and **Material Symbols** (Apache 2.0), both via Google Fonts.
- App code: MIT.
