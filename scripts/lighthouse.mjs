// Runs Lighthouse (mobile + desktop presets) for each page and saves JSON reports.
// Usage: node scripts/lighthouse.mjs <baseUrl> <outDir> [paths]
// Example: node scripts/lighthouse.mjs http://127.0.0.1:4400 docs/qa/lighthouse/after
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const base = (process.argv[2] ?? 'http://127.0.0.1:4400').replace(/\/$/, '');
const out = process.argv[3] ?? 'docs/qa/lighthouse/after';
const paths = (process.argv[4] ?? 'home,about,services,insights,contact').split(',');
mkdirSync(out, { recursive: true });

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
for (const p of paths) {
  const url = `${base}${p === 'home' ? '/' : `/${p}`}`;
  for (const preset of ['mobile', 'desktop']) {
    const args = ['--yes', 'lighthouse@13.6.0', url, '--quiet', '--chrome-flags=--headless=new', '--output=json', `--output-path=${out}/${p}-${preset}.json`];
    if (preset === 'desktop') args.push('--preset=desktop');
    execFileSync(npx, args, { stdio: 'inherit', shell: process.platform === 'win32' });
    console.log('done', p, preset);
  }
}
