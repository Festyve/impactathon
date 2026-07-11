# Belong handoff

This document maps the working prototype to the Impact-a-thon participant package and makes the boundary between demonstrated work and future work explicit.

## Challenge fit

KW Hab needs a way for multiple nonprofits to contribute events and services while community members of diverse abilities can find relevant programming in one place. Belong prototypes a conversational discovery layer and a low-effort posting flow. It deliberately does not recreate a filter-heavy calendar.

The primary users demonstrated in this prototype are:

- people with low literacy or intellectual disabilities who benefit from one question at a time, picture-supported choices, plain language, and low memory demand;
- people with low vision who benefit from large type, strong focus states, high contrast, and read-aloud support;
- nonprofit staff with limited time or technical training who need a short posting flow.

These are distinct needs. The interface supports several paths, but it does not claim that one generic accessibility mode serves everyone.

## Participant-package alignment

| Package requirement or consideration | What the prototype demonstrates | Honest boundary |
|---|---|---|
| Community member discovers an event | Robin asks one simple question at a time: need/category, then time; the user receives an Easy Read opportunity card | Location, age group, cost, and organization filters are future conversational questions |
| Nonprofit posts one | `post.html` captures organization, short title, category picture, day, time, place, and accessibility information | Data is stored in the current browser only; accounts, editing, moderation, and a shared database are not built |
| Diverse accessibility needs | AAC pictograms with words, read aloud, high contrast, scalable text, keyboard controls, screen-reader semantics, reduced motion, large targets, and EN/FR/ES UI | The design has not yet been tested with real users; event content itself is not translated |
| Ease of use for nonprofit staff | A short, plain-language form with sensible defaults and no training or build step | The prototype does not yet import existing calendars or manage recurring events |
| Discovery by interests, location, age, cost, or organization | Interest/need category and time are working; place, organization, and free cost appear clearly on every card | Additional discovery dimensions should remain one-question-at-a-time, not become a filter wall |
| Collaboration and participation | Multiple named organizations are represented; the posting flow feeds the same opportunity pool used by discovery | Real cross-organization participation requires shared infrastructure and governance |
| Fresh approach, not another calendar | Discovery feels like texting a knowledgeable guide, with picture-supported answers and one result at a time | SMS is a logical extension, not a demonstrated channel |

## Why organizations would contribute

The incentive is reach without duplicate composition: one short, accessible listing can eventually feed the Belong discovery experience, an embeddable website view, and an SMS channel. The prototype proves the low-effort entry format, not the multi-channel publishing infrastructure. A production pilot should also return useful aggregate signals to organizations, such as views, “I’ll go” taps, and underserved demand, while avoiding invasive user tracking.

## What is built

- Static, buildless community-member app in `index.html`, `styles.css`, and `app.js`.
- No-setup, no-typing-required need/category -> time -> Easy Read card -> “I’ll go” -> reminder conversation. A “not sure” choice shows all categories, and previous option grids disappear after a choice to prevent a growing wall of controls.
- Eleven seeded Kitchener-Waterloo opportunities.
- Organization posting form in `post.html`; posted items join discovery on the same browser. Organization name is remembered, the date defaults to tomorrow, location uses a free OpenStreetMap picker, and most events need no optional fields.
- Organizer-selected notice timing in one compact control: 1 day for casual/drop-in events, 3 days by default, 7 days when attendance numbers are needed, or an exact custom date and time. The prototype uses that choice to decide when a posted event appears in discovery.
- Optional registration URL and capacity, hidden in a collapsed section unless needed.
- Read aloud and replay, speech input where supported, high contrast, three text sizes, keyboard operation, screen-reader live region, reduced-motion support, and English/French/Spanish interface text.
- Local “I’ll go” counter as a privacy-conscious analytics seed.
- Zero-backend support tools hidden behind one “More help” control: download a standard `.ics` calendar event with a device reminder, or share the plain-language event details with a trusted helper.
- KW Hab’s existing public calendar is embedded from Teamup. To eliminate duplicate nonprofit entry in production, a KW Hab Teamup administrator should generate a read-only “All calendars” iCalendar feed and configure Belong to import it. The public page URL is not a feed and should not be scraped.

## What is not built

- Shared backend, organization authentication, permissions, edit/delete, moderation, recurring events, or expiry.
- Live outbound reminders/notices, SMS discovery, or embeddable widgets. The prototype models the timing rules but does not send messages.
- Registration links, photos, attachment support, or import from existing nonprofit systems.
- Complete filtering by neighbourhood, age group, cost, or organization.
- Human-reviewed translations of event content.
- Formal accessibility audit or testing with the intended users.

## Key decisions and reasoning

1. **Conversation instead of a calendar.** One decision at a time lowers visual, literacy, and working-memory demands while preserving a familiar texting mental model.
2. **Pictures plus words plus optional speech.** No meaning relies on colour, text, sound, or imagery alone.
3. **One result at a time.** This avoids a dense results wall and provides clear “another” and “no thanks” exits.
4. **Need-first language.** “What do you need today?” is easier to act on than category taxonomy or search syntax.
5. **Static implementation.** Plain HTML/CSS/JS makes the prototype easy to run, inspect, host, and hand off. `localStorage` is explicitly a database stand-in, not a production architecture.
6. **Privacy-conscious engagement signal.** The prototype counts an “I’ll go” tap locally without creating a user profile.

## Recommended continuation plan

1. Test the two core flows with people with intellectual disabilities, low literacy, and low vision, plus nonprofit staff. Observe completion, confusion, abandonment, and preferred wording; do not treat framework-based design as a substitute for co-design.
2. Add a small shared backend with `organizations`, `opportunities`, and aggregate `engagement` data. Add organization accounts, ownership permissions, edit/delete, moderation, and automatic expiry.
   Run one simple scheduled job: select opportunities whose calculated notice time (`notifyAt`, or event date minus `noticeDays`) has arrived, then hand those records to the chosen delivery channel. This keeps timing deterministic and does not require AI.
3. Preserve the current front-end event object as the API contract. Replace the `BUILTIN_EVENTS + localStorage` source in `app.js` with one API request and post the same form shape from `post.html`.
4. Add one conversational question at a time for neighbourhood, age group, cost, and organization. Test whether each added step improves matches enough to justify the extra effort.
5. Add registration links and distinguish events from ongoing services. Then prototype calendar import so organizations do not have to enter the same listing twice.
6. Package the discovery column as an accessible embed and reuse the same conversation state machine for SMS.
7. Run WCAG testing with automated tools, keyboard-only use, screen readers, zoom/reflow, and—most importantly—the intended users.

## Run and hand off

No build step or dependency installation is required:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` for discovery and `http://localhost:4173/post.html` for nonprofit posting. Any static host, including GitHub Pages, can serve the prototype. The first production change should be the shared data layer described above.
