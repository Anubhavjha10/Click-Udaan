import portfolioSocial from '@/assets/portfolio-social.jpg';
import portfolioAds from '@/assets/portfolio-ads.jpg';
import portfolioWeb from '@/assets/portfolio-web.jpg';
import portfolioLead from '@/assets/portfolio-lead.jpg';
import successBg from '@/assets/success-bg.png';
import './SuccessStories.css';
import { Link } from 'react-router-dom';

const projects = [
  { img: portfolioSocial, title: 'Social Media Campaign', client: 'Fashion Brand', result: '225% Engagement Increase' },
  { img: portfolioAds, title: 'Google Ads Optimization', client: 'SaaS Startup', result: '3.5x ROAS Achieved' },
  { img: portfolioWeb, title: 'E-Commerce Website', client: 'Retail Business', result: '180% Sales Growth' },
  { img: portfolioLead, title: 'Lead Gen Funnel', client: 'Real Estate Firm', result: '500+ Qualified Leads/mo' },
];

const SuccessStories = () => {
  return (
    <section className="success" id="portfolio">
      <div className="success-container">
        <h2 className="success-title">Success Stories</h2>
        <p className="success-subtitle">Our Results Speak for Themselves</p>

        <div className="portfolio-grid">
          {projects.map((p) => (
            <div key={p.title} className="portfolio-card">
              <div className="portfolio-img-wrapper">
                <img src={p.img} alt={p.title} className="portfolio-img" />
                <div className="portfolio-overlay">
                  <span className="portfolio-result">{p.result}</span>
                </div>
              </div>
              <div className="portfolio-info">
                <h3 className="portfolio-name">{p.title}</h3>
                <p className="portfolio-client">{p.client}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="success-cta">
          <Link to="/portfolio" className='btn-portfolio'>View Full Portfolio</Link>
            {/* <a href="/Portfolio" className="btn-portfolio">View Full Portfolio</a> */}
        </div>
      </div>

      <div className="success-bg-wrapper">
        <img src={successBg} alt="" className="success-bg-img" />
      </div>
    </section>
  );
};

export default SuccessStories;
