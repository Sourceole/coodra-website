# Coodra Capture Runbook (Deterministic)

## Capture Profile
- Base capture size: `1920x1080`
- Website crops:
  - `16:9` stage
  - `4:3` card-safe crop
  - Tight card crop for compact sections
- Motion clips: `6-12s`, silent UI movement
- Delivery formats:
  - Still: `.webp` primary, `.png` fallback
  - Motion: `.mp4` (H.264) primary, `.webm` fallback
  - Poster frame per motion clip

## Redaction Rules (Strict, required before export)
- Remove or mask all real customer names
- Remove vendor IDs, order IDs, invoice numbers
- Remove personal emails, addresses, phone numbers
- Replace with neutral placeholders if blur is not possible
- No real merchant-specific PII in final assets

## Primary Prompt Script (Operator Copy)
Run these in order to keep captured sequences deterministic:
1. `What changed in my store in the last 7 days that needs attention first?`
2. `Show me products with rising demand and low stock cover.`
3. `Where is margin leaking right now and why?`
4. `What action should I take today to avoid a weekend stockout?`
5. `Draft the best reorder move and explain your reasoning.`

## Scene IDs
- `S1_SHIFT`: Change detected, demand/stock shift visible
- `S2_RISK`: Consequence explained (stockout, margin leak, cash risk)
- `S3_ACTION`: Prioritized recommendation + rationale + approval-ready next step

## Expected On-Screen Story
- S1: You can clearly see that something changed.
- S2: You can clearly see why it matters.
- S3: You can clearly see what to do next.

## Export Naming Convention
- Pattern: `page-section-scene-variant-v1`
- Examples:
  - `landing-how-shift-01-v1`
  - `landing-how-risk-01-v1`
  - `landing-how-action-01-v1`
  - `integrations-signal-flow-01-v1`

## Required Asset Set
### Landing
- `landing-hero-main-loop-v1.{mp4,webm}` + poster
- `landing-how-shift-01-v1.{mp4,webm}` + poster
- `landing-how-risk-01-v1.{mp4,webm}` + poster
- `landing-how-action-01-v1.{mp4,webm}` + poster
- `landing-proof-decision-context-01-v1.{mp4,webm}` + poster
- `landing-proof-approval-flow-01-v1.{mp4,webm}` + poster

### About
- `about-product-story-01-v1.{mp4,webm}` + poster

### Integrations
- `integrations-connected-state-01-v1.{mp4,webm}` + poster
- `integrations-signal-flow-01-v1.{mp4,webm}` + poster
- `integrations-action-surfaced-01-v1.{mp4,webm}` + poster

### Comparisons
- `comparisons-context-01-v1.{mp4,webm}` + poster
- `comparisons-approval-flow-01-v1.{mp4,webm}` + poster

## QA Checklist
- [ ] Redaction pass completed
- [ ] No dark-mode inserts (marketing pages stay light)
- [ ] Poster loads before video
- [ ] Reduced-motion fallback works (still-only)
- [ ] Mobile crop is legible and unclipped
- [ ] No CLS from media (reserved dimensions)
