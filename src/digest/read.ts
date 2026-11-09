import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DigestRow, JobStatus, NightDigest, ReadNight } from './types.js';

type LogLine = {
  at: string;
  job: string;
  status: JobStatus;
  owner: string | null;
  error?: string;
};

function isStatus(value: unknown): value is JobStatus {
  return value === 'ok' || value === 'retry' || value === 'fail';
}

function parseLine(line: string): LogLine | null {
  try {
    const raw = JSON.parse(line) as Record<string, unknown>;
    if (typeof raw.at !== 'string' || typeof raw.job !== 'string' || !isStatus(raw.status)) {
      return null;
    }
    const owner = raw.owner === null || typeof raw.owner === 'string' ? (raw.owner as string | null) : null;
    const error = typeof raw.error === 'string' ? raw.error : undefined;
    return { at: raw.at, job: raw.job, status: raw.status, owner, error };
  } catch {
    return null;
  }
}

export const readNight: ReadNight = (runsDir, night) => {
  const path = join(runsDir, `${night}.jsonl`);
  if (!existsSync(path)) return null;

  const text = readFileSync(path, 'utf8');
  if (text.length === 0) {
    return { night, rows: [], badLines: 0 };
  }

  const lines = text.split(/\n/);
  // trailing newline yields an empty last segment — ignore empty segments
  let badLines = 0;
  const byJob = new Map<string, DigestRow>();

  for (const line of lines) {
    if (line === '') continue;
    const parsed = parseLine(line);
    if (!parsed) {
      badLines += 1;
      continue;
    }

    const existing = byJob.get(parsed.job);
    if (!existing) {
      byJob.set(parsed.job, {
        job: parsed.job,
        owner: parsed.owner,
        runs: 1,
        retries: parsed.status === 'retry' ? 1 : 0,
        lastStatus: parsed.status,
        lastError: parsed.error ?? null,
        firstAt: parsed.at,
        lastAt: parsed.at,
      });
      continue;
    }

    existing.runs += 1;
    if (parsed.status === 'retry') existing.retries += 1;
    existing.owner = parsed.owner;
    existing.lastStatus = parsed.status;
    existing.lastError = parsed.error ?? null;
    existing.lastAt = parsed.at;
  }

  const rows = [...byJob.values()].sort((a, b) => a.job.localeCompare(b.job));
  return { night, rows, badLines };
};

export function nightCounts(digest: NightDigest): { ok: number; retry: number; fail: number } {
  let ok = 0;
  let retry = 0;
  let fail = 0;
  for (const row of digest.rows) {
    if (row.lastStatus === 'ok') ok += 1;
    else if (row.lastStatus === 'retry') retry += 1;
    else fail += 1;
  }
  return { ok, retry, fail };
}
