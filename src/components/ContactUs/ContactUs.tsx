import { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitted(false);

    try {
      const response = await fetch('https://formspree.io/f/xzdjaryl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setForm({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
        });

        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setError(result?.errors?.[0]?.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div className="contact-info">
          <h2 className="contact-title">Get In Touch</h2>
          <p className="contact-subtitle">Ready to take your business to new heights?</p>
          <p className="contact-desc">
            Book a free consultation with our digital marketing experts.
            We&apos;ll analyze your current strategy and create a custom growth plan for your business.
          </p>

          <div className="contact-details">
            <div className="contact-detail">
              <span className="contact-icon">📧</span>
              <span>hello@clickudaan.com</span>
            </div>
            <div className="contact-detail">
              <span className="contact-icon">📞</span>
              <span>+91 85060 95853</span>
            </div>
            <div className="contact-detail">
              <span className="contact-icon">📍</span>
              <span>Iconic Tower, Sector-63, Noida, UP, India</span>
            </div>
          </div>

          <div className="contact-socials">
            <a
              href="https://www.instagram.com/clickudaan/"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/share/1AzKTrj6gD/"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://x.com/ClickUdaan"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
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
            <option value="Social Media Marketing">Social Media Marketing</option>
            <option value="Google & Meta  Ads">Google, Meta & Snapchat Ads</option>
            <option value="Lead Generation">SEO & SMO</option>
            <option value="Branding">CRM</option>
            <option value="Website Development">Website Development</option>
            <option value="Application Development">Application Development</option>
            <option value="Whatsapp Bulk Marketing">Whatsapp Bulk Marketing</option>
            <option value="Video Editing">Video Editing</option>
            <option value="Graphic Desigining">Graphic Desigining</option>
            <option value="UGC Content Creation">UGC Content Creation</option>
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

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? 'Sending...' : submitted ? '✓ Message Sent!' : 'Send Message'}
          </button>

          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default ContactUs;