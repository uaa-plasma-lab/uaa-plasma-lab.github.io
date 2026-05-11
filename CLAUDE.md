## CLAUDE.md draft

Mirroring the lab repo's structure but reframed for web dev. Drop this at `~/projects/uaa-plasma-lab/uaa-plasma-lab-website/CLAUDE.md` once the repo exists.

````markdown
# CLAUDE.md — Conventions for AI-Assisted Work on the UAA Plasma Lab Website

This file is read automatically by Claude Code at session start, and is the
canonical reference for how AI assistants should behave when working in this
repository. Human collaborators should also read it: it documents conventions
that apply regardless of who's at the keyboard.

If you (the AI assistant) are reading this, internalize it for the entire
session. If you're unsure how a guideline applies in a specific situation,
ask the user rather than guess.

---

## 1. Project context

This repository hosts the public website and internal-only knowledge base
for the UAA Plasma Lab (PI: Nathaniel Hicks). It supersedes the legacy
http://plasma.uaa.alaska.edu/ site (UAA clubs FTP, http-only) with a
modern, git-managed, content-as-files setup.

Two audiences:

- **Public**: prospective students, collaborators, funders, the broader
  plasma-physics community. They see research areas, people, news,
  publications, presentations.
- **Internal** (logged-in lab members): onboarding guides, lab
  procedures, lab-only contact info, draft material, links to private
  resources. The internal section is access-controlled — public visitors
  cannot reach it.

Three research threads (mirror the lab repo's CLAUDE.md §1, kept in
sync):

- **Multipole Plasma Trap (MPT)** — RF electric multipole confinement of
  quasi-neutral plasmas.
- **Hall thruster emulation** — RF plasma diagnostic development for
  electric propulsion (NASA/JPL).
- **Plasma diagnostics laboratory course** — undergraduate teaching.

Companion repos (per DECISIONS.md in `uaa-plasma-lab`):
- `uaa-plasma-lab` — lab software (MATLAB GUI, drivers, modules).
- `uaa-plasma-course` — course materials (when public).
- `uaa-compass` — proposal / grant material.

This repo is content-and-presentation only. Code-style conventions for
the *lab* code (MATLAB, Python) live in `uaa-plasma-lab`'s CLAUDE.md
and don't apply here.

---

## 2. Tech stack

- **Astro** static site generator (v6.x). Schemas for content live in
  `src/content.config.ts`.
- **Markdown content** under `src/content/` with typed collections:
  - `members/` — one .md per current/former lab member.
  - `news/` — one .md per news item / highlight / presentation / award.
  - `publications/` — one .md per publication.
  - Static pages (research areas, contact) live directly as Markdown
    under `src/pages/` with a `layout:` frontmatter — they are not a
    content collection, since they don't need indexing or filtering.
- **CSS**: Astro scoped `<style>` blocks per component, plus one small
  global stylesheet at `src/styles/global.css` (CSS variables for the
  lab green accent `#3F742F`, base typography, mobile-first responsive
  defaults). No CSS framework. Layer Tailwind in later only if a future
  redesign actually wants it.
- **Build & deploy**: GitHub Actions → GitHub Pages (`.github/workflows/deploy.yml`).
- **Repo name vs local directory.** Local directory is
  `uaa-plasma-lab-website`; GitHub repo is `uaa-plasma-lab.github.io`.
  This deliberate mismatch puts the deploy at the org root
  (`https://uaa-plasma-lab.github.io/page/` instead of
  `https://uaa-plasma-lab.github.io/uaa-plasma-lab-website/page/`).
  After the custom domain `plasma.uaa.alaska.edu` is configured by UAA
  IT, the repo name drops out of URLs entirely.
- **Public + internal split**: public site only at first. The internal
  (lab-only) section is deferred until there is actual internal content
  to publish. When added, options under consideration are (a) a
  separate private repo with private GitHub Pages, or (b) Cloudflare
  Access in front of an `/internal/*` route on the same site. Decision
  is recorded but no infrastructure is in place.

---

## 3. Communication style

- **Be direct.** Short, technical, no hedging. Same conventions as the
  lab repo's CLAUDE.md §3.
- **Avoid filler.** Don't open with "Great question!" or restate what
  was just said.
- **Push back when warranted.** If a content choice or design direction
  has issues (accessibility, broken link, factual error in a publication
  abstract, etc.), say so directly.

---

## 4. Content conventions

Schemas for every collection live in `src/content.config.ts` (Zod).
Invalid frontmatter fails the build — that is the point.

### Adding a member

Create `src/content/members/<lastname>-<firstname>.md`. Example,
`src/content/members/hicks-nathaniel.md`:

```yaml
---
name: Alice Example
role: Undergraduate Student Researcher    # Principal Investigator | Lab Director | Graduate Student Researcher | Undergraduate Student Researcher
                               # multi-role: use a YAML list (e.g., PI + Lab Director)
                               #   role:
                               #     - Principal Investigator
                               #     - Lab Director
status: active                 # active | former | alumni
joined: 2024-08                # YYYY-MM; optional but encouraged
left:                          # YYYY-MM, set when status changes from active
research_thread: MPT           # MPT | Hall thruster | Diagnostics course
                               # multi-thread: use a YAML list
                               #   research_thread:
                               #     - MPT
                               #     - Hall thruster
photo: ./alice-example.jpg     # optional; co-located JPG/PNG in src/content/members/, referenced relative to the .md (Astro Image optimization applies)
email:                         # optional; only if member opts in for public
website:                       # optional external link
orcid:                         # optional
---

Optional bio paragraph here.
```

Status transitions are file edits, not deletions: `active` → `former`
(left mid-degree) or `alumni` (degree completed). Keeping former members
in the file with status set is the lab's institutional memory.

### Adding news / highlights / presentations

Create `src/content/news/YYYY-MM-DD-<short-slug>.md`:

```yaml
---
title: "Short headline"
date: 2026-05-10
kind: news                     # news | presentation | award | media
authors:                       # optional; for presentations
links:                         # optional; array of {label, url}
research_thread:               # optional tag
---

Body paragraph(s) in Markdown.
```

### Adding a publication

Create `src/content/publications/<author>-<year>-<short-slug>.md`:

```yaml
---
title: "Full publication title"
date: 2025-11-12               # publication / preprint / presentation date
kind: journal                  # journal | conference | preprint | thesis
authors:                       # required, ordered list
  - Hicks, N. K.
  - Example, A.
venue: "Phys. Plasmas"         # journal or conference name
doi:                           # optional, no http prefix; e.g. 10.1063/...
arxiv:                         # optional, e.g. 2511.01234
links:                         # optional; array of {label, url}
research_thread: MPT           # optional tag
---

Optional 1-2 sentence abstract / context here.
```

Filename convention prefixes the date so the directory listing sorts chronologically and conflicts are easy to spot.

### Adding a research-area page or other static page

Static pages (Home, Research overview, individual research threads,
Contact) live under `src/pages/` directly. The home and people pages
are `.astro` files (the home page is hand-designed; the people page
queries the members collection). Research-thread pages and Contact are
plain Markdown with a `layout:` frontmatter pointing at
`src/layouts/Base.astro` — see `src/pages/research/mpt.md` for an
example. To add a fourth research thread, add a new `.md` under
`src/pages/research/`, then update `src/components/Nav.astro` (if it
should appear in the nav), the home page card grid in
`src/pages/index.astro`, and `src/pages/research/index.md`.

### Internal-only content (deferred)

There is no internal section yet. When added, the design under
consideration is `src/content/internal/` for content + either a
separate private repo with private GitHub Pages, or Cloudflare Access
in front of `/internal/*` on this site. Never hand-write a page that
references internal content from a public page.

***

## 5. Git conventions

Same as the lab repo's CLAUDE.md §5:

* Trunk-based, all changes via PR against `main`, no direct pushes.
* Branch naming: `firstname/short-topic` (e.g., `nate/add-2026-publications`, `alice/research-area-rewrite`).
* Commit messages: imperative mood, ≤72 character subject, body if the change needs context.
* One logical change per commit.
* PRs: brief description answering what / why / how it was tested (in this repo, "tested" usually means "rendered locally and the build passes").

***

## 6. Maintenance over flash

Pick the boring, durable choice when in doubt.

* **No JavaScript on a content page unless the page genuinely needs it.** Static HTML loads instantly, works offline, ages gracefully. Reserve JS for interactive demos (probe-trace visualizers, plasma parameter calculators, etc.).
* **No build-time dependencies on external CDNs for content.** Vendor fonts, icons, JS libraries into the repo. CDNs disappear; vendored files don't.
* **Mobile-first responsive layouts.** Most prospective-student visits will be on phones.
* **Accessibility is not optional.** Alt text on every image; semantic HTML; sufficient color contrast; keyboard navigability. Use the Lighthouse / axe DevTools checks before merging significant UI work.
* **Lab branding.** UAA Plasma Lab green (`#3F742F`) is the accent color, matching the GUI's `lab.styles().Color.PrimaryAccent`. CSS variables for it (`--color-accent`, `--color-accent-dark`, `--color-accent-light`) live in `src/styles/global.css`. The logo is vendored at `public/uaa-plasma-lab-logo.png` (canonical source is `~/projects/uaa-plasma-lab/uaa-plasma-lab/assets/uaa-plasma-lab-logo.png`).

***

## 7. Honesty over optimism

Same rules as the lab repo's CLAUDE.md §7, web-flavored:

* **Never claim a page "works" without rendering it.** Build the site locally, open the page, look at it.
* **Never invent a publication, citation, member name, or date.** If you can't find a source, say so. The PI has been burned by AI- fabricated bibliographic entries before.
* **Never invent an external link target.** Verify URLs resolve before adding them; broken links accumulate fast.
* **When stuck, ask.** Especially for content involving people's names, titles, and credit ordering — these are sensitive, and a guess can offend a colleague or alumnus.

***

## 8. Privacy / publishing landmines

* **No personal contact info without member opt-in.** Default email field is empty. Lab phone numbers, home addresses, partner names — never on the public site.
* **Internal-only material stays internal.** Don't reference an internal URL from a public page; don't paste internal text into a public page; don't put internal content into the public-search index.
* **Photo permissions.** Use only photos where the subject has agreed to public web display. When in doubt, ask the PI before publishing.
* **Funding-agency acknowledgments.** NSF / NASA / DOE grant numbers must be cited per agency policy on any publication or release. The lab repo's `references/` folder has the canonical grant numbers; keep in sync, do not reinvent.

***

## 9. When in doubt

Ask the PI. The answer to "should I add this person / link / photo / funding mention" is almost always faster than retrieving by guess and unwinding later. This is doubly true for content involving people's names, titles, and degree status.

***

_This document is a living convention. Update it (via PR) when the tech stack stabilizes, when content patterns evolve, or when a landmine is discovered. Mirror the lab repo's CLAUDE.md update cadence._
