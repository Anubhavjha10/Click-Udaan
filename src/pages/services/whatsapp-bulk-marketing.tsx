import React, { useState } from "react";
import styles from "./whatsappbulk.module.css";

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
    icon: "📤",
    title: "Bulk Message Campaigns",
    description:
      "Send promotional, informational, and campaign-based WhatsApp messages to a larger audience efficiently.",
  },
  {
    icon: "🎯",
    title: "Audience Targeting",
    description:
      "Reach the right customer segments with better message planning and targeted communication strategy.",
  },
  {
    icon: "💬",
    title: "Engagement Messaging",
    description:
      "Use compelling message formats to improve open rates, engagement, and customer responses.",
  },
  {
    icon: "📈",
    title: "Campaign Performance",
    description:
      "Track delivery, engagement trends, and campaign effectiveness to improve future WhatsApp marketing performance.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter Bulk",
    tagline: "Best for small campaigns",
    price: "₹6,999+",
    features: [
      "Basic Campaign Setup",
      "Message Formatting",
      "Audience Segmentation",
      "Monthly Report",
    ],
  },
  {
    name: "Growth Bulk",
    tagline: "Perfect for growing businesses",
    price: "₹12,999+",
    features: [
      "Advanced Campaign Setup",
      "Targeted Messaging",
      "Template Strategy",
      "Performance Tracking",
    ],
    highlighted: true,
  },
  {
    name: "Premium Bulk",
    tagline: "For large-scale outreach",
    price: "₹21,999+",
    features: [
      "Full Campaign Strategy",
      "Advanced Audience Targeting",
      "Optimization Support",
      "Detailed Insights",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "What is WhatsApp Bulk Marketing?",
    answer:
      "WhatsApp Bulk Marketing is a strategy used to send messages to a large number of users for promotions, updates, offers, and customer communication.",
  },
  {
    question: "Can WhatsApp bulk marketing help generate leads?",
    answer:
      "Yes. A strong WhatsApp campaign can improve direct customer response, engagement, and lead generation when planned properly.",
  },
  {
    question: "Do you help with message strategy and templates?",
    answer:
      "Yes. We help create effective message flow, campaign structure, and optimized communication strategy for better results.",
  },
  {
    question: "Is WhatsApp marketing useful for small businesses?",
    answer:
      "Absolutely. Small businesses can use WhatsApp marketing to engage customers directly, promote services, and improve conversions.",
  },
  {
    question: "Do you provide campaign tracking and reports?",
    answer:
      "Yes. We provide performance monitoring and campaign insights depending on the package selected.",
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

const WhatsAppBulkMarketingPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <p className={styles.breadcrumb}>
              Home / Services / <strong>WhatsApp Bulk Marketing</strong>
            </p>

            <h1 className={styles.heroTitle}>WhatsApp Bulk Marketing</h1>

            <h2 className={styles.heroSubtitle}>
              Reach More Customers Faster with High-Impact WhatsApp Campaigns
            </h2>

            <p className={styles.heroDescription}>
              We help businesses connect with their audience through strategic
              WhatsApp bulk marketing campaigns designed for better reach,
              stronger engagement, and more conversions.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.dashboard}></div>
            <div className={styles.phone}></div>
            <div className={styles.badge1}>💬</div>
            <div className={styles.badge2}>📤</div>
            <div className={styles.rocket}>🚀</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Our WhatsApp Bulk Marketing Services</h2>
        <p className={styles.subtitle}>
          Direct Messaging Strategies for Better Reach and Results ✨
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
        <h2 className={styles.title}>WhatsApp Bulk Marketing Pricing</h2>
        <p className={styles.subtitle}>
          Flexible plans for businesses of every size
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
                href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20WhatsApp%20Bulk%20Marketing%20service."
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
        <h2>Launch Smarter WhatsApp Campaigns</h2>
        <p>
          Let&apos;s build a WhatsApp bulk marketing strategy that helps you
          reach more customers, boost engagement, and grow your business faster.
        </p>

        <a
          href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20start%20WhatsApp%20Bulk%20Marketing%20services."
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

export default WhatsAppBulkMarketingPage;