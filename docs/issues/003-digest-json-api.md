---
id: 3
title: "Digest JSON API"
state: closed
labels: [plan:morning-digest]
created: 2026-11-09T13:30:00+01:00
closed: 2026-11-09T13:35:00+01:00
---

Source: plan.md § 2b

## Scope
`GET /api/digest/:night` returns the same rows as JSON. Page and JSON must never disagree.

## Done when
JSON for 2026-10-28 has the same jobs, in the same order, as the page.

## Blocked by
#1 (`src/digest/types.ts`)

## Closing comment

done: GET /api/digest/:night returns same rows
worker: cursor · composer · medium
commit: 7ca3516
