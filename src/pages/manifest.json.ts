import type { APIRoute, ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import appIcon from '@images/icon.png';

interface Favicon {
  purpose: 'any' | 'maskable' | 'monochrome';
  src: ImageMetadata;
  sizes: number[];
}

const sizes = [192, 512];
const favicons: Favicon[] = [
  {
    purpose: 'any',
    src: appIcon,
    sizes,
  },
  {
    purpose: 'maskable',
    src: appIcon,
    sizes,
  },
];

export const GET: APIRoute = async () => {
  const icons = await Promise.all(
    favicons.flatMap(favicon =>
      favicon.sizes.map(async size => {
        const image = await getImage({
          src: favicon.src,
          width: size,
          height: size,
          format: 'png',
        });
        return {
          src: image.src,
          sizes: `${size}x${size}`,
          type: 'image/png',
          purpose: favicon.purpose,
        };
      })
    )
  );

  const manifest = {
    short_name: 'MA Infotech',
    name: 'MA Infotech — Computer Sales & Service',
    description:
      'Mumbai computer sales and service — custom PC building, laptop & desktop repair, networking, CCTV installation, and IT products from all leading brands.',
    icons,
    display: 'standalone',
    id: '/',
    scope: '/',
    start_url: '/',
    lang: 'en-IN',
    dir: 'ltr',
    orientation: 'portrait-primary',
    categories: ['business', 'shopping', 'utilities'],
    theme_color: '#17255e',
    background_color: '#ffffff',
    shortcuts: [
      { name: 'Call the shop', url: '/contact', description: 'Call MA Infotech' },
      { name: 'Products', url: '/products', description: 'Browse products' },
      { name: 'Services', url: '/services', description: 'View services' },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  });
};
