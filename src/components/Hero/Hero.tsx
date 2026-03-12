import rocketImg from '@/assets/rocket.png';
import skylineImg from '@/assets/city-skyline.png';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={skylineImg} alt="City skyline" className="hero-skyline" />
        <div className="hero-clouds">
          <div className="cloud cloud-1" />
          <div className="cloud cloud-2" />
          <div className="cloud cloud-3" />
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-left">
          <h1 className="hero-title">Where Clicks Take Flight</h1>
          <p className="hero-subtitle">
            Boost Your Business with Expert Digital Marketing Solutions.
          </p>
          <div className="hero-buttons">
            <a href="#get-started" className="btn-yellow">Get Started</a>
            <a href="#services" className="btn-white">Our Services</a>
          </div>
        </div>

        <div className="hero-right">
          <img src={rocketImg} alt="Rocket launching" className="hero-rocket" />
          <div className="speech-bubble">May i help you?</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
