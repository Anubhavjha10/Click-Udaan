import team1 from '@/assets/team-1.jpg';
import team2 from '@/assets/team-2.jpg';
import team3 from '@/assets/team-3.jpg';
import './AboutUs.css';
import { usePublicTeam } from '../../hooks/useTeam';

const AboutUs = () => {
  const { members, loading, error } = usePublicTeam();

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
          {loading && (
            <p className="text-sm text-slate-400 py-4">Loading team members...</p>
          )}
          {!loading && error && (
            <p className="text-xs text-rose-500 py-4 font-mono">Unable to load team: {error}</p>
          )}
          {!loading && !error && members.length === 0 && (
            <p className="text-sm text-slate-400 py-4">No team members currently active.</p>
          )}
          {!loading && members.length > 0 && (
            <div className="team-grid">
              {members.map((m: any) => (
                <div key={m.id || m.name} className="team-card">
                  {m.imageUrl && (
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-amber-400">
                      <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <span className="team-badge">ClickUdaan Team</span>
                  <h4 className="team-name">{m.name}</h4>
                  <p className="team-role">{m.designation || m.role}</p>
                  <p className="team-desc">{m.description || m.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
