import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

function appWithRuns(dir: string) {
  return createApp({
    adapter: 'shim',
    installed: '2026-10-29T14:06:00+01:00',
    beatEverySeconds: 60,
    runsDir: dir,
  });
}

describe('digest routes', () => {
  it('returns 200 HTML and JSON for a night with a bad line', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'rig-digest-'));
    writeFileSync(
      join(dir, '2026-10-28.jsonl'),
      [
        '{"at":"2026-10-28T23:00:02+01:00","job":"rig/rotate-logs","status":"ok","owner":"lane-07"}',
        'not-json',
        '{"at":"2026-10-28T23:00:06+01:00","job":"lane/sync","status":"ok","owner":"rook"}',
        '',
      ].join('\n'),
    );
    process.env.LANE_MARKER = 'TEST-MARKER';
    const app = appWithRuns(dir);

    const htmlRes = await app.request('/digest/2026-10-28');
    const html = await htmlRes.text();
    expect(htmlRes.status).toBe(200);
    expect(html).toContain('TEST-MARKER');
    expect(html).toContain('lane/sync');
    expect(html).toContain('rig/rotate-logs');

    const jsonRes = await app.request('/api/digest/2026-10-28');
    const rows = (await jsonRes.json()) as { job: string }[];
    expect(jsonRes.status).toBe(200);
    expect(rows.map((r) => r.job)).toEqual(['lane/sync', 'rig/rotate-logs']);
  });

  it('returns 404 when the night file is missing', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'rig-digest-'));
    const res = await appWithRuns(dir).request('/digest/1999-01-01');
    expect(res.status).toBe(404);
    const api = await appWithRuns(dir).request('/api/digest/1999-01-01');
    expect(api.status).toBe(404);
  });

  it('renders nothing ran for an empty night file', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'rig-digest-'));
    writeFileSync(join(dir, '2026-10-28.jsonl'), '');
    const res = await appWithRuns(dir).request('/digest/2026-10-28');
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('nothing ran');
    const api = await appWithRuns(dir).request('/api/digest/2026-10-28');
    expect(await api.json()).toEqual([]);
  });
});
