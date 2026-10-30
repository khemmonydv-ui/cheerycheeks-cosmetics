// All page content lives here, so the components stay purely presentational.
// Replace the image paths with your own files (in /public/images/about/).

export const hero = {
  eyebrow: 'About our beauty brand',
  title: 'About our beauty brand',
  text: 'Discover premium cosmetics designed to enhance your natural beauty. We create high-quality products that help you feel confident every day, with gentle formulas, soft shades and honest advice.',
  image: 'src/assets/images/ba.jpg',
  imageAlt: '',
  cta: { label: 'Read our story', href: '#story' },
};

export const missionVision = [
  {
    id: 'mission',
    title: 'Our mission',
    text: 'To provide high-quality beauty products that help customers express their unique beauty, with clear information and fair prices.',
  },
  {
    id: 'vision',
    title: 'Our vision',
    text: 'To become a trusted beauty brand that inspires confidence worldwide, one customer and one routine at a time.',
  },
];

export const favourites = {
  title: 'favourites Category',
  subtitle: 'Select any product that you prefer.',
  items: [
    { id: 'makeup', name: 'Makeup', image: 'src/assets/images/makeup.jpg', href: '/products/makeup' },
    { id: 'haircare', name: 'Haircare', image: 'src/assets/images/haricare.jpg', href: '/products/haircare' },
    { id: 'bodycare', name: 'Bodycare', image: 'src/assets/images/bodycare.jpg', href: '/products/bodycare' },
    { id: 'Fragrance', name: 'fragrance', image: 'src/assets/images/Fragrance4.jpg', href: '/products/fragrance' },
  ],
};

export const whyChooseUs = {
  title: 'Why choose us',
  items: [
    { id: 'quality', title: 'Quality first', text: 'Premium ingredients, small-batch checks and every product tested before it is sold.' },
    { id: 'natural', title: 'Natural beauty', text: 'Formulas that enhance your features and care for your skin, never mask them.' },
    { id: 'care', title: 'Customer care', text: 'Shade matching, routine advice and friendly after-sale support, in store and online.' },
  ],
 
};

export const process = {
  title: 'How we make our products',
  subtitle: 'Every item follows the same four steps before it reaches you',
  steps: [
    { id: 'choose', title: 'Choose', text: 'We select ingredients for comfort, performance and skin safety.' },
    { id: 'develop', title: 'Develop', text: 'Textures and shades are refined until they feel right and wear well.' },
    { id: 'test', title: 'Test', text: 'Each batch is checked for quality, stability and consistency.' },
    { id: 'package', title: 'Package', text: 'Elegant, protective packaging keeps products fresh and gift-ready.' },
  ],
};

export const impact = {
  title: 'Our impact',
  subtitle: 'Three numbers that shape our brand.',
  stats: [
    { id: 'years', value: '10+', label: 'years of experience' },
    { id: 'products', value: '50+', label: 'beauty products' },
    { id: 'customers', value: '10K+', label: 'happy customers' },
  ],
};

export const faq = {
  title: 'Questions we often hear',
  items: [
    { id: 'sensitive', question: 'Are your products suitable for sensitive skin?', answer: "Our formulas are tested for comfort, but everyone's skin is different. Check the ingredient list and try a small patch first." },
    { id: 'shade', question: 'How do I find my shade?', answer: 'Visit the shop for a free shade match, or message us a photo in natural light and we will suggest options.' },
    { id: 'return', question: 'Can I return a product?', answer: 'If a shade does not suit you, contact us soon after purchase and we will help with an exchange or return.' },
    { id: 'buy', question: 'Where can I buy?', answer: 'You can order online or visit our shop in person to try products before you buy.' },
  ],
};

export const cta = {
  title: 'Find the beauty that fits you',
  text: 'Discover our beauty collection and find products made for you.',
  button: { label: 'Explore products', href: '/products' },
};