# M-World — Website Build Brief

A scrollytelling landing page for M-World, framed as the unveiling of a new category (Autonomous Organizations) rather than a SaaS homepage. Reference motion language: a single 3D element ("the Node") threads through every section the way the sphere does in the Credify reference recording — sticky highlighted lists, a 3D travel path, color-block section transitions — re-skinned into a monochrome, premium palette.

## 1. Assumptions Made (flag anything you want changed)

- **Primary CTA:** "Request Early Access" (waitlist-style, low friction, no pricing/demo pressure)
- **Scope:** single immersive one-page scroll experience, no secondary pages yet
- **Palette:** monochrome (near-black / charcoal / off-white / grays) + one restrained glow accent used only on the Node and key emphasis moments
- **Stack:** static site (HTML/CSS/JS or Next.js, your call) + Three.js for the Node + GSAP ScrollTrigger for scroll-sync

## 2. Design System

**Color tokens**
- `--bg-void`: #0A0A0B (primary dark background)
- `--bg-charcoal`: #161618 (secondary dark section)
- `--bg-paper`: #F5F4F2 (light section, slightly warm off-white, not pure white)
- `--ink-primary`: #ECECEC (text on dark)
- `--ink-secondary`: #8A8A8E (muted text on dark)
- `--ink-dark`: #111113 (text on light)
- `--ink-dark-muted`: #6B6B6F (muted text on light)
- `--accent-glow`: #D8DEE8 → very pale cool white, used as a soft light source on the Node only — not a "brand color," more like a light temperature
- `--line`: rgba(255,255,255,0.08) for hairline dividers on dark; rgba(0,0,0,0.08) on light

**Typography**
- One serif or high-contrast display face for headlines (e.g. a grotesk-serif hybrid like "Söhne Breit," "GT Sectra," or "Canela" — something editorial, not techy) at 64–120px on desktop, tight tracking, line-height ~1.05
- One clean grotesk for body/UI (e.g. "Inter," "Suisse Int'l," or "Neue Montreal") at 16–18px, line-height 1.6, generous letter-spacing on labels/eyebrows (uppercase, +0.08em)
- Avoid more than 2 typefaces total

**Spacing / grid**
- Section vertical padding: 160–220px desktop, 96–120px mobile — generous, per brief's "let visuals breathe"
- Max content width ~1200px, but headlines can break the grid and run wider for drama
- 8px base spacing unit

**Motion principles**
- Easing: custom cubic-bezier mimicking slow-in/slow-out (e.g. `0.65, 0, 0.35, 1`), nothing bouncy or elastic
- Durations: 600–1200ms for section-level reveals, 200–400ms max for micro-interactions (buttons, links)
- Respect `prefers-reduced-motion`: fall back to simple opacity fades, Node becomes a static decorative element

## 3. The Signature Element: "The Node"

A single glowing sphere (or faceted point-of-light form) that represents an autonomous agent. It never disappears — it just changes role and state as the user scrolls, which is what stitches the whole narrative together.

**States across the page:**
1. **Hero:** centered, slow idle pulse/rotation, alone on `--bg-void`
2. **Departments section:** travels vertically down a sticky list, "locking into" each row as it's scrolled into focus (mirrors the Credify highlighted-row pattern)
3. **How It Works:** travels along a thin curved 3D path connecting 3 numbered steps, leaving a faint trailing light line behind it
4. **Vision section:** the Node multiplies briefly into several smaller nodes that align into a single formation, then collapse back to one — visualizing "departments becoming one intelligence" — then fades to let typography dominate (this is the emotional peak; don't over-animate it)
5. **Closing CTA:** resolves into the CTA button itself, glow intensifies slightly on hover

**Implementation:** one `<canvas>` Three.js scene, `MeshPhysicalMaterial` (low roughness, slight transmission, soft single-point light + faint environment map for the highlight — no harsh specular). Position driven by scroll progress via GSAP ScrollTrigger, interpolated along a `CatmullRomCurve3` authored to pass through each state's anchor point. Camera stays mostly static; the Node moves, not the world — keeps it feeling controlled and premium rather than chaotic. Everything else (text, layout, section backgrounds) is plain DOM/CSS — only the Node needs WebGL.

## 4. Section-by-Section Brief

**1. Hero — Curiosity**
- Background: `--bg-void`
- Headline direction: a single confident line, e.g. "The Operating System for Autonomous Organizations" — no subhead feature-dump, maybe one quiet supporting line
- Layout: centered, Node idle below/behind headline
- Motion: headline fades/tracks in on load, Node has continuous slow idle motion, subtle scroll-down cue

**2. Reframe — Discovery**
- Background: transitions to `--bg-charcoal`
- Copy direction: large-type statement — "This is not another AI tool." / "This is a new way to build and operate businesses." (from the brief, near-verbatim is fine, it's your own copy)
- Layout: mostly typographic, minimal visual noise
- Motion: text reveals line by line as user scrolls, slow

**3. The Problem — Understanding (part 1)**
- Background: `--bg-void` or charcoal
- Copy direction: short framing of fragmentation — departments, disconnected tools, human coordination overhead (pull from brief's Problem section, your own words)
- Visual: a deliberately "disconnected" node/line diagram — scattered points, no Node travel here, this is the "before" state, intentionally a little static/cold
- Motion: minimal — almost still, to contrast with the coordinated motion later

**4. The Solution — Understanding (part 2)**
- Background: `--bg-paper` (the one light section — a tonal "reveal" moment)
- Copy direction: "Instead of AI assisting employees, AI becomes the organization."
- Layout: sticky department list (Research, Marketing, Sales, Technology, Finance, Support, Operations), each row gets highlighted as the Node travels past it — directly adapted from the Credify reference pattern
- Motion: row-by-row lock-in as Node passes, smooth not snappy

**5. How It Works — Excitement**
- Background: back to `--bg-void`
- Copy direction: 3 steps (e.g. "Deploy the organization" → "Departments coordinate autonomously" → "Work executes continuously") — keep it abstract, not feature-y
- Layout: 3D curved path connecting 3 numbered steps, Node travels along it leaving a faint light trail
- Motion: this is the most literal homage to the reference video's 3D track animation

**6. The Vision (Mirror World) — Confidence**
- Background: `--bg-charcoal`, the most spacious section
- Copy direction: the brief's parallel structure — "Just as humans have companies, AI will have companies..." — biggest type on the page, almost no other UI
- Visual: Node-multiply-and-converge moment (see Node states above), then fades out, leaving pure typography
- Motion: slowest section on the page — this is the "this feels inevitable" beat, don't rush it

**7. Closing CTA — Action**
- Background: `--bg-void`
- Copy direction: short, direct — "Request Early Access" — no hard sell
- Layout: Node resolves into the CTA element itself
- Motion: glow/scale response on hover, otherwise calm

**Footer**
- Minimal — logo mark, 2–3 links, no dense sitemap. Keep the cinematic feeling intact to the very last pixel.

## 5. Technical Architecture

- **Stack:** Next.js (or plain Vite + HTML) + Three.js (`@react-three/fiber` if using React, vanilla Three.js otherwise) + GSAP + ScrollTrigger
- **Structure:** one persistent `<Canvas>`/Three.js scene mounted once, position/state driven entirely by a single scroll-progress value computed via ScrollTrigger; DOM sections are siblings, not children, of the canvas
- **Performance:** lazy-init the Three.js scene after first paint; cap pixel ratio at 1.5–2x; pause render loop when canvas is out of viewport
- **Mobile fallback:** simplify Node to a 2D radial-gradient circle (CSS) with the same scroll-driven position logic via GSAP MotionPath — visually close enough at small viewport sizes, avoids WebGL battery drain on phones
- **Accessibility:** `prefers-reduced-motion` fallback noted above; ensure all copy is legible without relying on animation to convey meaning

## 6. Content Still Needed Before Build

- Final logo / wordmark treatment
- Confirmed CTA destination (waitlist form, Typeform, Calendly, etc.)
- Real copy for each section (this brief gives direction, not final copy — happy to draft full copy next if useful)
- Any specific stats, traction, or social proof to include (or confirm there are none yet — fine for a pre-launch teaser)

## 7. Still-Open Decisions

- CTA goal: waitlist vs. demo request vs. pure brand teaser (defaulted to waitlist)
- Scope: one-pager only vs. one-pager + light secondary pages (defaulted to one-pager)
- Accent treatment: pure monochrome vs. monochrome + one glow accent (defaulted to + glow accent)
