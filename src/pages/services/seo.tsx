import React, { useState } from "react";
import styles from "./seo.module.css";

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
    title: "Keyword Research",
    description:
      "We find the right keywords your audience is searching for to improve rankings and bring quality traffic.",
  },
  {
    icon: "🛠️",
    title: "On-Page SEO",
    description:
      "Optimize titles, meta tags, content, headings, URLs, and internal structure for better search visibility.",
  },
  {
    icon: "⚡",
    title: "Technical SEO",
    description:
      "Improve speed, indexing, crawlability, mobile usability, and site health to strengthen search performance.",
  },
  {
    icon: "📈",
    title: "Growth Tracking",
    description:
      "Track rankings, traffic, and performance regularly to refine strategy and deliver long-term growth.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter SEO",
    tagline: "Best for small businesses",
    price: "₹7,999+",
    features: [
      "Basic Keyword Research",
      "On-Page Optimization",
      "Meta Tags Setup",
      "Monthly Report",
    ],
  },
  {
    name: "Growth SEO",
    tagline: "Perfect for growing brands",
    price: "₹14,999+",
    features: [
      "Advanced Keyword Strategy",
      "Technical SEO Fixes",
      "Content Optimization",
      "Performance Tracking",
    ],
    highlighted: true,
  },
  {
    name: "Premium SEO",
    tagline: "For aggressive business growth",
    price: "₹24,999+",
    features: [
      "Full SEO Strategy",
      "Technical + On-Page SEO",
      "Competitor Analysis",
      "Detailed Monthly Insights",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "What is SEO?",
    answer:
      "SEO stands for Search Engine Optimization. It helps your website rank higher on Google and other search engines to attract more organic traffic.",
  },
  {
    question: "How long does SEO take to show results?",
    answer:
      "SEO usually takes a few weeks to a few months depending on your niche, website condition, competition, and strategy.",
  },
  {
    question: "Do you provide both on-page and technical SEO?",
    answer:
      "Yes. We work on on-page SEO, technical SEO, keyword optimization, and site improvements for better rankings.",
  },
  {
    question: "Can SEO help generate leads?",
    answer:
      "Yes. Good SEO brings targeted traffic to your site, which increases chances of inquiries, leads, and conversions.",
  },
  {
    question: "Do you provide monthly SEO reports?",
    answer:
      "Yes. We provide regular reports to track keywords, traffic, and growth performance.",
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

const SEOPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <p className={styles.breadcrumb}>
              Home / Services / <strong>SEO</strong>
            </p>

            <h1 className={styles.heroTitle}>SEO</h1>

            <h2 className={styles.heroSubtitle}>
              Rank Higher, Get More Traffic, and Grow Organically with Smart SEO
            </h2>

            <p className={styles.heroDescription}>
              We help businesses improve search visibility through keyword
              strategy, technical fixes, on-page optimization, and long-term SEO
              growth planning.
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

      <section className={styles.section}>
        <h2 className={styles.title}>Our SEO Services</h2>
        <p className={styles.subtitle}>
          Strategic Optimization for Long-Term Organic Growth ✨
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
        <h2 className={styles.title}>SEO Pricing</h2>
        <p className={styles.subtitle}>
          Flexible SEO plans tailored to your business goals
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
                href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20SEO%20service."
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
        <h2>Grow Your Business with SEO</h2>
        <p>
          Let&apos;s build a strong SEO strategy that brings long-term organic
          traffic and better visibility for your business.
        </p>

        <a
          href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20start%20SEO%20services."
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

export default SEOPage;