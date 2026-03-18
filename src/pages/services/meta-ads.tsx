import React, { useState } from "react";
import styles from "./metaads.module.css";

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
    icon: "🎯",
    title: "Audience Targeting",
    description:
      "Reach the right audience with detailed targeting based on interests, behavior, demographics, and location.",
  },
  {
    icon: "🖼️",
    title: "Creative Ad Design",
    description:
      "High-converting ad creatives, carousels, visuals, and copy designed to grab attention and drive action.",
  },
  {
    icon: "📊",
    title: "Campaign Optimization",
    description:
      "Continuous monitoring and optimization to improve performance, reduce cost per lead, and boost ROI.",
  },
  {
    icon: "📩",
    title: "Lead Generation Ads",
    description:
      "Meta lead form campaigns built to generate quality inquiries directly from Facebook and Instagram.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter Ads",
    tagline: "Perfect for small businesses",
    price: "₹7,999+",
    features: [
      "1 Campaign Setup",
      "Basic Audience Research",
      "Ad Creative Guidance",
      "Monthly Performance Report",
    ],
  },
  {
    name: "Growth Ads",
    tagline: "Ideal for scaling businesses",
    price: "₹14,999+",
    features: [
      "Multiple Campaigns",
      "Advanced Targeting",
      "A/B Ad Testing",
      "Lead Optimization",
    ],
    highlighted: true,
  },
  {
    name: "Premium Ads",
    tagline: "Best for aggressive growth",
    price: "₹24,999+",
    features: [
      "Full Funnel Campaigns",
      "Retargeting Strategy",
      "Creative Support",
      "Weekly Optimization",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "What are Meta Ads?",
    answer:
      "Meta Ads are paid advertising campaigns run on Facebook and Instagram to reach your target audience, generate leads, and grow your business.",
  },
  {
    question: "Can Meta Ads help me generate leads?",
    answer:
      "Yes. Meta Ads are highly effective for lead generation, especially when paired with the right audience targeting, creatives, and landing or lead forms.",
  },
  {
    question: "Do you create ad creatives too?",
    answer:
      "Yes. Depending on the package, we can support ad creatives, copywriting, campaign setup, and performance optimization.",
  },
  {
    question: "How much budget do I need to run Meta Ads?",
    answer:
      "The ad budget depends on your business type, location, and goals. We can recommend a practical budget after understanding your objectives.",
  },
  {
    question: "How soon can I start seeing results from Meta Ads?",
    answer:
      "Initial performance data can start coming in within a few days, while stronger optimization results usually improve over the first few weeks.",
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

const MetaAdsPage: React.FC = () => {
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
              <strong>Meta Ads</strong>
            </p>

            <h1 className={styles.heroTitle}>Meta Ads</h1>

            <h2 className={styles.heroSubtitle}>
              Drive Leads, Reach Customers, and Grow Faster with High-Performance
              Meta Advertising
            </h2>

            <p className={styles.heroDescription}>
              We create and manage result-driven Facebook and Instagram ad
              campaigns that help your business attract the right audience,
              generate quality leads, and improve your return on ad spend.
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

            <div className={styles.adPhoneMockup}>
              <div className={styles.phoneTop}></div>
              <div className={styles.phoneScreen}>
                <div className={styles.adBanner}></div>
                <div className={styles.adCard}></div>
                <div className={styles.adButton}></div>
              </div>
            </div>

            <div className={styles.floatBadgeOne}>📣</div>
            <div className={styles.floatBadgeTwo}>🎯</div>
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
          <h2 className={styles.sectionTitle}>Our Meta Ads Services</h2>
          <p className={styles.sectionSubtitle}>
            Smart Campaigns, Better Targeting, and Stronger Results Across
            Facebook & Instagram ✨
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
          <h2 className={styles.sectionTitle}>Meta Ads Pricing</h2>
          <p className={styles.sectionSubtitle}>
            Flexible ad management packages tailored to your business goals.
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
                  href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20get%20started%20with%20your%20Meta%20Ads%20services."
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
            Everything you may want to know before launching your Meta ad
            campaigns.
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
              <div className={styles.adsBoard}>
                <div className={styles.adsBoardTop}></div>
                <div className={styles.adsChart}></div>
                <div className={styles.adsRow}>
                  <div className={styles.adsMini}></div>
                  <div className={styles.adsMini}></div>
                </div>
              </div>

              <div className={styles.ctaBadgeOne}>🎯</div>
              <div className={styles.ctaBadgeTwo}>📈</div>
            </div>

            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Let&apos;s Launch High-Converting Meta Ads
              </h2>
              <p className={styles.ctaText}>
                Ready to grow with Facebook and Instagram ads? Contact our team
                for a free consultation and discover how our Meta ad strategies
                can help you reach the right audience and generate better
                results.
              </p>
              <a
                href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20schedule%20a%20free%20consultation%20for%20Meta%20Ads."
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

export default MetaAdsPage;