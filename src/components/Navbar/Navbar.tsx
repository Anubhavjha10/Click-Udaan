import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

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
import myLogo from "../../assets/my-logo.png"

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const [servicesOpen, setServicesOpen] = useState(false);

  const serviceItems = [
    { icon: SocialIcon, label: 'Social Media Marketing', path: '/pages/services/social-media' },
    { icon: MetaIcon, label: 'Meta Ads', path: '/pages/services/meta-ads' },
    { icon: GoogleIcon, label: 'Google Ads', path: '/pages/services/google-ads' },
    { icon: SnapIcon, label: 'Snapchat Ads', path: '/pages/services/snapchat-ads' },
    { icon: SEO, label: 'SEO', path: '/pages/services/seo' },
    { icon: SMO, label: 'SMO', path: '/pages/services/smo' },
    { icon: CRM, label: 'CRM', path: '/pages/services/crm' },
    { icon: WebIcon, label: 'Website Development', path: '/pages/services/web-dev' },
    { icon: AppIcon, label: 'Application Development', path: '/pages/services/app-dev' },
    { icon: WhatsIcon, label: 'Whatsapp Bulk Marketing', path: '/pages/services/whatsapp-bulk-marketing' },
    { icon: VideoIcon, label: 'Video Editing', path: '/pages/services/video-editing' },
    { icon: GraphicIcon, label: 'Graphic Desigining', path: '/pages/services/graphic-designing' },
    { icon: UGCIcon, label: 'UGC Content Creation', path: '/pages/services/ugc-content-creation' },
  ];

  const handleNavClick = (itemName: string) => {
    setActiveItem(itemName);
    setMobileOpen(false);
    if (itemName !== 'Services') {
      setServicesOpen(false);
    }
  };

  const handleServiceToggle = (e: React.MouseEvent) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setServicesOpen((prev) => !prev);
    }
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <Link
          to="/"
          className="navbar-logo"
          onClick={() => handleNavClick('Home')}
        >
          <div className="logo-wrapper">
            <img src={myLogo} alt="ClickUdaan Logo" className="logo-image" />
          </div>
          <span className="logo-text">Clickउड़ान</span>
        </Link>

        <button
          className={`hamburger ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`navbar-menu ${mobileOpen ? 'open' : ''}`}>
          {[
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: 'Portfolio', path: '/portfolio' },
            { name: 'About Us', path: '/about' },
            { name: 'Contact Us', path: '/contact' }
          ].map((item) => (
            <li
              key={item.name}
              className={`nav-item ${item.name === 'Services' ? 'has-dropdown' : ''} ${activeItem === item.name ? 'active' : ''} ${item.name === 'Services' && servicesOpen ? 'dropdown-open' : ''}`}
            >
              {item.name === 'Services' ? (
                <>
                  <Link
                    to={item.path}
                    onClick={handleServiceToggle}
                  >
                    {item.name}
                    <span className={`dropdown-arrow ${servicesOpen ? 'rotate' : ''}`}>▾</span>
                  </Link>

                  <ul className={`dropdown ${servicesOpen ? 'show-mobile-dropdown' : ''}`}>
                    {serviceItems.map((s) => (
                      <li key={s.label} className="dropdown-item">
                        <Link
                          to={s.path}
                          className="dropdown-link"
                          onClick={() => {
                            setMobileOpen(false);
                            setServicesOpen(false);
                            setActiveItem('Services');
                          }}
                        >
                          <img src={s.icon} alt={s.label} className="nav-dropdown-img" />
                          <span className="label-text">{s.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => handleNavClick(item.name)}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <Link to="/contact" className="navbar-cta">Get Started</Link>
      </nav>
    </header>
  );
};

export default Navbar;