import React from 'react';
import { Link } from 'react-router-dom';
import styles from './services.module.css';

// 1. Apne Flaticon se download kiye huye images yahan import karein
// Note: Path check kar lena apne folder structure ke hisaab se
import SocialIcon from '../../assets/social-media.png';
import MetaIcon from '../../assets/meta.png';
import GoogleIcon from '../../assets/google-ads.png';
import SEO from '../../assets/seo.png';
import SMO from '../../assets/smo.png';
import CRM from '../../assets/crm.png';
import WebIcon from '../../assets/web-dev.png';
import SnapIcon from '../../assets/snapchat.png';
import AppIcon from '../../assets/app-dev.png';
import WhatsIcon from '../../assets/whatsapp.png';
import VideoIcon from '../../assets/video-edit.png';
import GraphicIcon from '../../assets/Graphic-design.png';
import UGCIcon from '../../assets/ugc.png';

interface ServiceCardProps {
  icon: string; // Ab ye image path (string) lega
  title: string;
  description: string;
  path: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, path }) => (
  <Link to={path} className={styles.cardLink}>
    <div className={styles.serviceCard}>
      <div className={styles.iconWrapper}>
        <img src={icon} alt={title} className={styles.serviceIconImg} />
      </div>
      <div className={styles.cardContent}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  </Link>
);

const Services: React.FC = () => {
  const services = [
  {
    icon: WebIcon,
    title: "Website Development",
    description: "Get a custom, high-performance website designed to convert visitors into customers.",
    path: "/pages/services/web-dev"
  },
  {
    icon: AppIcon,
    title: "Application Development",
    description: "Build powerful mobile apps that enhance user experience and accelerate business growth.",
    path: "/pages/services/app-dev"
  },
  {
    icon: SocialIcon,
    title: "Social Media Marketing",
    description: "Grow your brand's presence on social media with targeted content and engagement.",
    path: "/pages/services/social-media"
  },
  {
    icon: MetaIcon,
    title: "Meta Ads",
    description: "Run effective ad campaigns on Facebook and Instagram for maximum reach and results.",
    path: "/pages/services/meta-ads"
  },
  {
    icon: GoogleIcon,
    title: "Google Ads",
    description: "Get your business seen on Google with targeted pay-per-click (PPC) advertising.",
    path: "/pages/services/google-ads"
  },
  {
    icon: SnapIcon,
    title: "Snapchat Ads",
    description: "Get your business seen on Snapchat with targeted ads.",
    path: "/pages/services/snapchat-ads"
  },
  {
    icon: SEO,
    title: "SEO",
    description: "Increase online visibility and organic traffic.",
    path: "/pages/services/seo"
  },
  {
    icon: SMO,
    title: "SMO",
    description: "Strengthen your brand with social media optimization.",
    path: "/pages/services/smo"
  },
  {
    icon: CRM,
    title: "CRM",
    description: "Manage customers and automate workflows.",
    path: "/pages/services/crm"
  },
  {
    icon: WhatsIcon,
    title: "Whatsapp Bulk Marketing",
    description: "Reach thousands instantly with WhatsApp campaigns.",
    path: "/pages/services/whatsapp-bulk-marketing"
  },
  {
    icon: VideoIcon,
    title: "Video Editing",
    description: "Create engaging and professional videos.",
    path: "/pages/services/video-editing"
  },
  {
    icon: GraphicIcon,
    title: "Graphic Desgining",
    description: "Professional design services for your brand.",
    path: "/pages/services/graphic-designing"
  },
  {
    icon: UGCIcon,
    title: "UGC Content Creation",
    description: "Boost trust with user-generated content.",
    path: "/pages/services/ugc-content-creation"
  },
];

  return (
    <div className={styles.servicesPage}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <img 
          src="/src/assets/city-skyline.png" 
          alt="Skyline" 
          className={styles.heroSkyline} 
        />
        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link> <span className={styles.separator}>/</span> <span>Services</span>
          </nav>
          <h1>Our Services</h1>
          <h2>Empowering Your Business with Cutting-Edge Digital Marketing Solutions</h2>
          <p>
            We offer a range of services to boost your online presence, attract 
            customers, and drive growth. Explore what we can do for you!
          </p>
        </div>
        <div className={styles.heroImageContainer}>
          <img 
            src="/src/assets/ai-assistant.png" 
            alt="Udaani Mascot" 
            className={styles.mascotImg} 
          />
        </div>
      </section>

      {/* SERVICES GRID */}
      <main className={styles.gridSection}>
        {services.map((service, index) => (
          <ServiceCard 
            key={index} 
            icon={service.icon} 
            title={service.title} 
            description={service.description} 
            path={service.path}
          />
        ))}
      </main>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <h2>Ready to Elevate Your Business?</h2>
        <p>Contact us today to discuss your unique needs and goals.</p>
        <button 
          className={styles.ctaButton}
          onClick={() => window.location.href = '/contact'}
        >
          Get Free Consultation
        </button>
      </section>
    </div>
  );
};

export default Services;