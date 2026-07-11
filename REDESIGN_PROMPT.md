Use the **impeccable** skill and the **design-taste-frontend** skill for this task (load both before touching any file; also draw on **minimalist-ui** for direction if helpful). Audit first, then redesign.

## The problem

This project — Robin/Belong, a chat-style app that helps people with cognitive and access needs find free things nearby — feels cluttered and has too much text. Make the UI minimalist, cleaner, simpler, and more aesthetic on BOTH pages: the user app (`index.html` + `app.js` + `styles.css`) and the organizer/admin page (`post.html`). This is a calm-down pass: fewer chrome elements, less redundant text, more whitespace — NOT thinner affordances. This audience needs big targets, icon+word pairing on primary actions, and clear boundaries; minimalism must never cost comprehension or accessibility.

## Required changes — user app (index.html / app.js / styles.css)

1. **Move settings off the main screen.** Delete the always-visible 4-button `.toolbar` (index.html ~L53–66; CSS `.toolbar`/`.tool` in styles.css ~L130–147). Replace it with a full-screen settings overlay (a "settings page" the user opens from a single gear `icon-btn` in the header) containing the four controls: Text size, High contrast, Read aloud, Language. Model it on the existing `.onboarding` overlay pattern (hidden attribute, fixed inset, same 480px column). KEEP the existing element ids `#btnText #btnContrast #btnSound #btnLang #langLabel` so the existing handlers in app.js (~L706–737) and `applySettings()` (~L705) keep working unchanged. Each settings row: icon + label + current value on the right (e.g. "Text size — Large", "Read aloud — On") — this makes state visible, which the old cycling buttons never did. For Language, prefer three explicit rows (English / Français / Español) with the active one marked `aria-pressed="true"`, instead of a cycle button. Proper dialog semantics: `role="dialog" aria-modal="true"`, focus moves to the title on open, Escape + Close button both close and return focus to the gear, `#app` gets `inert` while open. The language handler must close the panel before calling `restart()`.

2. **Shrink every "Read again" button.** In `addGuide()` (app.js ~L342–354), replace the labeled `.replay` pill with a small icon-only button: a `volume_up` Material Symbol, ~40×40px circular hit area, borderless/transparent with subtle hover, `aria-label` set to the localized `t('readAgain')` string (the key already exists in en/fr/es) plus a matching `title`. Restyle `.replay` in styles.css (~L180–188) accordingly. In high-contrast mode give it a visible border.

3. **Clean the header + footer.** Header: avatar + name + gear (+ Start over, whose label may collapse to icon-only under 500px as the CSS already does). Footer: keep the ARASAAC attribution (license requires it) but tighten to one small line; move the "For organizations" link into the settings panel as a plain link row.

4. **i18n**: any new visible or aria string gets en/fr/es entries in the `S` dict (app.js ~L30): settings, close, text size + value names, contrast, read aloud, language, on/off, start over, for-organizations. Extend `applySettings()` to re-localize the panel's static strings and value labels after a language switch. Do NOT change localStorage keys or value formats (`belong-lang`, `belong-text`, `belong-contrast`, `belong-sound`, `belong-events`, …).

## Required changes — admin side (post.html)

5. **Declutter the organizer form.** Delete the `.lead` intro paragraph (internal roadmap prose). Shorten labels: "What is it? (keep it short)" → "What is it?"; "Where? (place and street)" → "Where?"; collapse the two-sentence map help to one line ("Type to search, or tap the map.") keeping the `aria-describedby` wiring. Replace the nine per-field inline `style="margin-bottom:18px"` attributes with a single `#postForm { display:flex; flex-direction:column; gap:18px }` rule. Reduce the Leaflet map height 300px → 240px. Tighten the header sub-line ("Takes about a minute."). Keep the pictogram category grid, icon+word accessibility checkboxes, and all inline-script behavior (geocoding, localStorage save to `belong-events`) untouched.

## General minimalism pass (both pages)

6. Reduce visual noise: drop redundant borders/backgrounds on chrome (header/composer/credit), slightly lighter padding on chrome, consistent use of existing tokens (`--target`, `--line`, `--radius`, `--accent`). Do NOT thin the borders on `.opt`, `.btn`, `.card` — for this audience a boundary is comprehension. Keep motion minimal and calm. Keep 4px `:focus-visible` rings everywhere, including all new controls.

## Verify (browser preview — `.claude/launch.json` has a static server)

- Settings: gear opens, focus lands on title, Escape/Close return focus, `#app` inert while open; each control still writes `data-text`/`data-contrast` on `<html>` and persists across reload; language switch closes panel, restarts in the new language, marks the right row active.
- Replay: icon-only button on every guide bubble, ≥40px, replays TTS, announces the localized label.
- High-contrast mode audit of ALL new UI (panel, rows, replay, gear) — readable, bordered, pressed-state visible.
- Keyboard walk both pages; post.html still submits and the event appears in the app; mobile 375px layout clean on both pages.
- Screenshot index.html (main + settings open) and post.html as proof.
