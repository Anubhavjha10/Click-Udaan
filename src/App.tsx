import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from './components/Footer/Footer.tsx';
import Home from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import SEOPage from "./pages/services/seo.tsx";
import SMOPage from "./pages/services/smo.tsx";
import CRMPage from "./pages/services/crm";
import Verify from "./verify";
import Careers from "./careers.tsx";
import Blog from "./blog.tsx";
import PrivacyPolicy from './PrivacyPolicy';
import CopyrightNotice from './CopyrightNotice';


import Navbar from "./components/Navbar/Navbar.tsx";
import Portfolio from './pages/Portfolio.tsx'; 
import Services from './pages/services/services.tsx'; // File path check kar lena
import WebDevPage from './pages/services/web-dev.tsx'; // File ka naam exact match hona chahiye
import AppDev from "./pages/services/app-dev.tsx";
import SocialMediaPage from "./pages/services/social-media.tsx";
import MetaAdsPage from "./pages/services/meta-ads.tsx";
import GoogleAdsPage from "./pages/services/google-ads.tsx";
import SnapchatAdsPage from "./pages/services/snapchat-ads.tsx";
import WhatsAppBulkMarketingPage from "./pages/services/whatsapp-bulk-marketing";
import VideoEditingPage from "./pages/services/video-editing";
import GraphicDesignPage from "./pages/services/graphic-designing";
import UGCContentPage from "./pages/services/ugc-content-creation";



const App = () => (
  <>
  
    {/* Navbar ko yahan rakha hai taaki ye har page par nazar aaye */}
    <Navbar /> 
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/copyright-notice" element={<CopyrightNotice />} />
      
      {/* Particular Service Pages */}
      <Route path="/services" element={<Services />} />
      <Route path="/pages/services/web-dev" element={<WebDevPage />} />
      <Route path="/pages/services/app-dev" element={<AppDev />} />
      <Route path="/pages/services/social-media" element={<SocialMediaPage />} />
      <Route path="/pages/services/meta-ads" element={<MetaAdsPage />} />
      <Route path="/pages/services/google-ads" element={<GoogleAdsPage />} />
      <Route path="/pages/services/snapchat-ads" element={<SnapchatAdsPage />} />
      <Route path="/pages/services/seo" element={<SEOPage />} />
      <Route path="/pages/services/smo" element={<SMOPage />} />
      <Route path="/pages/services/crm" element={<CRMPage />} />
      <Route path="/pages/services/whatsapp-bulk-marketing" element={<WhatsAppBulkMarketingPage />} />
      <Route path="/pages/services/video-editing" element={<VideoEditingPage />} />
      <Route path="/pages/services/graphic-designing" element={<GraphicDesignPage />} />
      <Route path="/pages/services/ugc-content-creation" element={<UGCContentPage />} />
      
      
      <Route path="*" element={<NotFound />} />
    </Routes>

    <Footer />
    </>
);

export default App;