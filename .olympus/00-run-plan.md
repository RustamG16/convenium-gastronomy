# 00 — Run plan: single-site mobile pass (2026-10-27)

Trail: abridged retrofit (`templates/prompts/mobile-pass-single-site.md`). Direction, palette and type ramp fixed;
gate_a/gate_b approved-in-plan. Owner override: no Gate 1 / Gate C — work on `mobile-pass`, fast-forward `main`
and push once build and measurements pass.

| Phase | Agent | Skill | Output |
|---|---|---|---|
| measure | fleet-measurer (run inline by the main session) | mobile-app-shell | 01-audit.md |
| build | design-engineer (inline) | mobile-app-shell | src/, styles.css, script.js, build.mjs |
| review | independent-critic — **skipped**, self-review against the budgets instead | visual-qa | 07-qa.md |

Skipped tooling: `apollo.py attach` and `verify.py --plan` (no Python on this machine).
