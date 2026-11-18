import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { allFields, commonEnd, commonStart, forms, validate, type FormKind } from '../src/pages/hackathon/applications';

const gs = readFileSync(new URL('../apps-script/partner_applications.gs', import.meta.url), 'utf8');
const block = gs.slice(gs.indexOf('// BEGIN-FORMS'), gs.indexOf('// END-FORMS'));
const COMMON_REQUIRED: string[] = JSON.parse(block.match(/var COMMON_REQUIRED = (\[.*?\]);/s)![1]);
const FORMS: Record<string, { required: string[] }> = JSON.parse(block.match(/var FORMS = (\{.*\});/s)![1]);

const kinds = Object.keys(forms) as FormKind[];

describe('application forms and the Apps Script receiver stay in step', () => {
  it('has the same form kinds', () => {
    expect(Object.keys(FORMS).sort()).toEqual([...kinds].sort());
  });

  it('agrees on the common required fields', () => {
    const req = [...commonStart, ...commonEnd].filter((f) => f.required).map((f) => f.name);
    expect(COMMON_REQUIRED.sort()).toEqual(req.sort());
  });

  it.each(kinds)('agrees on the required fields for %s', (kind) => {
    const req = forms[kind].fields.filter((f) => f.required).map((f) => f.name);
    expect(FORMS[kind].required.sort()).toEqual(req.sort());
  });

  it.each(kinds)('has unique field names for %s', (kind) => {
    const names = allFields(forms[kind]).map((f) => f.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).not.toContain('website'); // reserved for the honeypot
  });
});

describe('validate', () => {
  const base = {
    fullName: 'Ada Lovelace',
    email: 'ada@example.edu',
    country: 'Bangladesh',
    city: 'Dhaka',
    adult: true,
    agreeConduct: true,
    agreePrivacy: true,
    institution: 'Example University',
    role: 'Undergraduate student',
    communities: 'Our AI club (300 members) and the CSE department student group.',
    channels: ['LinkedIn'],
    hours: 'About 1 hour a week',
    motivation: 'I want more students on my campus building real AI projects.',
    noAuthority: true,
  };

  it('accepts a complete ambassador application', () => {
    expect(validate(forms.ambassador, base)).toEqual({});
  });

  it('flags missing required fields, unticked consent and empty multi-selects', () => {
    const e = validate(forms.ambassador, { ...base, fullName: ' ', adult: false, channels: [] });
    expect(Object.keys(e).sort()).toEqual(['adult', 'channels', 'fullName']);
  });

  it('checks email, links, lengths and select options', () => {
    const e = validate(forms.ambassador, { ...base, email: 'nope', affiliationUrl: 'example.com', motivation: 'short', role: 'Wizard' });
    expect(Object.keys(e).sort()).toEqual(['affiliationUrl', 'email', 'motivation', 'role']);
  });
});
