import { enquiryTypes, type EnquiryType } from './config.js';

export type ContactInput = {
  name: string;
  email: string;
  organisation: string;
  enquiryType: EnquiryType;
  message: string;
};

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  organisation: { max: 120 },
  message: { min: 20, max: 4000 },
} as const;

// Pragmatic email check: one @, a dot in the domain, no spaces or control characters.
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Trim, normalise newlines, strip control characters. */
export function clean(value: unknown, { singleLine = true } = {}): string {
  if (typeof value !== 'string') return '';
  let v = value.replace(/\r\n?/g, '\n').replace(CONTROL_RE, '');
  if (singleLine) v = v.replace(/\n+/g, ' ');
  return v.trim();
}

export function validateContact(raw: Record<string, unknown>):
  | { ok: true; data: ContactInput }
  | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};

  const name = clean(raw.name);
  const email = clean(raw.email).toLowerCase();
  const organisation = clean(raw.organisation ?? raw.company);
  const enquiryRaw = clean(raw.enquiryType ?? raw.inquiry);
  const message = clean(raw.message, { singleLine: false });

  if (name.length < LIMITS.name.min) errors.name = 'Please enter your name.';
  else if (name.length > LIMITS.name.max) errors.name = `Please keep your name under ${LIMITS.name.max} characters.`;
  else if (/https?:\/\/|www\./i.test(name)) errors.name = 'Please enter your name without links.';

  if (!email) errors.email = 'Please enter your email address.';
  else if (email.length > LIMITS.email.max || !EMAIL_RE.test(email))
    errors.email = 'Please enter a valid email address, like name@example.com.';

  if (organisation.length > LIMITS.organisation.max)
    errors.organisation = `Please keep this under ${LIMITS.organisation.max} characters.`;

  const enquiryType = enquiryTypes.find((t) => t.value === enquiryRaw)?.value;
  if (!enquiryType) errors.enquiryType = 'Please choose what your enquiry is about.';

  if (message.length < LIMITS.message.min)
    errors.message = `Please tell us a little more (at least ${LIMITS.message.min} characters).`;
  else if (message.length > LIMITS.message.max)
    errors.message = `Please keep your message under ${LIMITS.message.max} characters.`;

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: { name, email, organisation, enquiryType: enquiryType as EnquiryType, message },
  };
}
