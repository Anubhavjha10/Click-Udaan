import successBg from '@/assets/success-bg.png';
import './SuccessStories.css';

const SuccessStories = () => {
  return (
    <section className="success" id="portfolio">
      <div className="success-container">
        <div className="success-content">
          <h2 className="success-title">Success Stories</h2>
          <p className="success-subtitle">Our Results Speak for Themselves</p>
          <a href="#portfolio" className="btn-portfolio">View Portfolio</a>
        </div>
      </div>
      <div className="success-bg-wrapper">
        <img src={successBg} alt="Success cityscape" className="success-bg-img" />
      </div>
    </section>
  );
};

export default SuccessStories;
