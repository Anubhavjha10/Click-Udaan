import React, { useState } from "react";
import styles from "./graphicdesign.module.css";

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type PricingPlan = {
  name: string;
  tagline: string;
  price: string;
  features: string[];
  highlighted?: boolean;
};

type FAQ = {
  question: string;
  answer: string;
};

const features: Feature[] = [
  {
    icon: "🎨",
    title: "Creative Designs",
    description:
      "High-quality creative designs tailored for your brand identity and marketing goals.",
  },
  {
    icon: "📱",
    title: "Social Media Posts",
    description:
      "Engaging Instagram, Facebook, and LinkedIn creatives designed to increase engagement.",
  },
  {
    icon: "🧾",
    title: "Branding Materials",
    description:
      "Logos, business cards, banners, and brand kits for a consistent professional identity.",
  },
  {
    icon: "📊",
    title: "Ad Creatives",
    description:
      "High-converting ad creatives designed for Meta Ads, Google Ads, and campaigns.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter Design",
    tagline: "Best for basic needs",
    price: "₹3,999+",
    features: [
      "5 Social Media Posts",
      "Basic Design",
      "Standard Quality",
      "1 Revision",
    ],
  },
  {
    name: "Growth Design",
    tagline: "Perfect for businesses",
    price: "₹7,999+",
    features: [
      "15 Creative Designs",
      "Brand Consistency",
      "Ad Creatives",
      "Multiple Revisions",
    ],
    highlighted: true,
  },
  {
    name: "Premium Design",
    tagline: "For strong branding",
    price: "₹14,999+",
    features: [
      "Unlimited Designs",
      "Full Branding Kit",
      "High-End Creatives",
      "Priority Support",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "What types of designs do you create?",
    answer:
      "We create social media posts, ad creatives, logos, banners, and complete branding materials.",
  },
  {
    question: "Can you design for ads and campaigns?",
    answer:
      "Yes. We design high-converting creatives specifically for Meta Ads, Google Ads, and marketing campaigns.",
  },
  {
    question: "Do you follow brand guidelines?",
    answer:
      "Yes. We ensure all designs match your brand colors, style, and identity for consistency.",
  },
  {
    question: "Can I request revisions?",
    answer:
      "Yes. Revisions are included depending on your selected plan.",
  },
  {
    question: "Is graphic design important for marketing?",
    answer:
      "Absolutely. Good design increases engagement, improves brand perception, and boosts conversions.",
  },
];

const FAQItem = ({ item, isOpen, onClick }: any) => (
  <div className={styles.faqItem}>
    <button className={styles.faqQuestion} onClick={onClick}>
      <span>{item.question}</span>
      <span className={`${styles.faqIcon} ${isOpen ? styles.rotate : ""}`}>
        +
      </span>
    </button>
    <div className={`${styles.faqAnswerWrap} ${isOpen ? styles.open : ""}`}>
      <p className={styles.faqAnswer}>{item.answer}</p>
    </div>
  </div>
);

const GraphicDesignPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <p className={styles.breadcrumb}>
              Home / Services / <strong>Graphic Designing</strong>
            </p>

            <h1 className={styles.heroTitle}>Graphic Designing</h1>

            <h2 className={styles.heroSubtitle}>
              Create Stunning Visuals that Capture Attention and Build Your Brand
            </h2>

            <p className={styles.heroDescription}>
              We design creative, engaging, and high-quality graphics that help
              businesses stand out, attract customers, and build a strong brand identity.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.dashboard}></div>
            <div className={styles.phone}></div>
            <div className={styles.badge1}>🎨</div>
            <div className={styles.badge2}>✨</div>
            <div className={styles.rocket}>🚀</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.section}>
        <h2 className={styles.title}>Our Graphic Design Services</h2>
        <p className={styles.subtitle}>
          Designs that Speak, Convert, and Build Brand Value ✨
        </p>

        <div className={styles.grid}>
          {features.map((f) => (
            <div className={styles.card} key={f.title}>
              <div className={styles.icon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.section}>
        <h2 className={styles.title}>Graphic Design Pricing</h2>
        <p className={styles.subtitle}>Flexible design packages</p>

        <div className={styles.pricingGrid}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${styles.pricingCard} ${
                plan.highlighted ? styles.highlight : ""
              }`}
            >
              <h3>{plan.name}</h3>
              <p>{plan.tagline}</p>
              <div className={styles.price}>{plan.price}</div>

              <ul>
                {plan.features.map((f) => (
                  <li key={f}>✔ {f}</li>
                ))}
              </ul>

              <a
                href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20Graphic%20Design%20service."
                target="_blank"
                className={styles.btn}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <h2 className={styles.title}>FAQs</h2>

        <div className={styles.faqList}>
          {faqs.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Let’s Design Something Amazing</h2>
        <p>
          Boost your brand with high-quality creative designs that attract and convert.
        </p>

        <a
          href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20Graphic%20Design%20services."
          target="_blank"
          className={styles.ctaBtn}
        >
          Schedule Free Consultation
        </a>
      </section>
    </div>
  );
};

export default GraphicDesignPage;