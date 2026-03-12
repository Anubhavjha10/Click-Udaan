import team1 from '@/assets/team-1.jpg';
import team2 from '@/assets/team-2.jpg';
import team3 from '@/assets/team-3.jpg';
import './AboutUs.css';

const team = [
  { img: team1, name: 'Rajesh Kumar', role: 'Founder & CEO' },
  { img: team2, name: 'Priya Sharma', role: 'Head of Marketing' },
  { img: team3, name: 'Amit Verma', role: 'Creative Director' },
];

const AboutUs = () => {
  return (
    <section className="about" id="about-us">
      <div className="about-container">
        <div className="about-text">
          <h2 className="about-title">About ClickUdaan</h2>
          <p className="about-subtitle">Your Growth Partner in the Digital World</p>
          <p className="about-desc">
            At ClickUdaan, we believe every business deserves to soar. Founded with a passion for 
            digital excellence, we help brands take flight with data-driven marketing strategies, 
            creative campaigns, and cutting-edge technology. From startups to established enterprises, 
            we've helped 50+ clients achieve extraordinary growth through expert digital marketing solutions.
          </p>
          <div className="about-highlights">
            <div className="highlight">
              <span className="highlight-icon">🎯</span>
              <div>
                <strong>Data-Driven</strong>
                <p>Every strategy backed by analytics</p>
              </div>
            </div>
            <div className="highlight">
              <span className="highlight-icon">🚀</span>
              <div>
                <strong>Result-Oriented</strong>
                <p>Focused on ROI and growth</p>
              </div>
            </div>
            <div className="highlight">
              <span className="highlight-icon">🤝</span>
              <div>
                <strong>Dedicated Support</strong>
                <p>Personal account manager for every client</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-team">
          <h3 className="team-heading">Meet Our Team</h3>
          <div className="team-grid">
            {team.map((m) => (
              <div key={m.name} className="team-card">
                <img src={m.img} alt={m.name} className="team-img" />
                <h4 className="team-name">{m.name}</h4>
                <p className="team-role">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
