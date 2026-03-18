import React, { useState } from "react";
import styles from "./crm.module.css";

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
    icon: "👥",
    title: "Lead Management",
    description:
      "Organize and manage all your leads efficiently in one place for better follow-ups and higher conversions.",
  },
  {
    icon: "📊",
    title: "Sales Tracking",
    description:
      "Track sales activity, deal stages, and customer progress with a clean and structured CRM workflow.",
  },
  {
    icon: "⚙️",
    title: "Automation Setup",
    description:
      "Automate repetitive tasks like reminders, follow-ups, status updates, and lead assignments.",
  },
  {
    icon: "📩",
    title: "Customer Communication",
    description:
      "Keep all customer interactions streamlined with better communication history and engagement tracking.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter CRM",
    tagline: "Best for small teams",
    price: "₹9,999+",
    features: [
      "Basic CRM Setup",
      "Lead Management",
      "Follow-Up Tracking",
      "Monthly Review",
    ],
  },
  {
    name: "Growth CRM",
    tagline: "Perfect for growing businesses",
    price: "₹18,999+",
    features: [
      "Advanced CRM Workflow",
      "Automation Setup",
      "Sales Pipeline Tracking",
      "User Training Support",
    ],
    highlighted: true,
  },
  {
    name: "Premium CRM",
    tagline: "For full business process optimization",
    price: "₹34,999+",
    features: [
      "Custom CRM Configuration",
      "Automation + Reports",
      "Advanced Pipeline Setup",
      "Dedicated Support",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "What is CRM?",
    answer:
      "CRM stands for Customer Relationship Management. It helps businesses manage leads, customer data, follow-ups, and sales processes efficiently.",
  },
  {
    question: "How can CRM help my business?",
    answer:
      "CRM helps organize customer interactions, improve team productivity, track sales, and increase conversion rates through better follow-up management.",
  },
  {
    question: "Can you set up CRM for my team?",
    answer:
      "Yes. We can configure CRM systems, create workflows, set up lead pipelines, and help your team use it effectively.",
  },
  {
    question: "Do you provide CRM automation?",
    answer:
      "Yes. We can automate repetitive tasks like reminders, follow-up flows, status changes, and lead assignments.",
  },
  {
    question: "Is CRM useful for small businesses too?",
    answer:
      "Absolutely. Even small businesses benefit from CRM by improving lead management, customer follow-ups, and sales organization.",
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

const CRMPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <p className={styles.breadcrumb}>
              Home / Services / <strong>CRM</strong>
            </p>

            <h1 className={styles.heroTitle}>CRM</h1>

            <h2 className={styles.heroSubtitle}>
              Manage Leads, Customers, and Sales Better with Smart CRM Solutions
            </h2>

            <p className={styles.heroDescription}>
              We help businesses organize leads, streamline follow-ups, improve
              customer management, and optimize sales workflows through smart CRM
              setup and automation.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.dashboard}></div>
            <div className={styles.phone}></div>
            <div className={styles.badge1}>📊</div>
            <div className={styles.badge2}>👥</div>
            <div className={styles.rocket}>🚀</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Our CRM Services</h2>
        <p className={styles.subtitle}>
          Better Customer Management, Better Sales, Better Growth ✨
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
        <h2 className={styles.title}>CRM Pricing</h2>
        <p className={styles.subtitle}>
          Flexible CRM solutions designed for teams of every size
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
                href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20CRM%20service."
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
        <h2>Build a Smarter CRM System for Your Business</h2>
        <p>
          Let&apos;s set up a CRM solution that helps you track leads, manage
          customer relationships, and improve sales performance.
        </p>

        <a
          href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20start%20CRM%20services."
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

export default CRMPage;