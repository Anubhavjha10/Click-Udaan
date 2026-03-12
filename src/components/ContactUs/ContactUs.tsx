import { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', phone: '', service: '', message: '' });
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div className="contact-info">
          <h2 className="contact-title">Get In Touch</h2>
          <p className="contact-subtitle">Ready to take your business to new heights?</p>
          <p className="contact-desc">
            Book a free consultation with our digital marketing experts. 
            We'll analyze your current strategy and create a custom growth plan for your business.
          </p>
          <div className="contact-details">
            <div className="contact-detail">
              <span className="contact-icon">📧</span>
              <span>hello@clickudaan.com</span>
            </div>
            <div className="contact-detail">
              <span className="contact-icon">📞</span>
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-detail">
              <span className="contact-icon">📍</span>
              <span>Mumbai, India</span>
            </div>
          </div>
          <div className="contact-socials">
            <a href="#" className="social-link">LinkedIn</a>
            <a href="#" className="social-link">Instagram</a>
            <a href="#" className="social-link">Facebook</a>
            <a href="#" className="social-link">Twitter</a>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3 className="form-heading">Send Us a Message</h3>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="form-input"
          />
          <div className="form-row">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="form-input"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">Select a Service</option>
            <option>Social Media Marketing</option>
            <option>Google & Meta Ads</option>
            <option>Lead Generation</option>
            <option>Branding</option>
            <option>Website Development</option>
          </select>
          <textarea
            name="message"
            placeholder="Tell us about your project..."
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="form-input form-textarea"
            required
          />
          <button type="submit" className="form-submit">
            {submitted ? '✓ Message Sent!' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
