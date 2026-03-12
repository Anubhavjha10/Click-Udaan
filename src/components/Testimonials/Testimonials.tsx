import './Testimonials.css';

const testimonials = [
  {
    text: "ClickUdaan transformed our online presence completely. Our social media engagement grew by 300% in just 3 months!",
    name: "Anil Gupta",
    company: "TechStart Solutions",
    rating: 5,
  },
  {
    text: "The Google Ads campaign they managed delivered incredible ROAS. Best marketing investment we've ever made.",
    name: "Sneha Patel",
    company: "GreenLife Organics",
    rating: 5,
  },
  {
    text: "Professional, responsive, and result-oriented. ClickUdaan helped us generate 500+ leads per month consistently.",
    name: "Vikram Singh",
    company: "PropertyPrime Realty",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <h2 className="testimonials-title">What Our Clients Say</h2>
        <p className="testimonials-subtitle">Trusted by Businesses Across India</p>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-stars">
                {'★'.repeat(t.rating)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.name[0]}</div>
                <div>
                  <strong className="testimonial-name">{t.name}</strong>
                  <p className="testimonial-company">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
