import './Stats.css';

const stats = [
  { number: '150+', label: 'Projects Completed' },
  { number: '50+', label: 'Happy Clients' },
  { number: '10M+', label: 'Ad Spend Managed' },
  { number: '300%', label: 'Average ROI' },
];

const Stats = () => {
  return (
    <section className="stats">
      <div className="stats-container">
        {stats.map((s) => (
          <div key={s.label} className="stat-item">
            <span className="stat-number">{s.number}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
