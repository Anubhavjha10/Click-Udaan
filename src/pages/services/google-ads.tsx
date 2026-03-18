import React, { useState } from "react";
import styles from "./googleads.module.css";

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
    icon: "🔍",
    title: "Search Ads",
    description:
      "Appear on top of Google search results and capture high-intent customers actively searching for your services.",
  },
  {
    icon: "📺",
    title: "Display Ads",
    description:
      "Visually engaging banner ads across websites to increase brand awareness and reach.",
  },
  {
    icon: "🎥",
    title: "YouTube Ads",
    description:
      "Reach millions through video advertising on YouTube and boost engagement with your brand.",
  },
  {
    icon: "📈",
    title: "Performance Optimization",
    description:
      "Continuous monitoring and optimization to maximize ROI and reduce cost per conversion.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter Ads",
    tagline: "Best for small businesses",
    price: "₹8,999+",
    features: [
      "1 Campaign Setup",
      "Keyword Research",
      "Basic Ad Copy",
      "Monthly Report",
    ],
  },
  {
    name: "Growth Ads",
    tagline: "Perfect for scaling brands",
    price: "₹16,999+",
    features: [
      "Multiple Campaigns",
      "Advanced Targeting",
      "A/B Testing",
      "Conversion Tracking",
    ],
    highlighted: true,
  },
  {
    name: "Premium Ads",
    tagline: "For aggressive growth",
    price: "₹29,999+",
    features: [
      "Full Funnel Ads",
      "Remarketing Campaigns",
      "Advanced Optimization",
      "Weekly Reports",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "What are Google Ads?",
    answer:
      "Google Ads are paid advertisements that appear on Google search results, YouTube, and websites to drive traffic and generate leads.",
  },
  {
    question: "Can Google Ads generate leads instantly?",
    answer:
      "Yes. Google Ads can start generating leads quickly because it targets users actively searching for your services.",
  },
  {
    question: "Do you manage campaigns completely?",
    answer:
      "Yes. We handle setup, keyword research, ad creation, optimization, and performance tracking.",
  },
  {
    question: "How much budget is required?",
    answer:
      "Budget depends on your industry and competition. We help you decide the optimal budget for best results.",
  },
  {
    question: "Do you provide conversion tracking?",
    answer:
      "Yes. We set up proper tracking to measure leads, calls, and performance accurately.",
  },
];

const FAQItem: React.FC<{
  item: FAQ;
  isOpen: boolean;
  onClick: () => void;
}> = ({ item, isOpen, onClick }) => {
  return (
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
};

const GoogleAdsPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <p className={styles.breadcrumb}>
              Home / Services / <strong>Google Ads</strong>
            </p>

            <h1 className={styles.heroTitle}>Google Ads</h1>

            <h2 className={styles.heroSubtitle}>
              Get High-Quality Leads & Sales with Powerful Google Advertising
            </h2>

            <p className={styles.heroDescription}>
              We create data-driven Google Ads campaigns that bring you instant
              visibility, targeted traffic, and high conversion results.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.dashboard}></div>
            <div className={styles.phone}></div>
            <div className={styles.badge1}>🔍</div>
            <div className={styles.badge2}>📈</div>
            <div className={styles.rocket}>🚀</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.section}>
        <h2 className={styles.title}>Our Google Ads Services</h2>
        <p className={styles.subtitle}>
          Smart Campaigns for Maximum ROI ✨
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
        <h2 className={styles.title}>Google Ads Pricing</h2>
        <p className={styles.subtitle}>
          Flexible plans for every business
        </p>

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
                href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20Google%20Ads%20service."
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
          {faqs.map((item, i) => (
            <FAQItem
              key={item.question}
              item={item}
              isOpen={openIndex === i}
              onClick={() =>
                setOpenIndex(openIndex === i ? null : i)
              }
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Start Getting Leads Today</h2>
        <p>
          Let’s create high-performing Google Ads campaigns for your business.
        </p>

        <a
          href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20start%20Google%20Ads."
          target="_blank"
          className={styles.ctaBtn}
        >
          Schedule Free Consultation
        </a>
      </section>
    </div>
  );
};

export default GoogleAdsPage;