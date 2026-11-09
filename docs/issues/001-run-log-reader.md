---
id: 1
title: "Run log reader"
state: open
labels: [plan:morning-digest]
created: 2026-11-09T13:30:00+01:00
closed: null
---

Source: plan.md § 1

## Scope
Read `runs/<night>.jsonl` into one row per job: job, owner, runs, retries, last status, last error, first and last time. Lives in `src/digest/`. Commit `src/digest/types.ts` first (`DigestRow`, `readNight(runsDir, night)`).

Bad JSON lines are counted, not thrown. `owner` may be null → show as `—`.

## Done when
Reader tests pass on `runs/2026-10-28.jsonl` (5 jobs, 1 bad line).

## Blocked by
—
