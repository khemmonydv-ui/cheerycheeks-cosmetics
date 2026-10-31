import { useEffect, useState } from 'react';
import {
  CtaBanner,
  FaqItem,
  FeatureCard,
  Hero,
  InfoCard,
  ProductCard,
  SectionHeading,
  StatCard,
  StepCard,
} from '../components/about';
import {
  cta,
  faq,
  favourites,
  hero,
  impact,
  missionVision,
  process,
  whyChooseUs,
} from '../data/aboutData';
import './About.css';

const categoryImages = {
  1: '/images/products/skincare5.jpg',
  2: '/images/products/make-up.jpg',
  3: '/images/products/Haircare1.jpg',
  4: '/images/products/Fragrance2.jpg',
  5: '/images/products/bodycare.jpg',
};

export default function About() {
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function getCategories() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}products-data/categories.json`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error(`Could not load categories (HTTP ${response.status})`);
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('json')) {
          throw new Error('Category path returned HTML instead of JSON. Check public/categories-data/categories.json');
        }
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('categories.json must contain an array');
        setCategories(data);
      } catch (error) {
        if (error.name !== 'AbortError') setCategoryError(error.message);
      } finally {
        if (!controller.signal.aborted) setCategoryLoading(false);
      }
    }

    getCategories();
    return () => controller.abort();
  }, []);

  return (
    <main className="about-page">
      <Hero {...hero} />

      <section className="section" id="story">
        <div className="container grid grid-2">
          {missionVision.map(({ id, ...item }) => (
            <InfoCard key={id} {...item} />
          ))}
        </div>
      </section>

      <section className="section section--flush-top" id="favourites">
        <div className="container">
          <SectionHeading title={favourites.title} subtitle={favourites.subtitle} />
          {categoryLoading && <p>Loading categories...</p>}
          {categoryError && <p role="alert">{categoryError}</p>}
          {!categoryLoading && !categoryError && (
            <div className="grid grid-products">
              {categories.slice(0, 4).map((category) => (
                <ProductCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  image={category.image || categoryImages[category.id]}
                  href={`/products?category=${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, ''))}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--lavender" id="why-choose-us">
        <div className="container">
          <SectionHeading title={whyChooseUs.title} tone="dark" />
          <div className="grid grid-3">
            {whyChooseUs.items.map(({ id, ...item }) => (
              <FeatureCard key={id} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="process">
        <div className="container">
          <SectionHeading title={process.title} subtitle={process.subtitle} />
          <div className="grid grid-4">
            {process.steps.map(({ id, ...step }, index) => (
              <StepCard key={id} number={index + 1} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--lavender" id="impact">
        <div className="container">
          <SectionHeading title={impact.title} subtitle={impact.subtitle} uppercase />
          <div className="grid grid-3">
            {impact.stats.map(({ id, ...stat }) => (
              <StatCard key={id} {...stat} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <SectionHeading title={faq.title} />
          <div className="faq-list">
            {faq.items.map(({ id, ...item }) => (
              <FaqItem key={id} {...item} />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner {...cta} />
    </main>
  );
}