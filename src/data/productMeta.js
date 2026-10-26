// The teacher's products.json has no pictures or descriptions, so those
// live here, matched by product id. Edit this file to change them.
// A product that is not listed (e.g. one added to the JSON later) falls back
// to the picture and colour of its category.

const BY_PRODUCT = {
  101: { image: '/face.jpg',      bg: '#f7d0cd', description: 'A soft, sulfate-free gel cleanser that lifts away makeup and daily dirt without leaving skin tight.' },
  102: { image: '/skincare.jpg',  bg: '#c9b8b0', description: 'A brightening serum with vitamin C that helps even out tone and give skin a fresh glow.' },
  103: { image: '/face2.jpg',     bg: '#c1a79b', description: 'A light, non-greasy daily sunscreen with SPF 50 that sits well under makeup.' },
  104: { image: '/skincare2.jpg', bg: '#a97282', description: 'An everyday moisturizer that keeps skin soft and hydrated from morning to night.' },
  201: { image: '/lips3.jpg',     bg: '#b05d68', description: 'A sheer rose tint that gives lips a natural, juicy flush of colour.' },
  202: { image: '/lips2.jpg',     bg: '#f7d0cd', description: 'A silky soft-pink blush that blends easily for a healthy, fresh-faced look.' },
  203: { image: '/lips.jpg',      bg: '#e8d5c4', description: 'A lightweight foundation with a natural finish that feels like nothing on the skin.' },
  301: { image: '/face.jpg',      bg: '#d9c3cf', description: 'A gentle shampoo that cleans the scalp and leaves hair nourished and easy to manage.' },
  302: { image: '/face2.jpg',     bg: '#d9c3cf', description: 'A smoothing conditioner that softens hair and helps with tangles after every wash.' },
  401: { image: '/skincare.jpg',  bg: '#e6cfd6', description: 'A fresh floral eau de parfum with a soft, lasting trail.' },
  501: { image: '/skincare2.jpg', bg: '#cdb7aa', description: 'A creamy body lotion with shea butter for smooth, comfortable skin all day.' },
  502: { image: '/face2.jpg',     bg: '#e8d5c4', description: 'A quick-absorbing hand cream with a bright citrus scent.' },
};

const BY_CATEGORY = {
  1: { image: '/skincare.jpg',  bg: '#c9b8b0' },
  2: { image: '/lips2.jpg',     bg: '#f7d0cd' },
  3: { image: '/face.jpg',      bg: '#d9c3cf' },
  4: { image: '/skincare.jpg',  bg: '#e6cfd6' },
  5: { image: '/skincare2.jpg', bg: '#cdb7aa' },
};

const FALLBACK = { image: '/skincare.jpg', bg: '#e8d5c4' };

export function getProductMeta(productId, categoryId) {
  return {
    description: 'A Cherry Cheeks essential for your daily ritual.',
    ...FALLBACK,
    ...BY_CATEGORY[categoryId],
    ...BY_PRODUCT[productId],
  };
}

// Colour for products created in the admin form (they have no entry above).
export const categoryColor = (categoryId) => (BY_CATEGORY[categoryId] ?? FALLBACK).bg;