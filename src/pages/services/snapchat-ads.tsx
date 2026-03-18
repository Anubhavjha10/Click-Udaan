import React, { useState } from "react";
import styles from "./snapchatads.module.css";

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
    icon: "👻",
    title: "Snap Ads",
    description:
      "Full-screen vertical ads designed to capture user attention instantly on Snapchat.",
  },
  {
    icon: "📸",
    title: "Story Ads",
    description:
      "Promote your brand directly in Snapchat stories and engage users naturally.",
  },
  {
    icon: "🎯",
    title: "Advanced Targeting",
    description:
      "Reach the right audience based on interests, behavior, and demographics.",
  },
  {
    icon: "📊",
    title: "Performance Tracking",
    description:
      "Track conversions, clicks, and ROI with advanced analytics and insights.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter Plan",
    tagline: "Perfect for small brands",
    price: "₹7,999+",
    features: [
      "1 Campaign Setup",
      "Audience Targeting",
      "Basic Ad Design",
      "Monthly Report",
    ],
  },
  {
    name: "Growth Plan",
    tagline: "Best for scaling brands",
    price: "₹14,999+",
    features: [
      "Multiple Campaigns",
      "Creative Optimization",
      "A/B Testing",
      "Conversion Tracking",
    ],
    highlighted: true,
  },
  {
    name: "Premium Plan",
    tagline: "For maximum reach",
    price: "₹25,999+",
    features: [
      "Full Funnel Ads",
      "Retargeting Campaigns",
      "Advanced Analytics",
      "Weekly Reports",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "What are Snapchat Ads?",
    answer:
      "Snapchat Ads are full-screen vertical ads shown to users on Snapchat to increase engagement and conversions.",
  },
  {
    question: "Is Snapchat good for advertising?",
    answer:
      "Yes, especially for targeting younger audiences and creating highly engaging visual campaigns.",
  },
  {
    question: "Do you create ad creatives?",
    answer:
      "Yes, we design high-performing creatives tailored for Snapchat’s format.",
  },
  {
    question: "How quickly can I see results?",
    answer:
      "You can start seeing engagement within days, depending on targeting and budget.",
  },
  {
    question: "Do you track performance?",
    answer:
      "Yes, we provide detailed analytics and performance reports.",
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

const SnapchatAdsPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <p className={styles.breadcrumb}>
              Home / Services / <strong>Snapchat Ads</strong>
            </p>

            <h1 className={styles.heroTitle}>Snapchat Ads</h1>

            <h2 className={styles.heroSubtitle}>
              Reach Millions with Creative & Engaging Snapchat Campaigns
            </h2>

            <p className={styles.heroDescription}>
              We create visually powerful Snapchat ad campaigns that capture
              attention, increase engagement, and drive conversions.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.dashboard}></div>
            <div className={styles.phone}></div>
            <div className={styles.badge1}>👻</div>
            <div className={styles.badge2}>📊</div>
            <div className={styles.rocket}>🚀</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.section}>
        <h2 className={styles.title}>Our Snapchat Ads Services</h2>
        <p className={styles.subtitle}>
          Creative Campaigns that Drive Engagement ✨
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
        <h2 className={styles.title}>Snapchat Ads Pricing</h2>
        <p className={styles.subtitle}>
          Plans designed for every business size
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
                href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20Snapchat%20Ads%20service."
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
        <h2>Start Your Snapchat Ads Campaign</h2>
        <p>
          Let’s create high-converting Snapchat campaigns for your brand.
        </p>

        <a
          href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20start%20Snapchat%20Ads."
          target="_blank"
          className={styles.ctaBtn}
        >
          Schedule Free Consultation
        </a>
      </section>
    </div>
  );
};

export default SnapchatAdsPage;