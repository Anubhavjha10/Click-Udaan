import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import Services from '@/components/Services/Services';
import AIAssistant from '@/components/AIAssistant/AIAssistant';
import SuccessStories from '@/components/SuccessStories/SuccessStories';

const Index = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <SuccessStories />
      <AIAssistant />
    </>
  );
};

export default Index;
