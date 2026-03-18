import React, { useState } from "react";
import styles from "./smo.module.css";

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
    icon: "✨",
    title: "Profile Optimization",
    description:
      "We optimize your social media profiles with the right branding, bio, visuals, and structure for a professional impression.",
  },
  {
    icon: "📅",
    title: "Content Planning",
    description:
      "Strategic content planning and posting structure designed to improve consistency and audience engagement.",
  },
  {
    icon: "📣",
    title: "Brand Visibility",
    description:
      "Increase your brand presence across social media platforms with optimized content and profile activity.",
  },
  {
    icon: "🤝",
    title: "Audience Engagement",
    description:
      "Improve trust and interaction through better post flow, content quality, and optimized social activity.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter SMO",
    tagline: "Best for small businesses",
    price: "₹5,999+",
    features: [
      "Profile Optimization",
      "Basic Content Plan",
      "Branding Improvements",
      "Monthly Review",
    ],
  },
  {
    name: "Growth SMO",
    tagline: "Perfect for growing brands",
    price: "₹10,999+",
    features: [
      "Advanced Optimization",
      "Content Strategy",
      "Profile Branding",
      "Performance Review",
    ],
    highlighted: true,
  },
  {
    name: "Premium SMO",
    tagline: "For stronger brand presence",
    price: "₹17,999+",
    features: [
      "Full SMO Strategy",
      "Multi-Platform Optimization",
      "Brand Positioning",
      "Monthly Consultation",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "What is SMO?",
    answer:
      "SMO stands for Social Media Optimization. It focuses on improving your social media profiles, presence, branding, and engagement for better visibility.",
  },
  {
    question: "How is SMO different from social media marketing?",
    answer:
      "SMO focuses more on profile optimization, branding, consistency, and organic improvement, while social media marketing often includes active campaigns and promotions.",
  },
  {
    question: "Which platforms do you optimize?",
    answer:
      "We can optimize Instagram, Facebook, LinkedIn, and other major social media platforms depending on your business needs.",
  },
  {
    question: "Can SMO help improve business trust online?",
    answer:
      "Yes. A well-optimized and professional social media presence builds credibility, trust, and better first impressions for customers.",
  },
  {
    question: "Do you provide regular strategy and review?",
    answer:
      "Yes. We provide optimization support, strategy suggestions, and regular reviews depending on your selected plan.",
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

const SMOPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <p className={styles.breadcrumb}>
              Home / Services / <strong>SMO</strong>
            </p>

            <h1 className={styles.heroTitle}>SMO</h1>

            <h2 className={styles.heroSubtitle}>
              Strengthen Your Social Presence with Strategic Social Media
              Optimization
            </h2>

            <p className={styles.heroDescription}>
              We help businesses improve their social media presence through
              profile optimization, better branding, consistent content
              structure, and smarter audience engagement.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.dashboard}></div>
            <div className={styles.phone}></div>
            <div className={styles.badge1}>📱</div>
            <div className={styles.badge2}>✨</div>
            <div className={styles.rocket}>🚀</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Our SMO Services</h2>
        <p className={styles.subtitle}>
          Smarter Profiles, Better Presence, Stronger Organic Growth ✨
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
        <h2 className={styles.title}>SMO Pricing</h2>
        <p className={styles.subtitle}>
          Flexible plans designed for consistent social media growth
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
                href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20SMO%20service."
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
        <h2>Improve Your Social Media Presence</h2>
        <p>
          Let&apos;s optimize your profiles, strengthen your branding, and build
          a better social media identity for your business.
        </p>

        <a
          href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20start%20SMO%20services."
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

export default SMOPage;