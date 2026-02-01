import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Plans from './components/Plans';
import UseCases from './components/UseCases';
import FAQ from './components/FAQ';
import QuoteBuilder from './components/QuoteBuilder';
import Footer from './components/Footer';
import PaymentSuccess from './components/PaymentSuccess';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import ComingSoon from './components/ComingSoon';

// Check for stealth mode (coming soon page)
const isStealthMode = import.meta.env.VITE_STEALTH_MODE === 'true';

// Landing page with all sections
function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Plans />
      <UseCases />
      <FAQ />
      <QuoteBuilder />
    </>
  );
}

function App() {
  // In stealth mode, only show coming soon page
  if (isStealthMode) {
    return <ComingSoon />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<LandingPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;

