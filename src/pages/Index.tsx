import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import Services from '@/components/Services/Services';
import Stats from '@/components/Stats/Stats';
import SuccessStories from '@/components/SuccessStories/SuccessStories';
import AboutUs from '@/components/AboutUs/AboutUs';
import Testimonials from '@/components/Testimonials/Testimonials';
import ContactUs from '@/components/ContactUs/ContactUs';
import Footer from '@/components/Footer/Footer';
import AIAssistant from '@/components/AIAssistant/AIAssistant';

const Index = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Stats />
      <SuccessStories />
      <AboutUs />
      <Testimonials />
      <ContactUs />
      <Footer />
      <AIAssistant />
    </>
  );
};

export default Index;
