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
            <li><a href="#services">Social Media Marketing</a></li>
            <li><a href="#services">Google & Meta Ads</a></li>
            <li><a href="#services">Lead Generation</a></li>
            <li><a href="#services">Branding</a></li>
            <li><a href="#services">Website Development</a></li>
            <li><Link to="/verify">Verify Certificate</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/verify">Verify</a></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Contact</h4>
          <ul className="footer-links">
            <li>📧 hello@clickudaan.com</li>
            <li>📞 +91 85060 95853</li>
            <li>📍 Iconic Tower, Sector- 63, Noida, UP, India</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 ClickUdaan. All rights reserved.</p>
        <div className="footer-legal-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <span>|</span>
          <a href="/copyright-notice">Copyright Notice</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;