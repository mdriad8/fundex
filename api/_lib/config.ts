/** Contact form configuration shared by the API (files under api/_lib are not deployed as functions). */
export const site = {
  contact: {
    email: 'info@fundexglobal.vc',
    emailVerified: true,
    responseTime: 'We typically respond within 24–48 hours.',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/111150296/',
  },
} as const;

/** Must match the <option> values in src/pages/Contact.tsx. */
export const enquiryTypes = [
  { value: 'advisory', label: 'Strategic Advisory' },
  { value: 'planning', label: 'Business Planning' },
  { value: 'partnership', label: 'Partnerships & Growth' },
  { value: 'other', label: 'Other / Not sure yet' },
] as const;

export type EnquiryType = (typeof enquiryTypes)[number]['value'];
