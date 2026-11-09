---
id: 5
title: "Digest route tests"
state: open
labels: [plan:morning-digest]
created: 2026-11-09T13:30:00+01:00
closed: null
---

Source: plan.md § 2d

## Scope
Route tests for 2a and 2b: 200, 404 for missing night, empty night, night with a bad line. Use a temp runs dir; `runs/` is read-only.

## Done when
`pnpm test` is green with the new tests.

## Blocked by
#1 (`src/digest/types.ts`)
