import React from 'react';
import styles from './Legal.module.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className={styles.legalPage}>
      <div className={styles.legalContainer}>
        <h1>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: 2026</p>

        <section>
          <h2>Who We Are</h2>
          <p>
            ClickUdaan is a digital marketing and creative solutions company operating under
            Vabit Digify Media Pvt. Ltd. Our website is designed to provide information about
            our services, showcase our work, and help businesses connect with us for digital growth solutions.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <p>
            When you contact us through forms, WhatsApp, email, or any inquiry method on our website,
            we may collect personal information such as your name, email address, phone number,
            company name, service interest, and message details.
          </p>
        </section>

        <section>
          <h2>Comments</h2>
          <p>
            If comments are enabled on our website, we may collect the data shown in the comments form,
            along with the visitor’s IP address and browser user agent string, to help detect spam
            and maintain website security.
          </p>
        </section>

        <section>
          <h2>Media</h2>
          <p>
            If you upload images or files to our website, please avoid uploading media that contains
            embedded location data (such as EXIF GPS), as visitors may be able to download and extract
            such information.
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            Our website may use cookies to improve user experience, analyze website performance,
            and remember certain preferences. Cookies may also be used for security, analytics,
            or temporary session handling.
          </p>
        </section>

        <section>
          <h2>Embedded Content from Other Websites</h2>
          <p>
            Some pages on our website may include embedded content such as videos, images, maps,
            or social media feeds. Embedded content from third-party websites behaves in the same
            way as if you visited those websites directly, and those websites may collect data,
            use cookies, and track your interaction.
          </p>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>
            We use the information collected to respond to inquiries, provide requested services,
            improve website performance, communicate with prospective clients, and deliver a better
            customer experience.
          </p>
        </section>

        <section>
          <h2>Who We Share Your Data With</h2>
          <p>
            We do not sell or trade your personal information. Your data may be shared only with
            trusted service providers or tools necessary for website operations, analytics, communication,
            spam protection, or legal compliance.
          </p>
        </section>

        <section>
          <h2>How Long We Retain Your Data</h2>
          <p>
            We retain submitted information for as long as necessary to respond to inquiries,
            manage client communication, comply with legal obligations, and maintain internal records.
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>
            You may request access to the personal information we hold about you, ask us to correct
            it, or request deletion where legally applicable. This does not include any data we are
            required to keep for administrative, legal, or security reasons.
          </p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We take reasonable measures to protect your information from unauthorized access, misuse,
            loss, or disclosure. However, no online transmission or storage method is completely secure.
          </p>
        </section>

        <section>
          <h2>Where Your Data Is Sent</h2>
          <p>
            Visitor inquiries, comments, or submissions may be checked through automated spam detection
            or third-party communication tools for security and service purposes.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, you may contact ClickUdaan through
            our website contact form, official email, or WhatsApp support.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;