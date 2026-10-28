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

  export default function About() {
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

        <section className="section section--flush-top">
          <div className="container">
            <SectionHeading title={favourites.title} subtitle={favourites.subtitle} />
            <div className="grid grid-products">
              {favourites.items.map(({ id, ...item }) => (
                <ProductCard key={id} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section--lavender">
          <div className="container">
            <SectionHeading title={whyChooseUs.title} tone="dark" />
            <div className="grid grid-3">
              {whyChooseUs.items.map(({ id, ...item }) => (
                <FeatureCard key={id} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading title={process.title} subtitle={process.subtitle} />
            <div className="grid grid-4">
              {process.steps.map(({ id, ...step }, index) => (
                <StepCard key={id} number={index + 1} {...step} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section--lavender">
          <div className="container">
            <SectionHeading title={impact.title} subtitle={impact.subtitle} uppercase />
            <div className="grid grid-3">
              {impact.stats.map(({ id, ...stat }) => (
                <StatCard key={id} {...stat} />
              ))}
            </div>
          </div>
        </section>

        <section className="section">
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