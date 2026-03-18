import React, { useState } from "react";
import styles from "./videoediting.module.css";

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
    icon: "🎬",
    title: "Professional Editing",
    description:
      "Clean, engaging, and polished video editing tailored for brands, businesses, and promotional content.",
  },
  {
    icon: "✨",
    title: "Motion Graphics",
    description:
      "Add transitions, titles, animations, and visual effects that make your videos more dynamic and attractive.",
  },
  {
    icon: "📱",
    title: "Reels & Shorts",
    description:
      "Optimized editing for Instagram Reels, YouTube Shorts, and short-form social media content.",
  },
  {
    icon: "🎵",
    title: "Audio Enhancement",
    description:
      "Improve sound quality, sync music, and create a better viewing experience with refined audio editing.",
  },
];

const plans: PricingPlan[] = [
  {
    name: "Starter Editing",
    tagline: "Best for basic edits",
    price: "₹4,999+",
    features: [
      "Basic Video Editing",
      "Cuts & Transitions",
      "Text Overlays",
      "Export Ready Video",
    ],
  },
  {
    name: "Growth Editing",
    tagline: "Perfect for creators & brands",
    price: "₹9,999+",
    features: [
      "Advanced Editing",
      "Motion Graphics",
      "Reels/Shorts Editing",
      "Audio Enhancements",
    ],
    highlighted: true,
  },
  {
    name: "Premium Editing",
    tagline: "For high-impact video content",
    price: "₹17,999+",
    features: [
      "Full Creative Editing",
      "Advanced Motion Effects",
      "Brand Focused Output",
      "Priority Support",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "What type of videos do you edit?",
    answer:
      "We edit promotional videos, reels, shorts, social media content, business videos, and marketing creatives.",
  },
  {
    question: "Can you edit videos for Instagram Reels and YouTube Shorts?",
    answer:
      "Yes. We create optimized edits specifically for vertical short-form platforms like Reels and Shorts.",
  },
  {
    question: "Do you add transitions, text, and effects?",
    answer:
      "Yes. Depending on your requirement, we can add transitions, titles, effects, animations, and branding elements.",
  },
  {
    question: "Can you improve audio quality too?",
    answer:
      "Yes. We can enhance audio, sync music, adjust sound levels, and improve the overall audio experience.",
  },
  {
    question: "Do you provide branded editing for business content?",
    answer:
      "Absolutely. We can edit videos aligned with your brand style for professional marketing and promotional use.",
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

const VideoEditingPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <p className={styles.breadcrumb}>
              Home / Services / <strong>Video Editing</strong>
            </p>

            <h1 className={styles.heroTitle}>Video Editing</h1>

            <h2 className={styles.heroSubtitle}>
              Turn Raw Footage into Engaging, Professional Videos that Capture
              Attention
            </h2>

            <p className={styles.heroDescription}>
              We help brands and businesses create polished, creative, and
              high-quality video content through smart editing, motion graphics,
              audio refinement, and platform-focused video optimization.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.dashboard}></div>
            <div className={styles.phone}></div>
            <div className={styles.badge1}>🎬</div>
            <div className={styles.badge2}>✨</div>
            <div className={styles.rocket}>🚀</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>Our Video Editing Services</h2>
        <p className={styles.subtitle}>
          Creative Editing that Makes Your Content Stand Out ✨
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
        <h2 className={styles.title}>Video Editing Pricing</h2>
        <p className={styles.subtitle}>
          Flexible video editing packages for creators, brands, and businesses
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
                href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20Video%20Editing%20service."
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
        <h2>Create Videos that Actually Impress</h2>
        <p>
          Let&apos;s edit your content into powerful, scroll-stopping videos
          that boost engagement and strengthen your brand presence.
        </p>

        <a
          href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20start%20Video%20Editing%20services."
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

export default VideoEditingPage;