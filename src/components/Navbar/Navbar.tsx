import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

  const serviceItems = [
    { icon: '📱', label: 'Social Media Marketing' },
    { icon: '🔍', label: 'Google & Meta Ads' },
    { icon: '🧲', label: 'Lead Generation' },
    { icon: '💡', label: 'Branding' },
    { icon: '💻', label: 'Website Development' },
  ];

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-icon">✈</span>
          <span className="logo-text">ClickUdaan</span>
        </div>

        <button
          className={`hamburger ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`navbar-menu ${mobileOpen ? 'open' : ''}`}>
          {['Home', 'Services', 'Portfolio', 'About Us', 'Contact Us'].map((item) => (
            <li
              key={item}
              className={`nav-item ${item === 'Services' ? 'has-dropdown' : ''} ${activeItem === item ? 'active' : ''}`}
              onClick={() => setActiveItem(item)}
            >
              <a href={`#${item.toLowerCase().replace(/\s/g, '-')}`}>
                {item}
                {item === 'Services' && <span className="dropdown-arrow">▾</span>}
              </a>
              {item === 'Services' && (
                <ul className="dropdown">
                  {serviceItems.map((s) => (
                    <li key={s.label} className="dropdown-item">
                      <span className="dropdown-icon">{s.icon}</span>
                      {s.label}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <a href="#get-started" className="navbar-cta">Get Started</a>
      </nav>
    </header>
  );
};

export default Navbar;
