/**
 * Single source of truth for company facts and contact details.
 *
 * RULE: only verified facts are rendered. Anything awaiting owner confirmation
 * has a `show*` flag that defaults to false. See docs/strategy/claims-register.md.
 */
export const site = {
  name: 'Fundex Global',
  wordmark: "Fund'ex",
  legalName: 'Fundex Global Pty Ltd',
  url: 'https://www.fundexglobal.vc',
  foundingYear: 2026, // Verified: ABN Lookup, ABN active from 6 Feb 2026 (claims register B3)
  /** Verified on ABN Lookup (abr.business.gov.au), 14 Nov 2026. */
  abn: '49 694 783 205' as string | null,
  acn: '694 783 205',
  locale: 'en_AU',

  positioning: {
    // Recommendation in docs/strategy/positioning.md; swap here if the owner chooses another line.
    headline: 'Where strategy meets execution.',
    // Supporting line refined in ChatGPT review round 1.
    subheadline:
      'We help founders and growing businesses turn complex challenges into clear plans, practical solutions and measurable progress.',
    description:
      'Melbourne-based strategy and execution partner for founders and growing businesses: strategy, growth execution, business planning and commercial partnerships.',
  },

  contact: {
    // Domain has Google Workspace MX (checked 14 Nov 2026), but that does not prove the mailbox exists or is
    // monitored. Hidden until the owner tests it and sets emailVerified: true (claims register A29).
    email: 'info@fundexglobal.vc',
    emailVerified: false,
    // Unverified (claims register A28): hidden until the owner confirms.
    phone: { display: '+61 426 655 519', href: 'tel:+61426655519', show: false },
    // Owner to confirm (claims register A31 / B7).
    responseTime: 'We aim to reply within two business days.',
  },

  office: {
    city: 'Melbourne',
    region: 'VIC',
    country: 'Australia',
    countryCode: 'AU',
    // Unverified (claims register A27): hidden until the owner confirms.
    streetAddress: 'Level 9, Suite 1 & 2, 2 Queen Street',
    postcode: '3000',
    showStreetAddress: false,
  },

  social: {
    linkedin: 'https://www.linkedin.com/company/111150296/',
  },

  founder: {
    name: 'Nahid Tanjum',
    role: 'Founder',
    /** Owner to supply an approved bio. Not rendered while null. */
    bio: null as string | null,
    /** Owner to supply an approved photo (path under /public). Monogram shown while null. */
    photo: null as string | null,
  },

  /**
   * Scope statement. Pending owner/legal confirmation of licensing status (claims register B8).
   * If Fundex holds an AFSL or is an authorised representative, replace this text.
   */
  scopeStatement:
    'Fundex Global is not a fund, does not hold an Australian Financial Services Licence, and does not provide financial product advice, make investment recommendations, arrange or deal in investments, or handle client money.',
} as const;

export const nav = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
] as const;

export type Service = {
  id: string;
  title: string;
  summary: string;
  forWho: string;
  activities: string[];
  outcomes: string[];
  note?: string;
};

/** Proposed service scope. Owner to confirm (claims register B6). */
export const services: Service[] = [
  {
    id: 'strategy',
    title: 'Strategy & venture design',
    summary: 'Get clear on the opportunity, the model and the few priorities that matter.',
    forWho: 'Founders shaping a new venture, and businesses at a turning point.',
    activities: [
      'Clarify the customer, the problem and the opportunity',
      'Test the business model and the assumptions behind it',
      'Map options and choose where to focus',
      'Turn the strategy into a prioritised, time-bound plan',
    ],
    outcomes: ['A written strategy on a page', 'A prioritised plan with owners and milestones'],
  },
  {
    id: 'execution',
    title: 'Execution & growth support',
    summary: 'Hands-on help to put the plan into motion and keep it moving.',
    forWho: 'Teams that know what they want to do and need capacity and rhythm to get it done.',
    activities: [
      'Go-to-market planning and launch support',
      'Operating rhythm: goals, metrics and regular reviews',
      'Process and systems set-up for the next stage of growth',
      'Leading priority initiatives alongside your team',
    ],
    outcomes: ['Initiatives delivered, not just planned', 'A simple dashboard of the measures that matter'],
  },
  {
    id: 'business-planning',
    title: 'Business planning & pitch preparation',
    summary: 'Get your plan, your presentation and your operating information clear, consistent and ready to share.',
    forWho: 'Founders and business owners preparing to present their business to partners, lenders, boards or investors.',
    activities: [
      'Structure and write the business plan',
      'Check the plan and operating numbers for clarity and consistency',
      'Shape the presentation narrative and deck',
      'Organise supporting operational information and practise the questions',
    ],
    outcomes: ['A clear, consistent business plan', 'A presentation you can explain with confidence'],
    note:
      'This is preparation of business information only. We do not value businesses, give financial product advice, recommend or arrange investments, or raise capital on behalf of anyone.',
  },
  {
    id: 'partnerships',
    title: 'Commercial partnerships & business development',
    summary: 'Find, shape and start the commercial partnerships that move a business forward.',
    forWho: 'Businesses looking for distribution, supply, channel or delivery partners.',
    activities: [
      'Identify potential commercial partners and the case for working together',
      'Prepare partnership proposals and first conversations',
      'Commercial introductions where there is a clear fit and both sides agree',
      'Structure a first phase so both sides can test the relationship',
    ],
    outcomes: ['A shortlist of qualified commercial partners', 'Partnership proposals ready to discuss'],
    note: 'Introductions are for commercial partnerships only, never for investment.',
  },
];

export const engagementSteps = [
  {
    step: '01',
    title: 'Understand',
    text: 'We start with where you are and where you want to be: the ambition, the constraints and what has already been tried.',
  },
  {
    step: '02',
    title: 'Shape',
    text: 'We agree the few priorities that matter most and turn them into a plan with clear owners, milestones and measures.',
  },
  {
    step: '03',
    title: 'Execute',
    text: 'We work alongside your team to deliver the plan: doing the work, not just reviewing it.',
  },
  {
    step: '04',
    title: 'Review',
    text: 'We check progress against the measures we agreed, learn from what happened and adjust the plan.',
  },
] as const;

export const principles = [
  {
    title: 'Straight answers',
    text: 'We tell you what we think, including when an idea is not ready. Honest advice early saves time and money later.',
  },
  {
    title: 'Work, not just slides',
    text: 'A plan only matters when it is carried out. We stay involved through delivery, not just the strategy session.',
  },
  {
    title: 'Small by design',
    text: 'You work directly with the founder. There is no hand-off to a junior team and no layers between you and the work.',
  },
  {
    title: 'Clear scope',
    text: 'Before any work starts, we agree in writing what we will do, what we will not do and how we will measure progress.',
  },
] as const;

export const enquiryTypes = [
  { value: 'strategy', label: 'Strategy & venture design' },
  { value: 'execution', label: 'Execution & growth support' },
  { value: 'business-planning', label: 'Business planning & pitch preparation' },
  { value: 'partnerships', label: 'Commercial partnerships & business development' },
  { value: 'other', label: 'Something else' },
] as const;

export type EnquiryType = (typeof enquiryTypes)[number]['value'];
