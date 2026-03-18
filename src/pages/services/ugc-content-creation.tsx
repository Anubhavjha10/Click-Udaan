import React, { useState } from "react";
import styles from "./ugccontent.module.css";

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
    icon: "🎥",
    title: "Authentic UGC Videos",
    description:
      "Natural, engaging user-generated style videos that make your brand feel real, relatable, and trustworthy.",
  },
  {
    icon: "📱",
    title: "Reels & Short Content",
    description:
      "Platform-focused UGC content for Instagram Reels, ads, and short-form campaigns that grab attention fast.",
  },
  {
    icon: "🛍️",
    title: "Product Showcasing",
    description:
      "Creative product-focused videos and visuals that highlight your product benefits in a realistic way.",
  },
  {
    icon: "📈",
    title: "Ad Ready Creatives",
    description:
      "UGC content designed to improve ad performance, boost conversions, and make campaigns feel more human.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter UGC",
    tagline: "Best for small brands",
    price: "₹6,999+",
    features: [
      "2 UGC Videos",
      "Basic Scripting",
      "Product Highlighting",
      "Ready-to-use Edits",
    ],
  },
  {
    name: "Growth UGC",
    tagline: "Perfect for growing businesses",
    price: "₹12,999+",
    features: [
      "5 UGC Videos",
      "Creative Hooks",
      "Ad Ready Content",
      "Performance Focused Style",
    ],
    highlighted: true,
  },
  {
    name: "Premium UGC",
    tagline: "For high-impact campaigns",
    price: "₹21,999+",
    features: [
      "10 UGC Videos",
      "Advanced Creative Direction",
      "Brand Focused Messaging",
      "Priority Support",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "What is UGC content creation?",
    answer:
      "UGC means User-Generated Content. It includes relatable, natural-style videos and visuals that make products and brands feel more authentic and trustworthy.",
  },
  {
    question: "Why is UGC good for marketing?",
    answer:
      "UGC often performs better because it feels more real, less salesy, and more relatable to potential customers.",
  },
  {
    question: "Can UGC content be used for ads?",
    answer:
      "Yes. UGC content works very well in Meta Ads, product campaigns, Instagram Reels, and performance marketing.",
  },
  {
    question: "Do you create scripts and concepts too?",
    answer:
      "Yes. We can help with scripting, hooks, messaging angles, and content direction depending on the package.",
  },
  {
    question: "Is UGC useful for small businesses too?",
    answer:
      "Absolutely. Small businesses can use UGC to build trust, improve conversions, and create better social proof around their products or services.",
  },
];

const FAQItem: React.FC<{
  item: FAQ;
  isOpen: boolean;
  onClick: () => void;
}> = ({ item, isOpen, onClick }) => {
  return (
    <div className={styles.faqItem}>
      <button className={styles.faqQuestion} onClick={onClick} type="button">
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

const UGCContentPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <p className={styles.breadcrumb}>
              Home / Services / <strong>UGC Content Creation</strong>
            </p>

            <h1 className={styles.heroTitle}>UGC Content Creation</h1>

            <h2 className={styles.heroSubtitle}>
              Create Authentic, High-Converting UGC Content that Builds Trust and
              Drives Results
            </h2>

            <p className={styles.heroDescription}>
              We help brands create relatable, engaging, and performance-focused
              UGC content that feels real, connects with audiences, and improves
              the effectiveness of social media and ad campaigns.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.dashboard}></div>
            <div className={styles.phone}></div>
            <div className={styles.badge1}>🎥</div>
            <div className={styles.badge2}>✨</div>
            <div className={styles.rocket}>🚀</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Our UGC Content Creation Services</h2>
        <p className={styles.subtitle}>
          Authentic Content that Connects, Converts, and Builds Trust ✨
        </p>

        <div className={styles.grid}>
          {features.map((feature) => (
            <div className={styles.card} key={feature.title}>
              <div className={styles.icon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>UGC Content Pricing</h2>
        <p className={styles.subtitle}>
          Flexible UGC packages for brands, products, and campaigns
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
                {plan.features.map((feature) => (
                  <li key={feature}>✔ {feature}</li>
                ))}
              </ul>

              <a
                href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20UGC%20Content%20Creation%20service."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btn}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>FAQs</h2>

        <div className={styles.faqList}>
          {faqs.map((item, index) => (
            <FAQItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onClick={() =>
                setOpenIndex((prev) => (prev === index ? null : index))
              }
            />
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Let&apos;s Create Content that Feels Real and Sells Better</h2>
        <p>
          Build stronger trust and better performance with UGC content designed
          for modern audiences and high-converting campaigns.
        </p>

        <a
          href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20start%20UGC%20Content%20Creation%20services."
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
        >
          Schedule Free Consultation
        </a>
      </section>
    </div>
  );
};

export default UGCContentPage;