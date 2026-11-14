import { site } from '../data/site';

export type Crumb = { name: string; path: string };

/** Absolute canonical URL. Home keeps its slash; other paths have none (trailingSlash: 'never'). */
export const absolute = (path: string) => {
  const u = new URL(path, site.url);
  return u.pathname === '/' ? `${site.url}/` : u.toString().replace(/\/$/, '');
};

const orgId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;

export function organizationLd() {
  return {
    '@type': 'Organization',
    '@id': orgId,
    name: site.name,
    legalName: site.legalName,
    alternateName: site.wordmark,
    url: site.url,
    logo: `${site.url}/brand/fundex-mark.png`,
    description: site.positioning.description,
    foundingDate: String(site.foundingYear),
    ...(site.contact.emailVerified ? { email: site.contact.email } : {}),
    ...(site.contact.phone.show ? { telephone: site.contact.phone.display } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.office.city,
      addressRegion: site.office.region,
      addressCountry: site.office.countryCode,
      ...(site.office.showStreetAddress
        ? { streetAddress: site.office.streetAddress, postalCode: site.office.postcode }
        : {}),
    },
    areaServed: 'AU',
    sameAs: [site.social.linkedin],
    ...(site.abn ? { taxID: site.abn } : {}),
  };
}

export function websiteLd() {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: site.url,
    name: site.name,
    inLanguage: 'en-AU',
    publisher: { '@id': orgId },
  };
}

export function webPageLd(opts: { path: string; title: string; description: string; type?: string }) {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${absolute(opts.path)}#webpage`,
    url: absolute(opts.path),
    name: opts.title,
    description: opts.description,
    inLanguage: 'en-AU',
    isPartOf: { '@id': websiteId },
    about: { '@id': orgId },
  };
}

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  };
}

/** Serialise JSON-LD safely for embedding in a <script> tag. */
export function jsonLd(graph: object[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}
