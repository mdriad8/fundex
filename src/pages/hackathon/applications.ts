/**
 * Beyond the Prompt 2027: application forms (Campus Ambassador, Club, Community, University, Speaker).
 * One schema drives both the website forms and the checks in the Google Apps Script receiver
 * (apps-script/partner_applications.gs). tests/applications.test.ts keeps the two in step.
 */

/** Paste the Apps Script web-app URL here once it is deployed (ends in /exec). Empty = forms show an email fallback. */
export const APPLY_ENDPOINT = '';

export const CONTACT_EMAIL = 'nahid@fundexglobal.vc';

export type FieldType = 'text' | 'email' | 'url' | 'textarea' | 'select' | 'multi' | 'checkbox';

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  max?: number;
  min?: number;
  help?: string;
  placeholder?: string;
  options?: string[];
  /** Grid width on larger screens. */
  half?: boolean;
};

export type FormKind = 'ambassador' | 'club' | 'community' | 'university' | 'speaker';

export type FormDef = {
  kind: FormKind;
  title: string;
  short: string;
  intro: string;
  fields: Field[];
};

const channels = ['LinkedIn', 'Instagram', 'Facebook', 'X / Twitter', 'WhatsApp or Telegram groups', 'Discord', 'University or club newsletter', 'In-person (classes, club meetings)', 'Other'];

/** Asked on every form. */
export const commonStart: Field[] = [
  { name: 'fullName', label: 'Full name', type: 'text', required: true, min: 2, max: 100, half: true },
  { name: 'email', label: 'Email', type: 'email', required: true, max: 254, half: true, help: 'Use your university or organisation email if you have one.' },
  { name: 'country', label: 'Country', type: 'text', required: true, max: 60, half: true },
  { name: 'city', label: 'City', type: 'text', required: true, max: 60, half: true },
  { name: 'timeZone', label: 'Time zone', type: 'text', max: 60, half: true, placeholder: 'e.g. GMT+6, AEDT' },
  { name: 'profileUrl', label: 'LinkedIn or public profile', type: 'url', max: 300, half: true, placeholder: 'https://' },
];

/** Consent block at the end of every form. */
export const commonEnd: Field[] = [
  { name: 'adult', label: 'I am 18 or older.', type: 'checkbox', required: true },
  { name: 'agreeConduct', label: 'I agree to follow the event rules and code of conduct.', type: 'checkbox', required: true },
  { name: 'agreePrivacy', label: 'I have read the collection notice below.', type: 'checkbox', required: true },
  { name: 'publicListing', label: 'Optional: you may list my name (or organisation) publicly if approved.', type: 'checkbox' },
  { name: 'logoUse', label: 'Optional: you may use my photo or our logo in event announcements, after I approve the wording.', type: 'checkbox' },
  { name: 'newsOptIn', label: 'Optional: send me news about future Fund’ex events.', type: 'checkbox' },
];

export const forms: Record<FormKind, FormDef> = {
  ambassador: {
    kind: 'ambassador',
    title: 'Campus Ambassador',
    short: 'Bring your campus into a global community of AI builders.',
    intro: 'For students, researchers, staff and club leaders at any university or college, anywhere in the world.',
    fields: [
      { name: 'institution', label: 'University or college', type: 'text', required: true, max: 120, half: true },
      { name: 'campus', label: 'Campus', type: 'text', max: 80, half: true },
      { name: 'role', label: 'Your role', type: 'select', required: true, half: true, options: ['Undergraduate student', 'Postgraduate student', 'PhD / research student', 'Researcher', 'Academic or staff', 'Club committee member', 'Other'] },
      { name: 'study', label: 'Field of study or department', type: 'text', max: 120, half: true },
      { name: 'affiliationUrl', label: 'A link that shows your affiliation', type: 'url', max: 300, help: 'Your club page, staff page, student society profile or similar. Helps us verify you quickly.', placeholder: 'https://' },
      { name: 'communities', label: 'Which communities can you genuinely reach?', type: 'textarea', required: true, min: 20, max: 800, help: 'Clubs, classes, societies, online groups. Approximate sizes help.' },
      { name: 'channels', label: 'Where would you share the event?', type: 'multi', required: true, options: channels },
      { name: 'languages', label: 'Languages you can share in', type: 'text', max: 120, half: true },
      { name: 'hours', label: 'Time you can give', type: 'select', required: true, half: true, options: ['About 1 hour a week', 'About 2 hours a week', 'More than 2 hours a week', 'Not sure yet'] },
      { name: 'experience', label: 'Any outreach or community experience?', type: 'textarea', max: 800 },
      { name: 'motivation', label: 'Why do you want to be a Campus Ambassador?', type: 'textarea', required: true, min: 20, max: 800 },
      { name: 'noAuthority', label: 'I understand that being a Campus Ambassador does not make me a representative of my university, and I won’t claim to speak for it.', type: 'checkbox', required: true },
    ],
  },
  club: {
    kind: 'club',
    title: 'Club Partner',
    short: 'For student clubs and societies at any university, anywhere.',
    intro: 'Official Club Partners share Beyond the Prompt with their members and are listed on our partner register once approved.',
    fields: [
      { name: 'clubName', label: 'Official club name', type: 'text', required: true, max: 120, half: true },
      { name: 'institution', label: 'University or college', type: 'text', required: true, max: 120, half: true },
      { name: 'clubUrl', label: 'Club website or social page', type: 'url', required: true, max: 300, half: true, placeholder: 'https://' },
      { name: 'clubEmail', label: 'Club email', type: 'email', max: 254, half: true },
      { name: 'role', label: 'Your role in the club', type: 'text', required: true, max: 80, half: true, placeholder: 'e.g. President, Events lead' },
      { name: 'members', label: 'Approximate members', type: 'text', max: 20, half: true },
      { name: 'contribution', label: 'What could your club do?', type: 'multi', required: true, options: ['Share a post with members', 'Newsletter or announcement', 'Run a team-forming session', 'Host an info session', 'Suggest mentors or speakers', 'Other'] },
      { name: 'channels', label: 'Your main channels', type: 'multi', options: channels },
      { name: 'notes', label: 'Anything else?', type: 'textarea', max: 800 },
      { name: 'authorised', label: 'I am authorised to apply on behalf of this club.', type: 'checkbox', required: true },
    ],
  },
  community: {
    kind: 'community',
    title: 'Community Partner',
    short: 'For developer groups, AI communities, meetups and nonprofits.',
    intro: 'Community Partners bring their members into Beyond the Prompt and are recognised on our partner register.',
    fields: [
      { name: 'communityName', label: 'Community name', type: 'text', required: true, max: 120, half: true },
      { name: 'communityType', label: 'Type', type: 'select', required: true, half: true, options: ['Developer group (GDG, meetup)', 'AI or data community', 'Online community (Discord, Slack)', 'Nonprofit or NGO', 'Professional association', 'Other'] },
      { name: 'communityUrl', label: 'Website or main page', type: 'url', required: true, max: 300, half: true, placeholder: 'https://' },
      { name: 'role', label: 'Your role', type: 'text', required: true, max: 80, half: true },
      { name: 'audience', label: 'Countries and audience you serve', type: 'text', required: true, max: 200 },
      { name: 'reach', label: 'Channels and approximate reach', type: 'textarea', required: true, min: 10, max: 800 },
      { name: 'collaboration', label: 'How would you like to collaborate?', type: 'textarea', required: true, min: 20, max: 800 },
      { name: 'fees', label: 'Does working with you involve any fees?', type: 'select', required: true, half: true, options: ['No', 'Yes', 'Not sure'] },
    ],
  },
  university: {
    kind: 'university',
    title: 'University Partner',
    short: 'For universities, faculties, centres and startup hubs.',
    intro: 'University Partners give one real contribution, such as a venue, official promotion, a University Representative, speakers or mentors. Partnership is confirmed in writing by an authorised person.',
    fields: [
      { name: 'institution', label: 'University', type: 'text', required: true, max: 120, half: true },
      { name: 'department', label: 'Faculty, centre or department', type: 'text', required: true, max: 120, half: true },
      { name: 'title', label: 'Your title', type: 'text', required: true, max: 100, half: true },
      { name: 'institutionalEmail', label: 'Institutional email', type: 'email', required: true, max: 254, half: true },
      { name: 'support', label: 'Support you could offer', type: 'multi', required: true, options: ['Venue for the in-person day (Melbourne, Sun 24 Jan)', 'Official promotion (website, newsletter, channels)', 'A University Representative to open or join the panel', 'Speakers', 'Mentors or judges', 'AV or streaming support', 'Other'] },
      { name: 'venueDetails', label: 'If offering a venue: address, capacity, Sunday hours, AV, Wi-Fi, accessibility, cost or waiver', type: 'textarea', max: 1500 },
      { name: 'approver', label: 'Who approves this partnership, and by when?', type: 'text', max: 200 },
      { name: 'notes', label: 'Anything else?', type: 'textarea', max: 800 },
      { name: 'authorised', label: 'I am authorised to discuss a partnership on behalf of this institution, or I will involve the person who is.', type: 'checkbox', required: true },
    ],
  },
  speaker: {
    kind: 'speaker',
    title: 'Speaker',
    short: 'Talk at the online day (Sat 23 Jan) or in person in Melbourne (Sun 24 Jan).',
    intro: 'Practical talks, workshops and panel spots on AI and automation. Streamed and recorded for every participant.',
    fields: [
      { name: 'organisation', label: 'Organisation', type: 'text', required: true, max: 120, half: true },
      { name: 'jobTitle', label: 'Your title', type: 'text', required: true, max: 100, half: true },
      { name: 'format', label: 'Where would you speak?', type: 'select', required: true, half: true, options: ['Online (Sat 23 Jan)', 'In person in Melbourne (Sun 24 Jan)', 'Either'] },
      { name: 'sessionType', label: 'Session type', type: 'select', required: true, half: true, options: ['Talk (20–30 min)', 'Workshop (40 min)', 'Panel', 'Open to suggestions'] },
      { name: 'sessionTitle', label: 'Session title', type: 'text', required: true, max: 100 },
      { name: 'abstract', label: 'Abstract (100–150 words)', type: 'textarea', required: true, min: 100, max: 1500 },
      { name: 'outcomes', label: 'Three things attendees can do afterwards', type: 'textarea', required: true, min: 20, max: 800 },
      { name: 'audience', label: 'Who is it for?', type: 'select', half: true, options: ['Beginners', 'Intermediate', 'Advanced', 'Everyone'] },
      { name: 'sampleUrl', label: 'A previous talk (optional)', type: 'url', max: 300, half: true, placeholder: 'https://' },
      { name: 'recordingOk', label: 'I agree to my session being recorded and published on Fund’ex channels.', type: 'checkbox', required: true },
    ],
  },
};

export const allFields = (def: FormDef): Field[] => [...commonStart, ...def.fields, ...commonEnd];

/** Client-side check mirroring the receiver. Returns field -> message. */
export function validate(def: FormDef, values: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of allFields(def)) {
    const v = values[f.name];
    if (f.type === 'checkbox') {
      if (f.required && v !== true) errors[f.name] = 'Please tick this box to continue.';
      continue;
    }
    if (f.type === 'multi') {
      const arr = Array.isArray(v) ? v : [];
      if (f.required && arr.length === 0) errors[f.name] = 'Please choose at least one.';
      continue;
    }
    const s = typeof v === 'string' ? v.trim() : '';
    if (!s) {
      if (f.required) errors[f.name] = 'This field is required.';
      continue;
    }
    if (f.max && s.length > f.max) errors[f.name] = `Please keep this under ${f.max} characters.`;
    else if (f.min && s.length < f.min) errors[f.name] = `Please write at least ${f.min} characters.`;
    else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) errors[f.name] = 'Please enter a valid email address.';
    else if (f.type === 'url' && !/^https?:\/\/\S+\.\S+/i.test(s)) errors[f.name] = 'Please enter a full link starting with https://';
    else if (f.type === 'select' && f.options && !f.options.includes(s)) errors[f.name] = 'Please choose an option.';
  }
  return errors;
}
