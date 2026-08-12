// llms.txt — a concise, AI-crawler-friendly summary of the site.
// Emerging standard: https://llmstxt.org/
import type { APIRoute } from 'astro';
import { SITE, CONTACT } from '@data/constants';

const u = (path: string) => new URL(path, SITE.url).href;

const hours = CONTACT.hours.map(h => `${h.day}: ${h.time}`).join('; ');

const llmsTxt = `# ${SITE.legalName}

> ${SITE.description}

${SITE.legalName} is a local computer shop in ${CONTACT.area}, ${CONTACT.city}. It sells genuine, brand-warranted IT products and provides same-day repairs and IT services with a written service warranty.

## Pages

- [Home](${u('/')}): Overview of computer sales, service and IT solutions in ${CONTACT.city}.
- [Services](${u('/services')}): Laptop & desktop repair, custom PC & workstation building, networking & Wi-Fi, CCTV & security systems, office/site IT setup, and AMC / on-site support.
- [Products](${u('/products')}): Laptops, desktops & all-in-ones, PC components, SSDs & storage, monitors, printers & scanners, networking equipment, CCTV, and accessories from all leading brands.
- [Contact](${u('/contact')}): Call, WhatsApp, email, or visit the shop; send an enquiry and book a service.

## Contact

- Phone: ${CONTACT.phoneDisplay}
- WhatsApp: ${CONTACT.whatsappDisplay}
- Email: ${CONTACT.email}
- Address: ${CONTACT.addressFull}
- Hours: ${hours}
- Google rating: ${CONTACT.googleReviews.rating}/5

## Notes

- Service area: ${CONTACT.city} and surrounding areas.
- Products are sold on an enquiry basis — contact for current pricing and stock.
`.trim();

export const GET: APIRoute = () => {
  return new Response(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
