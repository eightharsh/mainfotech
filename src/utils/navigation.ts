// An array of links for navigation bar
const navBarLinks = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'Products', url: '/products' },
  { name: 'Review', url: '/review' },
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
      { name: 'Review', url: '/review' },
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
const socialLinks = {
  facebook: 'https://www.facebook.com/100063712883917/',
  instagram: 'https://www.instagram.com/mainfotech/',
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};
