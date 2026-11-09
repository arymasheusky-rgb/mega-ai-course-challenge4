---
id: 2
title: "Digest page"
state: closed
labels: [plan:morning-digest]
created: 2026-11-09T13:30:00+01:00
closed: 2026-11-09T13:35:00+01:00
---

Source: plan.md § 2a

## Scope
`GET /digest/:night` renders rows with the usual layout: one table, sorted by job; retries ≥ 3 and any `fail` marked. Missing file → 404; empty file → "nothing ran".

## Done when
`/digest/2026-10-28` renders locally.

## Blocked by
#1 (`src/digest/types.ts`)

## Closing comment

done: GET /digest/:night renders table
worker: cursor · composer · medium
commit: 7ca3516
