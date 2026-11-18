import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollProgress from './components/fx/ScrollProgress';
import SmoothScroll from './components/cinema/SmoothScroll';

import { lazy, Suspense } from 'react';
import Home from './pages/Home';

// Other pages load on demand so the home page ships less JavaScript.
const Services = lazy(() => import('./pages/Services'));
const Approach = lazy(() => import('./pages/Approach'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Hackathon = lazy(() => import('./pages/Hackathon'));
const HackathonContribute = lazy(() => import('./pages/HackathonContribute'));
const HackathonAmbassadors = lazy(() => import('./pages/HackathonAmbassadors'));
const HackathonApply = lazy(() => import('./pages/HackathonApply'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/approach" element={<Approach />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/hackathon" element={<Hackathon />} />
        <Route path="/hackathon/contribute" element={<HackathonContribute />} />
        <Route path="/hackathon/ambassadors" element={<HackathonAmbassadors />} />
        <Route path="/hackathon/apply/:kind" element={<HackathonApply />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SmoothScroll />
      <ScrollProgress />

      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Header />

        <main id="main" className="min-h-screen">
          <AnimatedRoutes />
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
