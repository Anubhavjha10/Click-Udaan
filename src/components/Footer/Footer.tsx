import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3 className="footer-logo">
            <span className="footer-logo-icon">✈</span> ClickUdaan
          </h3>
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
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Contact</h4>
          <ul className="footer-links">
            <li>📧 hello@clickudaan.com</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 Mumbai, India</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 ClickUdaan. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
