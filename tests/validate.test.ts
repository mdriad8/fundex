import { describe, expect, it } from 'vitest';
import { clean, validateContact } from '../api/_lib/validate';

const valid = {
  name: 'Alex Citizen',
  email: 'Alex@Example.com ',
  organisation: 'Example Pty Ltd',
  enquiryType: 'advisory',
  message: 'We are planning our next stage of growth and would like to talk.',
};

describe('validateContact', () => {
  it('accepts a valid submission and normalises fields', () => {
    const r = validateContact(valid);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.email).toBe('alex@example.com');
    }
  });

  it.each([
    ['name', { name: 'A' }],
    ['name', { name: 'Visit https://spam.example' }],
    ['email', { email: 'not-an-email' }],
    ['email', { email: 'a@b' }],
    ['email', { email: 'x'.repeat(250) + '@example.com' }],
    ['enquiryType', { enquiryType: 'investment' }],
    ['message', { message: 'too short' }],
    ['message', { message: 'x'.repeat(4001) }],
    ['organisation', { organisation: 'x'.repeat(121) }],
  ])('rejects invalid %s', (field, override) => {
    const r = validateContact({ ...valid, ...override });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors).toHaveProperty(field);
  });

  it('rejects non-string values without throwing', () => {
    const r = validateContact({ name: 42, email: {}, message: [], enquiryType: null });
    expect(r.ok).toBe(false);
  });
});

describe('clean', () => {
  it('strips control characters and collapses newlines in single-line fields', () => {
    expect(clean('Bob\r\nBcc: x@y.z\u0007')).toBe('Bob Bcc: x@y.z');
  });
  it('keeps newlines in multi-line fields', () => {
    expect(clean('a\r\nb', { singleLine: false })).toBe('a\nb');
  });
});
