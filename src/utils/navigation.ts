// An array of links for navigation bar
const navBarLinks = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'Products', url: '/products' },
  { name: 'Contact', url: '/contact' },
];
// An array of links for footer
const footerLinks = [
  {
    section: 'Company',
    links: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Products', url: '/products' },
      { name: 'Contact', url: '/contact' },
    ],
  },
  {
    section: 'Services',
    links: [
      { name: 'Custom PC Building', url: '/services' },
      { name: 'Laptop & PC Repair', url: '/services' },
      { name: 'Networking & Wi-Fi', url: '/services' },
      { name: 'CCTV & Security', url: '/services' },
    ],
  },
];
// Social icons shown in the footer (WhatsApp comes from CONTACT.whatsappUrl).
// TODO: Replace with MA Infotech's real Facebook & Instagram profile URLs.
const socialLinks = {
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};
