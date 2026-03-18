import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Portfolio.module.css';

import citySkylineImg from '../assets/city-skyline.png';
import aiAssistantImg from '../assets/ai-assistant.png';

import driveLeadGenImg from '../assets/driveleadgen.png';
import successRealtyImg from '../assets/successrealty.png';
import saasWaveImg from '../assets/saas-wave.png';
import epicCoffeeImg from '../assets/epiccoffee.png';
import nexFinanceImg from '../assets/nexfinance.png';
import localFitImg from '../assets/localfit.png';
import gammaTechImg from '../assets/gammatech.png';
import brandBoostImg from '../assets/brandboost.png';

// Project Data
const portfolioData = [
  { id: 1, title: 'DriveLeadGen', category: 'Digital Marketing', image: driveLeadGenImg },
  { id: 2, title: 'SuccessRealty', category: 'Web Development', image: successRealtyImg },
  { id: 3, title: 'SaaS-Wave', category: 'Advertising', image: saasWaveImg },
  { id: 4, title: 'EpicCoffee', category: 'Digital Marketing', image: epicCoffeeImg },
  { id: 5, title: 'NexFinance', category: 'Web Development', image: nexFinanceImg },
  { id: 6, title: 'LocalFit', category: 'Digital Marketing', image: localFitImg },
  { id: 7, title: 'GammaTech', category: 'Advertising', image: gammaTechImg },
  { id: 8, title: 'BrandBoost', category: 'Advertising', image: brandBoostImg },
];

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects =
    activeFilter === 'All'
      ? portfolioData
      : portfolioData.filter((p) => p.category === activeFilter);

  const categories = ['All', 'Digital Marketing', 'Web Development', 'Advertising'];

  return (
    <div className={styles.portfolioPage}>
      <section className={styles.hero}>
        <img src={citySkylineImg} alt="Skyline" className={styles.heroSkyline} />

        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <span className={styles.separator}>/</span>
            <span>Portfolio</span>
          </nav>

          <h1>Our Portfolio</h1>
          <p>See How We've Helped Businesses Succeed Online.</p>

          <div className={styles.filterBar}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeFilter === cat ? styles.activeBtn : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.heroImage}>
          <div className={styles.speechBubble}>Check out our work</div>
          <img
            src={aiAssistantImg}
            alt="Udaani Assistant"
            className={styles.character}
          />
        </div>
      </section>

      <main className={styles.portfolioGrid}>
        {filteredProjects.map((project) => (
          <div key={project.id} className={styles.portfolioCard}>
            <div className={styles.imagePlaceholder}>
              <img
                src={project.image}
                alt={project.title}
                className={styles.projectImage}
              />
            </div>
            <div className={styles.cardInfo}>
              <h3>{project.title}</h3>
              <p>{project.category}</p>
            </div>
          </div>
        ))}
      </main>

      <section className={styles.portfolioCta}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>
            Let’s Build Something Amazing Together 🚀
          </h2>

          <p className={styles.ctaText}>
            Inspired by our work? Let’s create a powerful digital presence for your business
            and turn your ideas into high-converting results.
          </p>

          <div className={styles.ctaButtons}>
            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaPrimary}
            >
              Start Your Project
            </a>

            <a href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20to%20build%20a%20project." className={styles.ctaSecondary}>
              Talk to Expert
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;