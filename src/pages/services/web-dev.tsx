import React, { useState } from "react";
import styles from "./WebDev.module.css";

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
    icon: "🚀",
    title: "Custom Design",
    description:
      "Unique, professional designs tailored to your brand and audience.",
  },
  {
    icon: "📱",
    title: "Responsive & Fast",
    description:
      "Mobile friendly, fast-loading websites that perform great on all devices.",
  },
  {
    icon: "🔎",
    title: "SEO Friendly",
    description:
      "Optimized for search engines to improve your site's visibility and rankings.",
  },
  {
    icon: "🛡️",
    title: "Secure & Scalable",
    description:
      "Strong security features and scalability to grow with your business.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter Website",
    tagline: "Perfect for small businesses",
    price: "₹4,999+",
    features: [
      "5 Pages Website",
      "Mobile Responsive",
      "Basic SEO Setup",
      "Contact Form",
    ],
  },
  {
    name: "Business Website",
    tagline: "Ideal for growing brands",
    price: "₹11,999+",
    features: [
      "10 Pages Website",
      "SEO Optimized",
      "Speed Optimization",
      "Lead Capture Forms",
    ],
    highlighted: true,
  },
  {
    name: "Premium Website",
    tagline: "Best for scaling companies",
    price: "₹34,999+",
    features: [
      "Custom UI Design",
      "Advanced SEO",
      "CRM Integration",
      "Analytics Setup",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "How long does it take to build a website?",
    answer:
      "A standard business website usually takes 7–15 days depending on pages, design complexity, and required integrations.",
  },
  {
    question: "Will my website be mobile friendly?",
    answer:
      "Yes. Every website is designed to be fully responsive so it works smoothly on mobile, tablet, and desktop devices.",
  },
  {
    question: "Do you provide SEO with website development?",
    answer:
      "Yes. We include basic on-page SEO setup, and advanced SEO can also be added depending on your package.",
  },
  {
    question: "Can you redesign my existing website?",
    answer:
      "Absolutely. We can refresh the design, improve speed, modernize the UI, and optimize your current website for better performance.",
  },
  {
    question: "Will I be able to edit my website later?",
    answer:
      "Yes. We can build your site in a way that allows you to update content later, or we can provide ongoing support if needed.",
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

const WebDevPage: React.FC = () => {
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
              <strong>Website Development</strong>
            </p>

            <h1 className={styles.heroTitle}>Website Development</h1>

            <h2 className={styles.heroSubtitle}>
              Elevate Your Online Presence with Custom, High-Performance
              Websites
            </h2>

            <p className={styles.heroDescription}>
              We design and develop websites that not only look stunning but
              also perform flawlessly. Discover how we can create a powerful
              online presence for your business!
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

            <div className={styles.floatBadgeOne}>💡</div>
            <div className={styles.floatBadgeTwo}>🧩</div>
            <div className={styles.floatBadgeThree}>💬</div>

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
          <h2 className={styles.sectionTitle}>Our Website Development Services</h2>
          <p className={styles.sectionSubtitle}>
            Transforming Your Vision into a Stunning, Effective Website ✨
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
          <h2 className={styles.sectionTitle}>Website Development Pricing</h2>
          <p className={styles.sectionSubtitle}>
            Flexible packages designed for businesses of all sizes.
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
                  href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20get%20started%20with%20your%20website%20development%20services."
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
            Everything you may want to know before starting your website
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
              <div className={styles.clipboard}>
                <div className={styles.clipTop}></div>
                <div className={styles.clipLine}></div>
                <div className={styles.clipLine}></div>
                <div className={styles.clipLine}></div>
                <div className={styles.clipLine}></div>
              </div>

              <div className={styles.ctaScreen}>
                <div className={styles.ctaScreenTop}></div>
                <div className={styles.ctaScreenBody}>
                  <div className={styles.ctaMiniSidebar}></div>
                  <div className={styles.ctaMiniContent}>
                    <div className={styles.ctaMiniCard}></div>
                    <div className={styles.ctaMiniGraph}></div>
                  </div>
                </div>
              </div>

              <div className={styles.magnifier}></div>
            </div>

            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Let&apos;s Build Your Dream Website</h2>
              <p className={styles.ctaText}>
                Ready to get started? Contact our team for a free consultation
                and learn how we can create a website that drives results.
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

export default WebDevPage;