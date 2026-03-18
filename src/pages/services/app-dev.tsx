import React, { useState } from "react";
import styles from "./appdev.module.css";

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
    icon: "📱",
    title: "Custom App Design",
    description:
      "Modern, user-friendly app interfaces designed to match your brand and audience.",
  },
  {
    icon: "⚡",
    title: "Fast & Responsive",
    description:
      "High-performance applications that run smoothly across Android, iOS, and web platforms.",
  },
  {
    icon: "🔒",
    title: "Secure Development",
    description:
      "Built with strong security practices to protect user data and ensure safe performance.",
  },
  {
    icon: "🔗",
    title: "Scalable Integration",
    description:
      "Apps designed to grow with your business and integrate with APIs, payment systems, and tools.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter App",
    tagline: "Best for small businesses",
    price: "₹24,999+",
    features: [
      "Basic Business App",
      "Responsive UI",
      "Contact / Inquiry Forms",
      "Basic Admin Panel",
    ],
  },
  {
    name: "Business App",
    tagline: "Perfect for growing brands",
    price: "₹49,999+",
    features: [
      "Advanced UI/UX",
      "API Integration",
      "User Login & Dashboard",
      "Push Notifications",
    ],
    highlighted: true,
  },
  {
    name: "Premium App",
    tagline: "For scalable digital products",
    price: "₹89,999+",
    features: [
      "Custom Features",
      "Payment Gateway",
      "Advanced Admin Panel",
      "Analytics & Scalability",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "How long does it take to develop an application?",
    answer:
      "A standard application usually takes 2–6 weeks depending on the complexity, features, and integrations required.",
  },
  {
    question: "Do you build Android and iOS apps?",
    answer:
      "Yes. We can build apps for Android, iOS, or cross-platform solutions depending on your project needs.",
  },
  {
    question: "Can you create custom business applications?",
    answer:
      "Absolutely. We develop custom applications for startups, local businesses, service providers, and growing brands.",
  },
  {
    question: "Will my app be scalable in the future?",
    answer:
      "Yes. We build apps with scalability in mind so new features and integrations can be added later.",
  },
  {
    question: "Do you provide maintenance and updates?",
    answer:
      "Yes. We can provide ongoing support, bug fixes, updates, and feature enhancements after launch.",
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

const AppDevPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroCloudTop}></div>
        <div className={styles.heroCloudBottom}></div>

        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <p className={styles.breadcrumb}>
              <span>Home</span> / <span>Services</span> /{" "}
              <strong>Application Development</strong>
            </p>

            <h1 className={styles.heroTitle}>Application Development</h1>

            <h2 className={styles.heroSubtitle}>
              Build Powerful, Scalable Applications for Your Business Growth
            </h2>

            <p className={styles.heroDescription}>
              We design and develop high-performance applications that are
              visually engaging, user-friendly, and built to deliver real
              business results across mobile and digital platforms.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.skyline}></div>

            <div className={styles.dashboardCard}>
              <div className={styles.dashboardHeader}></div>
              <div className={styles.dashboardBody}>
                <div className={styles.dashboardSidebar}></div>
                <div className={styles.dashboardMain}>
                  <div className={styles.chartBars}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className={styles.chartPanel}></div>
                </div>
              </div>
            </div>

            <div className={styles.mobileMockup}>
              <div className={styles.mobileTop}></div>
              <div className={styles.mobileScreen}>
                <div className={styles.mobileCard}></div>
                <div className={styles.mobileCardSmall}></div>
                <div className={styles.mobileButton}></div>
              </div>
            </div>

            <div className={styles.floatBadgeOne}>📲</div>
            <div className={styles.floatBadgeTwo}>💡</div>
            <div className={styles.floatBadgeThree}>🔔</div>

            <div className={styles.rocket}>🚀</div>

            <div className={styles.assistant}>
              <div className={styles.assistantHead}></div>
              <div className={styles.assistantBody}></div>
              <div className={styles.assistantEarLeft}></div>
              <div className={styles.assistantEarRight}></div>
            </div>
          </div>
        </div>

        <div className={styles.waveDivider}></div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.sectionClouds}></div>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Our Application Development Services
          </h2>
          <p className={styles.sectionSubtitle}>
            Turning Ideas into Smart, High-Performing Applications ✨
          </p>

          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <div className={styles.featureCard} key={feature.title}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureText}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.pricingSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Application Development Pricing</h2>
          <p className={styles.sectionSubtitle}>
            Flexible app development packages for startups and businesses.
          </p>

          <div className={styles.pricingGrid}>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`${styles.pricingCard} ${
                  plan.highlighted ? styles.pricingCardFeatured : ""
                }`}
              >
                {plan.highlighted && (
                  <span className={styles.popularTag}>Most Popular</span>
                )}
                <h3 className={styles.planName}>{plan.name}</h3>
                <p className={styles.planTagline}>{plan.tagline}</p>
                <div className={styles.planPrice}>{plan.price}</div>

                <ul className={styles.planFeatures}>
                  {plan.features.map((item) => (
                    <li key={item}>✔ {item}</li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20get%20started%20with%20your%20application%20development%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.planButton}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.containerSmall}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>
            Everything you may want to know before starting your application
            project.
          </p>

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
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaClouds}></div>
        <div className={styles.container}>
          <div className={styles.ctaWrap}>
            <div className={styles.ctaIllustration}>
              <div className={styles.phoneFrame}>
                <div className={styles.phoneNotch}></div>
                <div className={styles.phoneContent}>
                  <div className={styles.phoneBlockLarge}></div>
                  <div className={styles.phoneBlock}></div>
                  <div className={styles.phoneBlock}></div>
                  <div className={styles.phoneCta}></div>
                </div>
              </div>

              <div className={styles.floatingCard}>
                <div className={styles.floatingCardTop}></div>
                <div className={styles.floatingCardMid}></div>
                <div className={styles.floatingCardBottom}></div>
              </div>
            </div>

            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Let&apos;s Build Your Dream Application
              </h2>
              <p className={styles.ctaText}>
                Ready to get started? Contact our team for a free consultation
                and discover how we can build an application that supports your
                business goals and user experience.
              </p>
              <a
                href="/contact"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaButton}
              >
                Schedule Your Free Consultation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppDevPage;