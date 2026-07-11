# Product

## Register

product

## Users

People with cognitive and learning disabilities, low vision, low literacy, and AAC users in Kitchener-Waterloo — the people a cluttered community calendar leaves behind. Used on their own phone, often with support workers or caseworkers alongside. Secondary users: nonprofit staff posting opportunities via `post.html` (~1 minute, no training).

## Product Purpose

Belong ("Robin" is the in-app guide) replaces "search a community calendar" with a texting-style conversation: one simple question at a time, answered by tapping big picture buttons, ending in one clear Easy Read event card. Success = two taps from opening the app to seeing where free lunch is. Built for the KW Habilitation Impact-a-thon 2026 (The Belonging Collective).

## Brand Personality

Calm, friendly, trustworthy. Feels like texting a friend who knows everything happening nearby. Warm and human, never clinical or childish; quiet confidence, zero urgency.

## Anti-references

- Cluttered community calendars and filter panels — the exact thing this replaces.
- Clip-art "accessible app" aesthetics; symbols are real ARASAAC AAC pictograms, never decoration.
- Busy dashboards, notification-heavy patterns, anything with time pressure or dead ends.

## Design Principles

1. **One thing at a time.** One question, one card, one decision per screen moment (Talking Mats / First-Then).
2. **Symbol + word, always together.** Every choice pairs a pictogram, a word, and optional speech (Makaton / aided AAC); pictures never stand alone, color never carries meaning alone.
3. **Big, forgiving, reversible.** Targets ≥ 56px, no time limits, nothing lost on reload, unknown input re-offers the pictures (W3C COGA).
4. **Calm is a feature.** Minimal motion, low-glare palette, no overwhelm; decluttering must never thin affordances — boundaries are comprehension for this audience.
5. **Grounded in practice, not vibes.** PECS-informed interaction, Easy Read cards, Atkinson Hyperlegible; changes should trace to established disability-services practice.

## Accessibility & Inclusion

WCAG 2.1 AA self-audited. `role="log"` live-region chat, real labelled buttons, `alt=""` pictograms (word label always adjacent). One-tap modes: high contrast (black/white/yellow), text size 18→22→27px (all rem), read-aloud (ElevenLabs → Web Speech fallback), mic input, trilingual EN/FR/ES. 4px visible focus rings, full keyboard path, `prefers-reduced-motion` respected. Any new UI must keep all of these working and localized.
