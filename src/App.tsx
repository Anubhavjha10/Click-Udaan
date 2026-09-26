import { Route, Routes, useLocation } from "react-router-dom";
import Footer from './components/Footer/Footer';
import Home from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SEOPage from "./pages/services/seo";
import SMOPage from "./pages/services/smo";
import CRMPage from "./pages/services/crm";
import Verify from "./verify";
import StudentPortal from "./pages/StudentPortal";
import Careers from "./careers";
import Blog from "./blog";
import PrivacyPolicy from './PrivacyPolicy';
import CopyrightNotice from './CopyrightNotice';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

import Navbar from "./components/Navbar/Navbar";
import Portfolio from './pages/Portfolio'; 
import Services from './pages/services/services';
import WebDevPage from './pages/services/web-dev';
import AppDev from "./pages/services/app-dev";
import SocialMediaPage from "./pages/services/social-media";
import MetaAdsPage from "./pages/services/meta-ads";
import GoogleAdsPage from "./pages/services/google-ads";
import SnapchatAdsPage from "./pages/services/snapchat-ads";
import WhatsAppBulkMarketingPage from "./pages/services/whatsapp-bulk-marketing";
import VideoEditingPage from "./pages/services/video-editing";
import GraphicDesignPage from "./pages/services/graphic-designing";
import UGCContentPage from "./pages/services/ugc-content-creation";

// Admin CMS Components
import { AuthProvider } from "./context/AuthContext";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCertificatesList from "./pages/admin/AdminCertificatesList";
import AdminCertificateForm from "./pages/admin/AdminCertificateForm";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminSettings from "./pages/admin/AdminSettings";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/student" element={<StudentPortal />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/copyright-notice" element={<CopyrightNotice />} />

        {/* Services Pages */}
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

        {/* Admin CMS Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="certificates" element={<AdminCertificatesList />} />
          <Route path="certificates/new" element={<AdminCertificateForm />} />
          <Route path="certificates/:id" element={<AdminCertificateForm />} />
          <Route path="students" element={<AdminCertificatesList />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </AuthProvider>
  );
};

export default App;