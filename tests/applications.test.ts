import { describe, expect, it } from 'vitest';
import { GOOGLE_FORM, allFields, forms, makeReference, toGoogleFormData, validate, type FormKind } from '../src/pages/hackathon/applications';

const kinds = Object.keys(forms) as FormKind[];

describe('application forms', () => {
  it.each(kinds)('has unique field names for %s', (kind) => {
    const names = allFields(forms[kind]).map((f) => f.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).not.toContain('website'); // reserved for the honeypot
  });

  it('makes short, unambiguous references per form type', () => {
    expect(makeReference('ambassador', () => 0)).toBe('BTP-AMB-AAAAAA');
    expect(makeReference('speaker')).toMatch(/^BTP-SPK-[A-HJ-NP-Z2-9]{6}$/);
  });

  it('maps answers onto the Google Form questions', () => {
    const data = toGoogleFormData(
      forms.club,
      { fullName: ' Ada ', email: 'ada@example.edu', country: 'Kenya', city: 'Nairobi', contribution: ['Share a post with members', 'Host an info session'], adult: true },
      'BTP-CLB-TEST01',
    );
    const e = GOOGLE_FORM.entries;
    expect(data.get(e.reference)).toBe('BTP-CLB-TEST01');
    expect(data.get(e.type)).toBe('Club Partner');
    expect(data.get(e.name)).toBe('Ada');
    expect(data.get(e.place)).toBe('Kenya, Nairobi');
    const answers = data.get(e.answers)!;
    expect(answers).toContain('What could your club do?: Share a post with members; Host an info session');
    expect(answers).toContain('I am 18 or older.: Yes');
    expect(answers).toContain('I am authorised to apply on behalf of this club.: No');
    expect(answers).not.toContain('Club email'); // empty optional fields are left out
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
