import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Contact.module.css';
import { MapPin, Mail, Phone, MessageCircle } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import citySkylineImg from '../assets/city-skyline.png';
import aiAssistantImg from '../assets/ai-assistant.png';

const availableServices = [
  'Social Media Marketing',
  'Google, Meta & Snapchat Ads',
  'SEO Optimization',
  'Website Development',
  'Graphic Designing',
  'Video Editing',
  'Application Development',
  'Whatsapp Bulk Marketing',
];

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'' | 'sending' | 'success' | 'error'>('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (phone.length < 10) {
      alert('Please enter a valid phone number with country code.');
      return;
    }

    setStatus('sending');

    const formData = new FormData(e.currentTarget);
    formData.append('phone', phone);

    try {
      const response = await fetch('https://formspree.io/f/xzdjaryl', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setStatus('success');
        setPhone('');
        (e.target as HTMLFormElement).reset();

        setTimeout(() => {
          setStatus('');
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className={styles.contactPage}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <img src={citySkylineImg} alt="Skyline" className={styles.heroSkyline} />

        <div className={styles.heroClouds}>
          <div className={`${styles.cloud} ${styles.cloud1}`}></div>
          <div className={`${styles.cloud} ${styles.cloud2}`}></div>
          <div className={`${styles.cloud} ${styles.cloud3}`}></div>
        </div>

        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <span className={styles.separator}>/</span>
            <span>Contact</span>
          </nav>
          <h1>Get in Touch with Us</h1>
          <p>We&apos;re here to help you grow your business. Reach out to ClickUdaan today!</p>
        </div>

        <div className={styles.heroImage}>
          <img src={aiAssistantImg} alt="Assistant" className={styles.character} />
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className={styles.container}>
        {/* Left Column */}
        <div className={styles.infoColumn}>
          <h2 className={styles.sectionTitle}>Contact Information</h2>

          <div className={styles.infoStack}>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Iconic+Tower+Sector+63+Noida+UP+India"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.infoCardLink}
            >
              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  <MapPin size={24} />
                </div>
                <div className={styles.cardContent}>
                  <h4>Address</h4>
                  <p>Iconic Tower, Sector-63, Noida, India</p>
                </div>
              </div>
            </a>

            <a href="mailto:hello@clickudaan.com" className={styles.infoCardLink}>
              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  <Mail size={24} />
                </div>
                <div className={styles.cardContent}>
                  <h4>Email</h4>
                  <p>hello@clickudaan.com</p>
                </div>
              </div>
            </a>

            <a href="tel:+918506095853" className={styles.infoCardLink}>
              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  <Phone size={24} />
                </div>
                <div className={styles.cardContent}>
                  <h4>Phone</h4>
                  <p>+91 85060 95853</p>
                </div>
              </div>
            </a>

            <a
              href="https://wa.me/918506095853?text=Hello%20ClickUdaan,%20I%20want%20a%20free%20strategy%20consultation%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.infoCardLink}
            >
              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  <MessageCircle size={24} />
                </div>
                <div className={styles.cardContent}>
                  <h4>Free Strategy Consultation</h4>
                  <p>Get expert guidance for business growth, leads, branding, and digital solutions.</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className={styles.formColumn}>
          <h2 className={styles.sectionTitle}>Contact Form</h2>

          <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Your Name</label>
                <input type="text" name="name" placeholder="Full Name" required />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Your Email</label>
                  <input type="email" name="email" placeholder="Email Address" required />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <PhoneInput
                    country={'in'}
                    value={phone}
                    onChange={(val) => setPhone(val)}
                    inputProps={{
                      name: 'phone',
                      required: true,
                    }}
                    containerClass={styles.phoneContainer}
                    inputClass={styles.phoneInput}
                    buttonClass={styles.phoneButton}
                    enableSearch={true}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Select Service</label>
                <select name="service" className={styles.formSelect} required defaultValue="">
                  <option value="" disabled>
                    Choose a service...
                  </option>
                  {availableServices.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Message</label>
                <textarea name="message" rows={5} placeholder="How can we help?" required></textarea>
              </div>

              <div className={styles.submitWrapper}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={status === 'sending' || status === 'success'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                {status === 'success' && (
                  <p className={styles.successMsg}>✅ Thanks! We will reach you shortly.</p>
                )}

                {status === 'error' && (
                  <p className={styles.errorMsg}>❌ Error! Please try again later.</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;