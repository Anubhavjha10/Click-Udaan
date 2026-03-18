import React from 'react';
import styles from './Legal.module.css';

const CopyrightNotice: React.FC = () => {
  return (
    <div className={styles.legalPage}>
      <div className={styles.legalContainer}>
        <h1>Copyright Notice</h1>
        <p className={styles.lastUpdated}>Last updated: 2026</p>

        <section>
          <h2>Ownership</h2>
          <p>
            All content available on the ClickUdaan website, including but not limited to text,
            graphics, branding elements, logos, icons, images, videos, layouts, designs, service
            descriptions, and website structure, is the property of ClickUdaan and/or its parent
            company, Vabit Digify Media Pvt. Ltd., unless otherwise stated.
          </p>
        </section>

        <section>
          <h2>Use of Website Content</h2>
          <p>
            You may view, access, and use the content on this website for informational and personal
            business reference purposes only. Any unauthorized copying, reproduction, redistribution,
            modification, republication, or commercial use of our content without prior written permission
            is strictly prohibited.
          </p>
        </section>

        <section>
          <h2>Trademarks and Branding</h2>
          <p>
            The ClickUdaan name, branding, visual identity, and associated materials may not be used,
            copied, or imitated without written approval. All related brand assets remain protected
            under applicable copyright and intellectual property laws.
          </p>
        </section>

        <section>
          <h2>Third-Party Content</h2>
          <p>
            Certain images, logos, icons, embedded media, or third-party assets used on the website
            may belong to their respective owners. Such content remains subject to the rights of its
            original owners and is used only where permitted.
          </p>
        </section>

        <section>
          <h2>Reporting Copyright Issues</h2>
          <p>
            If you believe that any content on this website infringes your copyright or intellectual
            property rights, please contact us with the relevant details so we can review and take
            appropriate action.
          </p>
        </section>

        <section>
          <h2>Legal Protection</h2>
          <p>
            Unauthorized use of any material from this website may result in legal action under
            applicable copyright, trademark, and intellectual property laws.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CopyrightNotice;