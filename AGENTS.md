# Project working rules

## Required workflow: Anti-Slop DURING

Apply Anti-Slop principles while auditing, designing, writing copy, and implementing changes. Do not treat this as a final-only review.

Reference:
- Core rules: https://github.com/miqdadbadjuber/anti-slop/blob/main/antislop.md
- Skills: https://github.com/miqdadbadjuber/anti-slop/tree/main/skills

Before UI or copy changes:
1. Read `DESIGN.md` and state a short Design Read in the PR description.
2. Identify the actual user task and content hierarchy before choosing a layout.
3. Give every major visual or copy decision a concrete reason.
4. Prefer existing, verified content and behavior. Never invent statistics, testimonials, capabilities, locations, or institutional claims.
5. Keep meaningful list markers and semantic structure. Remove decorative bullets only when they add no meaning.
6. Avoid template layouts, generic marketing language, decorative badges, excessive gradients/glows/shadows, and motion without a UX purpose.
7. Preserve keyboard access, visible focus, reduced-motion support, responsive behavior, and useful loading/empty/error states.

## Change discipline

- Inspect the existing implementation and related data/API paths before editing.
- Keep security, data-integrity, and visual changes in separate, reviewable pull requests.
- Validate request bodies on the server and check authorization in every protected route handler.
- Never expose service-role credentials to client code.
- Do not silently replace failed database reads/writes with demo or in-memory data.
- Do not claim a build, lint, browser check, or database integration passed unless it was actually run.
- For unverified behavior, document the exact limitation and required follow-up.

## Delivery Gate

Before marking a UI/copy change complete, report evidence for:
- factual claims and statistics have a traceable source;
- no broken links or inert controls were introduced;
- mobile layout and keyboard/focus behavior were checked;
- reduced-motion behavior is respected;
- contrast and empty/loading/error states were checked;
- build/lint and interactive click-through were run, or explicitly marked NOT RUN with the reason.

A gate item without evidence is NOT VERIFIED, not PASS.
