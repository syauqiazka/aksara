# Sahabat Aksara - Design Direction

## Design Read

Reading this as: a public-facing Islamic social-impact foundation website for prospective donors, program beneficiaries, and community partners, using a grounded editorial visual language with a restrained institutional character.

**Dials:** ENERGY 2 / RHYTHM 2 / MOTION 2

## Identity

- **Core palette:** deep forest green, warm cream, and muted gold. These colors already exist in `src/styles/tokens.css`; preserve them unless a documented accessibility or product reason requires a change.
- **Typography:** Fraunces for expressive headings, Plus Jakarta Sans for interface and body copy, and Amiri only where Arabic typography is genuinely needed. The pairing distinguishes institutional storytelling from practical information.
- **Motif:** restrained arch/mihrab geometry and Islamic geometric pattern, used sparingly as a recognizable reference to the organization rather than as a page-filling decoration.
- **Tone:** sincere, specific, respectful, and clear. Prefer plain Indonesian over grand claims, buzzwords, or promotional filler.

## Composition

- Build each section around its actual content. Do not force every section into the same centered heading plus identical card grid.
- Use whitespace to separate narrative sections and make impact data easy to scan.
- Statistics must have a clear source and an honest label. Aggregated report totals must not be described as unique people unless the data model proves uniqueness.
- Use cards only when grouping or comparing content benefits from a contained surface. Do not make every element float.
- Preserve the existing brand colors and typography rather than importing another product's visual identity.

## Motion

- Motion should explain hierarchy, provide feedback, or support navigation. It must not delay access to content.
- Respect `prefers-reduced-motion`.
- Avoid stacking multiple attention effects on the same element.

## Copy

- Use concrete labels for real actions and real program outcomes.
- Remove decorative leading dots, separators, and arrows when they do not convey meaning.
- Preserve bullets in actual lists where they improve scanning or semantics.
- Do not add unverified claims about real-time tracking, precision, reach, impact, legal status, or transparency.
