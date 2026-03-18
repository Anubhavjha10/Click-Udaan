import './Footer.css';
import { Link } from "react-router-dom";
import logoImg from '../../assets/my-logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          
          <div className="footer-logo">
            <img src={logoImg} alt="ClickUdaan Logo" className="footer-logo-img" />
            <span className="footer-logo-text">ClickUdaan</span>
          </div>

          <p className="footer-tagline">Where Clicks Take Flight</p>
          <p className="footer-desc">
            Your trusted partner for digital marketing excellence. 
            Helping businesses grow through innovative strategies and data-driven solutions.
          </p>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Services</h4>
          <ul className="footer-links">
            <li><Link to="/pages/services/social-media">Social Media Marketing</Link></li>
            <li><Link to="/pages/services/meta-ads">Meta Ads</Link></li>
            <li><Link to="/pages/services/seo">SEO</Link></li>
            <li><Link to="/pages/services/graphic-designing">Graphic Designing</Link></li>
            <li><Link to="/pages/services/web-dev">Website Development</Link></li>
            <li><Link to="/pages/services/whatsapp-bulk-marketing">WhatsApp Bulk Marketing</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            <li>
              <Link to="/about">About Us</Link>
              </li>
            <li>
              <Link to="/portfolio">Portfolio</Link>
              </li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/verify">Verify</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Contact</h4>
          <ul className="footer-links">
            <a href="mailto:hello@clickudaan.com">📧 hello@clickudaan.com</a>
            {/* <li>📞 +91 85060 95853</li> */}
            <a href="tel:+918506095853">📞 +91 85060 95853</a>
            <a href="https://maps.app.goo.gl/aNkYHFFp9rypmerc7" target='_blank'>📍 Iconic Tower, Sector- 63, Noida, UP, India</a>
            {/* <li>📍 Iconic Tower, Sector- 63, Noida, UP, India</li> */}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 ClickUdaan. All rights reserved.</p>
        <div className="footer-legal-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          {/* <a href="/privacy-policy">Privacy Policy</a> */}
          <span>|</span>
          {/* <a href="/copyright-notice">Copyright Notice</a> */}
          <Link to="/copyright-notice">Copyright Notice</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;