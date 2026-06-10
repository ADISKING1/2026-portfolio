# ✦ INK — 2026 Portfolio

A portfolio that doesn't look like a template: an interactive print-zine with a
**particle-physics hero**, decoder-style headings, a custom cursor, and floating
project previews. **All of your content lives in one file —
[`config.js`](config.js).** Edit it, open `index.html`, and the site is yours.
No build step, no dependencies, no framework.

## Quick start

1. Open **`config.js`** in any editor.
2. Replace the sample info (name, roles, bio, skills, experience, projects,
   socials) with your own.
3. Open **`index.html`** in a browser. Done.

> Tip: for local development, any static server works,
> e.g. `python3 -m http.server` or `npx serve`.

## The signature moments

- **Particle hero** — your name assembles from ~3,000 physics particles; sweep
  the cursor through them and they scatter and spring back. Click for a burst.
  Automatically falls back to your first name or initials if the name is long,
  and to static type for reduced-motion visitors.
- **Floating work previews** — projects are an editorial list; hovering a row
  summons a preview card that chases the cursor and tilts with its velocity.
- **Decoder headings** — section titles scramble in like a cipher resolving.
- **Custom cursor** — blend-mode dot + trailing ring, with context labels
  ("View", "Play") over interactive areas.
- **Print-zine chrome** — sticky section bars that stack as you scroll, giant
  outlined watermark titles with scroll parallax, hazard-tape marquees,
  registration marks, film grain, a rotating "open to work" sticker badge, and
  a live local-time clock in the footer.
- **Ink / Paper themes** — warm near-black or cream paper, one toggle,
  remembered per visitor.

## What you can customize (all in `config.js`)

| Key | What it does |
| --- | --- |
| `name`, `logo` | Your name — drives the particle hero, nav, badge and favicon |
| `theme.accent` | Any hex color — the single loud accent everything keys off |
| `theme.mode` | `"dark"` (ink), `"light"` (paper), or `"auto"` |
| `hero.roles` | Shown in the hero corners and the marquee tape |
| `hero.availability` | Blinking status dot + tape + badge ring text |
| `about.photo` | Path to your photo — leave `""` for an initials stamp |
| `about.stats` | Animated count-up numbers |
| `skills` | Grouped "type wall" lists (hover makes words bloat) + ghost tape |
| `experience` | Editorial career rows |
| `projects` | Work rows — `featured: true` adds a star; covers auto-generate if no image |
| `socials` | Print-footer link grid (any platform name works) |
| `resume.url` | Adds a résumé row to the About meta table |

**Sections hide themselves automatically** — set `projects: []` (or empty any
section's content) and both the section and its nav link disappear.

## Accessibility & performance

- Semantic HTML with a screen-reader-safe `<h1>` behind the canvas
- Full `prefers-reduced-motion` support (static hero, no cursor, no marquee)
- Keyboard navigable, focus-visible styles, Escape closes the menu
- Particle count adapts to screen size; the simulation pauses off-screen
- Zero dependencies — three static files and two Google Fonts

## Deploying (free options)

- **GitHub Pages** — push this folder to a repo, enable Pages on the main branch.
- **Netlify / Vercel** — drag and drop the folder. No build command; output is the root.

## File map

```
index.html      page shell (you rarely touch this)
config.js       ← YOUR CONTENT — the only file you need to edit
css/style.css   design system & all styling
js/main.js      renders the page from config.js + all interactions
assets/         (optional) your photo & project images
```
