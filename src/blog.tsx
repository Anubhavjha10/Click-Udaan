import React, { useState } from 'react';
import styles from './blog.module.css';

const Blog: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const blogs = [
    {
      title: "How Digital Marketing Can 10x Your Business",
      preview: "Learn how smart strategies can scale your brand rapidly.",
      content: "Digital marketing is the backbone of modern businesses. With the right combination of SEO, social media, and paid ads, you can generate consistent leads and build a strong brand presence. ClickUdaan helps businesses achieve measurable growth through data-driven campaigns."
    },
    {
      title: "Why Every Business Needs a Website in 2026",
      preview: "Your website is your digital identity.",
      content: "A professional website builds trust and credibility. It acts as a 24/7 sales machine that converts visitors into customers. Without a website, you are losing potential leads every single day. ClickUdaan builds high-converting websites tailored to your business."
    },
    {
      title: "Meta Ads vs Google Ads – Which is Better?",
      preview: "Understand the difference and choose the right platform.",
      content: "Meta Ads are great for brand awareness and targeting interests, while Google Ads capture high-intent users actively searching. The best strategy is a combination of both. ClickUdaan helps you balance both channels for maximum ROI."
    },
    {
      title: "Top 5 Mistakes Businesses Make in Marketing",
      preview: "Avoid these common mistakes to grow faster.",
      content: "Most businesses fail due to lack of strategy, poor targeting, inconsistent branding, and no data tracking. Fixing these issues can dramatically improve results. ClickUdaan ensures optimized campaigns that actually convert."
    },
    {
      title: "Power of WhatsApp Marketing in 2026",
      preview: "Reach your customers directly and instantly.",
      content: "WhatsApp marketing allows businesses to connect with customers personally. With high open rates and direct communication, it’s one of the most powerful tools today. ClickUdaan provides bulk WhatsApp marketing solutions to scale outreach."
    }
  ];

  const toggleBlog = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.blogPage}>
      <section className={styles.hero}>
        <h1>Our Blogs 📚</h1>
        <p>Insights, strategies & tips to grow your business online.</p>
      </section>

      <div className={styles.blogContainer}>
        {blogs.map((blog, index) => (
          <div key={index} className={styles.blogCard}>
            
            <div onClick={() => toggleBlog(index)} className={styles.blogHeader}>
              <h3>{blog.title}</h3>
              <span>{activeIndex === index ? "−" : "+"}</span>
            </div>

            <p className={styles.preview}>{blog.preview}</p>

            {activeIndex === index && (
              <div className={styles.fullContent}>
                <p>{blog.content}</p>

                <a
                  href="https://wa.me/918506095853?text=Hello ClickUdaan, I want to grow my business."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaBtn}
                >
                  Get Help from ClickUdaan 🚀
                </a>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;