import React, { useState } from "react";
import styles from "./socialmedia.module.css";

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
    icon: "📲",
    title: "Content Strategy",
    description:
      "Planned content calendars and creative strategies designed to grow your brand consistently.",
  },
  {
    icon: "🎨",
    title: "Creative Posts",
    description:
      "Eye-catching graphics, carousels, and social creatives that improve engagement and visibility.",
  },
  {
    icon: "📈",
    title: "Audience Growth",
    description:
      "Focused strategies to increase followers, reach, and interaction with the right target audience.",
  },
  {
    icon: "💬",
    title: "Brand Engagement",
    description:
      "Build stronger connections with your audience through regular posting and engagement-driven content.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter Social",
    tagline: "Perfect for small businesses",
    price: "₹6,999+",
    features: [
      "8 Posts Per Month",
      "Basic Content Calendar",
      "Profile Optimization",
      "Monthly Report",
    ],
  },
  {
    name: "Growth Social",
    tagline: "Ideal for growing brands",
    price: "₹11,999+",
    features: [
      "12 Posts Per Month",
      "Reels & Creatives",
      "Audience Growth Strategy",
      "Performance Tracking",
    ],
    highlighted: true,
  },
  {
    name: "Premium Social",
    tagline: "Best for active brand building",
    price: "₹18,999+",
    features: [
      "20 Posts Per Month",
      "Advanced Strategy",
      "Reels + Story Design",
      "Monthly Consultation",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "What platforms do you manage for social media marketing?",
    answer:
      "We mainly manage Instagram, Facebook, LinkedIn, and other relevant social platforms depending on your business goals.",
  },
  {
    question: "Do you create the post designs and captions?",
    answer:
      "Yes. We handle content ideas, captions, creative designs, and posting strategy as part of our social media marketing service.",
  },
  {
    question: "Can social media marketing help generate leads?",
    answer:
      "Yes. With the right strategy, social media helps increase reach, build trust, and generate quality inquiries and leads.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "Organic social media growth takes time, but with consistent strategy and creative execution, visible improvements can often be seen within a few weeks.",
  },
  {
    question: "Do you also manage reels and story content?",
    answer:
      "Yes. Depending on the package, we can create reels, story creatives, and campaign-focused content for better engagement.",
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

const SocialMediaPage: React.FC = () => {
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
              <strong>Social Media Marketing</strong>
            </p>

            <h1 className={styles.heroTitle}>Social Media Marketing</h1>

            <h2 className={styles.heroSubtitle}>
              Grow Your Brand Presence with Strategic, Creative Social Media
              Marketing
            </h2>

            <p className={styles.heroDescription}>
              We help businesses build a stronger online presence through
              engaging content, smart strategy, and consistent social media
              execution that attracts attention and drives growth.
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

            <div className={styles.phoneMockup}>
              <div className={styles.phoneTop}></div>
              <div className={styles.phoneScreen}>
                <div className={styles.postCardLarge}></div>
                <div className={styles.postCardSmall}></div>
                <div className={styles.postCardSmall}></div>
              </div>
            </div>

            <div className={styles.floatBadgeOne}>❤️</div>
            <div className={styles.floatBadgeTwo}>📣</div>
            <div className={styles.floatBadgeThree}>📊</div>

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
            Our Social Media Marketing Services
          </h2>
          <p className={styles.sectionSubtitle}>
            Building Reach, Engagement, and Brand Value Across Social Platforms
            ✨
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
          <h2 className={styles.sectionTitle}>
            Social Media Marketing Pricing
          </h2>
          <p className={styles.sectionSubtitle}>
            Flexible packages crafted for businesses at every stage of growth.
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
                  href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20get%20started%20with%20your%20social%20media%20marketing%20services."
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
            Everything you may want to know before starting your social media
            growth journey.
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
              <div className={styles.socialBoard}>
                <div className={styles.socialBoardTop}></div>
                <div className={styles.socialChart}></div>
                <div className={styles.socialCardRow}>
                  <div className={styles.socialMiniCard}></div>
                  <div className={styles.socialMiniCard}></div>
                </div>
              </div>

              <div className={styles.chatBubble}>💬</div>
              <div className={styles.likeBubble}>👍</div>
            </div>

            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Let&apos;s Grow Your Social Presence
              </h2>
              <p className={styles.ctaText}>
                Ready to grow your brand online? Contact our team for a free
                consultation and discover how our social media strategies can
                help you attract attention, build trust, and drive results.
              </p>
              <a
                href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20schedule%20a%20free%20consultation%20for%20social%20media%20marketing."
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

export default SocialMediaPage;