import ogImageSrc from '@images/social.png';

export const SITE = {
  title: 'MA Infotech',
  legalName: 'MA Infotech',
  tagline: 'Computer Sales, Service & IT Solutions in Mumbai',
  description:
    'MA Infotech is a Mumbai-based computer sales and service company — custom PC building, laptop & desktop repair, networking, CCTV installation, and IT products from all leading brands.',
  description_short:
    'Mumbai computer sales & service: custom PC builds, repairs, networking, CCTV, and IT products.',
  url: 'https://www.mainfotech.com',
  author: 'MA Infotech',
};

/* ── Business & contact details ────────────────────────────────────────────
   TODO: Replace the placeholder phone, email, address, and social links below
   with MA Infotech's real details before going live. */
export const CONTACT = {
  email: 'info@mainfotech.com',
  phoneDisplay: '+91 70212 09087',
  phoneTel: '+917021209087',
  whatsappDisplay: '+91 70212 09087',
  // wa.me expects the number in international format, digits only.
  // Pre-filled message opens in the user's WhatsApp when they tap.
  whatsappUrl:
    'https://wa.me/917021209087?text=' +
    encodeURIComponent('Hi MA Infotech! 👋 I need some tech help —'),
  city: 'Mumbai',
  region: 'Maharashtra',
  postalCode: '400103',
  street: 'Shop No. 12, Mandapeshwar Kripa, Laxman Mhatre Rd',
  area: 'Borivali (West)',
  addressFull:
    'Shop No. 12, Mandapeshwar Kripa, Laxman Mhatre Rd, Mandapeshwar, Borivali West, Mumbai, Maharashtra 400103',
  // Real listing: "Ma Infotech", Borivali West (19.2424701, 72.8544343)
  mapDirectionsUrl: 'https://maps.app.goo.gl/vnsqwJdYDBRQzL29A',
  mapEmbedUrl:
    'https://www.google.com/maps?q=Ma+Infotech,+Laxman+Mhatre+Rd,+Mandapeshwar,+Borivali+West,+Mumbai+400103&z=16&output=embed',
  // Google reviews — shown as a rating badge. Update these numbers to match the
  // live listing, OR add a Google Places API key to fetch them automatically.
  // TODO: confirm actual rating + review count from the Google listing.
  googleReviews: {
    rating: '4.7',
    // TODO: set the real review count from the Google listing. A star rating
    // snippet is only emitted in structured data when this is a real number > 0.
    reviewCount: '',
    url: 'https://maps.app.goo.gl/vnsqwJdYDBRQzL29A',
  },
  // Homepage testimonials — real, verbatim reviews from the Google listing.
  // `image` is the filename (without extension) in src/images/reviews/.
  testimonials: [
    {
      name: 'Sumit Shetty',
      image: 'sumith_shetty',
      rating: 5,
      quote:
        'Good service and a great guy. Any computer related services and even products are available with him.',
    },
    {
      name: 'Pradum Dhuriya',
      image: 'PRADUM_DHURIYA',
      rating: 5,
      quote:
        'Good quality and good person Mr. Yash. Thanks for MA Infotech support.',
    },
    {
      name: 'Binita Shah',
      image: 'banita',
      rating: 5,
      quote: 'Best CCTV installation work.',
    },
  ],
  hours: [
    { day: 'Monday – Saturday', time: '9:00 AM – 10:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ],
  areasServed: [
    'Borivali',
    'Dahisar',
    'Kandivali',
    'Malad',
    'Goregaon',
    'Mira Road',
    'Andheri',
    'Bhayandar',
  ],
};

// Star-rating snippet: only emitted when a real review count is set, so the
// markup never violates Google's rating guidelines with a fabricated count.
const reviewCount = Number(CONTACT.googleReviews.reviewCount);
const aggregateRating =
  Number.isFinite(reviewCount) && reviewCount > 0
    ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: CONTACT.googleReviews.rating,
          reviewCount: String(reviewCount),
          bestRating: '5',
          worstRating: '1',
        },
      }
    : {};

export const SEO = {
  title: `${SITE.title} | ${SITE.tagline}`,
  description: SITE.description,
  structuredData: {
    '@context': 'https://schema.org',
    // ComputerStore is a specific LocalBusiness subtype — a stronger signal for
    // "computer shop near me" style local searches than a generic LocalBusiness.
    '@type': ['ComputerStore', 'LocalBusiness'],
    '@id': SITE.url,
    name: SITE.legalName,
    image: `${SITE.url}/social.png`,
    logo: `${SITE.url}/social.png`,
    url: SITE.url,
    telephone: CONTACT.phoneTel,
    email: CONTACT.email,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    description: SITE.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${CONTACT.street}, ${CONTACT.area}`,
      addressLocality: CONTACT.city,
      addressRegion: CONTACT.region,
      postalCode: CONTACT.postalCode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.2424701,
      longitude: 72.8544343,
    },
    hasMap: CONTACT.mapDirectionsUrl,
    // Google Business Profile / listing — links the site to its map entity.
    sameAs: [CONTACT.googleReviews.url],
    // Mumbai plus the specific suburbs we cover — hyperlocal reach signal.
    areaServed: [
      { '@type': 'City', name: 'Mumbai' },
      ...CONTACT.areasServed.map(name => ({ '@type': 'Place', name })),
    ],
    ...aggregateRating,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '09:00',
        closes: '22:00',
      },
    ],
  },
};

export const OG = {
  locale: 'en_IN',
  type: 'website',
  url: SITE.url,
  title: `${SITE.legalName} | ${SITE.tagline}`,
  description: SITE.description,
  image: ogImageSrc,
};
