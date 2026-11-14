// Summarises Lighthouse JSON reports in a directory into a Markdown table.
// Usage: node scripts/lighthouse-summary.mjs docs/qa/lighthouse/after
import { readdirSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import path from 'node:path';

const dir = process.argv[2];
const rows = [];
for (const f of readdirSync(dir).filter((f) => /\.json(\.gz)?$/.test(f)).sort()) {
  const buf = readFileSync(path.join(dir, f));
  const r = JSON.parse((f.endsWith('.gz') ? gunzipSync(buf) : buf).toString('utf8'));
  if (!r.categories) continue;
  const s = (k) => Math.round((r.categories[k]?.score ?? 0) * 100);
  const a = (k) => r.audits[k]?.displayValue ?? 'n/a';
  rows.push(
    `| ${f.replace(/\.json(\.gz)?$/, '')} | ${s('performance')} | ${s('accessibility')} | ${s('best-practices')} | ${s('seo')} | ${a('first-contentful-paint')} | ${a('largest-contentful-paint')} | ${a('total-blocking-time')} | ${a('cumulative-layout-shift')} | ${a('speed-index')} |`,
  );
}
console.log('| Report | Perf | A11y | Best pr. | SEO | FCP | LCP | TBT | CLS | Speed Index |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
for (const r of rows) console.log(r);
