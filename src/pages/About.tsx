import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AboutUs.module.css';
import teamImg from '@/assets/Team.png';
import udaaniImg from '@/assets/ai-assistant.png';
import logo from "@/assets/vabit-logo.png";
import { ChevronDown, ChevronUp, Check, Rocket } from 'lucide-react';

// Premium FAQ Component with Smooth Animation
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`${styles.faqItem} ${isOpen ? styles.activeFaq : ''}`}>
      <div className={styles.faqQuestion} onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <div className={styles.faqIconBox}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      <div className={`${styles.faqAnswerWrapper} ${isOpen ? styles.showAnswer : ''}`}>
        <div className={styles.faqAnswer}>
          {answer}
        </div>
      </div>
    </div>
  );
};

const AboutUs: React.FC = () => {
  return (
    <div className={styles.aboutPage}>
      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <img src="/src/assets/city-skyline.png" alt="Skyline" className={styles.heroSkyline} />
        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link> <span className={styles.separator}>/</span> <span>About Us</span>
          </nav>
          <h1>Who We Are</h1>
          <h2 className={styles.heroSub}>Your Digital Marketing Success Partners.</h2>
          <p>
            At ClickUdaan, we’re passionate about helping businesses thrive in the digital world. 
            Discover our mission, vision, and values below.
          </p>
        </div>
        <div className={styles.heroImageContainer}>
           <img src= {teamImg} alt="Team" className={styles.teamImg} />
           <img src= {udaaniImg} alt="Udaani" className={styles.character} />
        </div>
      </section>

      {/* 2. MISSION VISION VALUES */}
      <section className={styles.mvvSection}>
        <div className={styles.card}>
          <span className={styles.cardIcon}>🎯</span>
          <h3>Our Mission</h3>
          <p>To deliver impactful digital marketing strategies that drive growth and results for our clients.</p>
        </div>
        <div className={styles.card}>
          <span className={styles.cardIcon}>🔭</span>
          <h3>Our Vision</h3>
          <p>To be the leading digital marketing partner for businesses of all sizes, helping them achieve their online potential.</p>
        </div>
        <div className={styles.card}>
          <span className={styles.cardIcon}>🛡️</span>
          <h3>Our Values</h3>
          <p>Excellence, Transparency, Innovation, and Client Success drive everything we do.</p>
        </div>
      </section>

      {/* 3. BRAND CONNECTION SECTION */}
      <section className={styles.brandConnection}>
        <div className={styles.brandBgDecor}>
          <div className={styles.cloudLeft}></div>
          <div className={styles.cloudRight}></div>
          <img src="/src/assets/city-skyline.png" className={styles.bgSkylineIllustration} alt="" />
        </div>

        <div className={styles.brandWrapper}>
          <header className={styles.brandHeader}>
            <h2>Our Brand Connection</h2>
            <p>ClickUdaan operates as a sub-brand of Vabit Digify Media Pvt. Ltd.</p>
          </header>

          <div className={styles.visualMainContainer}>
            <div className={styles.decorVisuals}>
              <img src="https://illustrations.popsy.co/white/team-work.svg" className={styles.teamGroup} alt="" />
              <img src="/src/assets/ai-assistant.png" className={styles.assistantMascot} alt="" />
            </div>

            <div className={styles.cardsConnectionRow}>
              <div className={styles.parentBrandCard}>
                <div className={styles.parentTitleBox}>
                  <div className={styles.parentLogo}>
                    <img src={logo} alt="Vabit Digify Media Logo" className={styles.logoImage} />
                  </div>
                  <a 
                    href="https://vabitdigify.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.companyLink}
                  >
                    <h3>Vabit Digify Media Pvt. Ltd.</h3>
                  </a>
                </div>
                
                <ul className={styles.perksList}>
                  <li>
                    <span className={styles.checkIcon}>✔</span>
                    <p><strong>ClickUdaan</strong> is proudly powered by <strong>Vabit Digify Media Pvt. Ltd.</strong></p>
                  </li>
                  <li>
                    <span className={styles.checkIcon}>✔</span>
                    <p>Under Vabit Digify Media, we focus on <strong>innovative</strong>, effective digital marketing solutions.</p>
                  </li>
                  <li>
                    <span className={styles.checkIcon}>✔</span>
                    <p>Our foundation ensures <strong>reliability</strong>, trust, and professional growth.</p>
                  </li>
                </ul>
              </div>

              <div className={styles.arrowConnector}>
                <svg width="120" height="60" viewBox="0 0 120 60">
                  <path d="M10 50 Q 60 10 110 10" fill="none" stroke="#F4C21D" strokeWidth="2" strokeDasharray="6,6" />
                  <path d="M105 15 L112 10 L105 5" fill="none" stroke="#F4C21D" strokeWidth="2" />
                </svg>
              </div>

              <div className={styles.childBrandCard}>
                <div className={styles.childHeader}>
                   <Rocket size={26} className={styles.rocketIcon} />
                   <h3>ClickUdaan</h3>
                </div>
                <p>
                  As a growing digital marketing brand under <strong>Vabit Digify Media</strong>, 
                  ClickUdaan drives fresh marketing, branding, and online growth solutions.
                </p>
              </div>
            </div>
          </div>

          <footer className={styles.brandFooter}>
            <h4>Combining <strong>Innovation</strong> & <strong>Expertise</strong> to Drive Your Business Growth</h4>
            <div className={styles.starsDivider}>
              <span>Innovation</span> • <span>Trust</span> • <span>Expertise</span>
            </div>
          </footer>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <center><h2>Frequently Asked Questions</h2>
          <p>Everything you may want to know about ClickUdaan.</p></center>
        </div>
        <div className={styles.faqList}>
          <FAQItem 
            question="What is ClickUdaan?" 
            answer="ClickUdaan is a digital marketing brand focused on helping businesses grow online through data-driven strategies." 
          />
          <FAQItem 
            question="Is ClickUdaan an independent company?" 
            answer="ClickUdaan operates as a sub-brand under Vabit Digify Media Pvt. Ltd., benefiting from its strong professional foundation." 
          />
          <FAQItem 
            question="What services do you provide?" 
            answer="We offer Social Media Marketing, SEO, Website Development, and Lead Generation tailored for your business." 
          />
        </div>
      </section>
    </div>
  );
};

export default AboutUs;