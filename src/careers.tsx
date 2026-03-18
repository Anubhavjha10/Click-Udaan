import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Careers.module.css';

const Careers: React.FC = () => {
  const jobs = [
    {
      title: "Social Media Manager",
      type: "Full Time",
      location: "Remote / Noida",
      desc: "Manage client accounts, create content strategy, and handle social media growth."
    },
    {
      title: "Performance Marketer (Ads Expert)",
      type: "Full Time",
      location: "Remote",
      desc: "Run and optimize Meta & Google Ads campaigns to generate high-quality leads."
    },
    {
      title: "Web Developer",
      type: "Internship / Full Time",
      location: "Remote",
      desc: "Build modern websites using React, optimize UI/UX, and improve performance."
    },
    {
      title: "Graphic Designer",
      type: "Freelance / Part Time",
      location: "Remote",
      desc: "Design creatives for ads, social media, and branding projects."
    },
  ];

  return (
    <div className={styles.careersPage}>
      {/* HERO */}
      <section className={styles.hero}>
        <h1>Join ClickUdaan 🚀</h1>
        <p>Be part of a fast-growing digital agency and build impactful brands.</p>
      </section>

      {/* WHY JOIN US */}
      <section className={styles.whySection}>
        <h2>Why Work With Us?</h2>
        <div className={styles.whyGrid}>
          <div className={styles.whyCard}>🚀 Fast Growth Environment</div>
          <div className={styles.whyCard}>💡 Creative Freedom</div>
          <div className={styles.whyCard}>🌍 Remote Friendly</div>
          <div className={styles.whyCard}>📈 Real Projects Experience</div>
        </div>
      </section>

      {/* JOB LIST */}
      <section className={styles.jobsSection}>
        <h2>Open Positions</h2>

        <div className={styles.jobsGrid}>
          {jobs.map((job, index) => (
            <div key={index} className={styles.jobCard}>
              <h3>{job.title}</h3>
              <p className={styles.jobMeta}>{job.type} • {job.location}</p>
              <p className={styles.jobDesc}>{job.desc}</p>

              <a
                href={`https://wa.me/918506095853?text=Hello ClickUdaan, I want to apply for ${job.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.applyBtn}
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className={styles.processSection}>
        <h2>Hiring Process</h2>

        <div className={styles.processSteps}>
          <div>1️⃣ Apply</div>
          <div>2️⃣ Shortlisting</div>
          <div>3️⃣ Interview</div>
          <div>4️⃣ Final Selection</div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Didn't find your role?</h2>
        <p>Send your resume and we’ll reach out if there’s a match.</p>

        <a
          href="https://wa.me/918506095853?text=Hello ClickUdaan, I want to share my resume."
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
        >
          Send Resume
        </a>
      </section>
    </div>
  );
};

export default Careers;