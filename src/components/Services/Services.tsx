import iconSocial from '@/assets/icon-social-media.png';
import iconGoogle from '@/assets/icon-google-meta.png';
import iconLead from '@/assets/icon-lead-gen.png';
import iconWeb from '@/assets/icon-web-dev.png';
import './Services.css';

const services = [
  { icon: iconSocial, title: 'Social Media Marketing' },
  { icon: iconGoogle, title: 'Google & Meta Ads' },
  { icon: iconLead, title: 'Lead Generation' },
  { icon: iconWeb, title: 'Website Development' },
];

const Services = () => {
  return (
    <section className="services" id="services">
      <div className="services-container">
        <h2 className="services-title">Our Services</h2>
        <p className="services-subtitle">Driving Your Digital Success</p>

        <div className="services-grid">
          {services.map((service) => (
            <div key={service.title} className="service-card">
              <div className="service-icon-wrapper">
                <img src={service.icon} alt={service.title} className="service-icon" />
              </div>
              <h3 className="service-name">{service.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
