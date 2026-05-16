/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import AboutProblem from './components/AboutProblem';
import Solution from './components/Solution';
import Frameworks from './components/Frameworks';
import Services from './components/Services';
import WhyBlueAnt from './components/WhyBlueAnt';
import Results from './components/Results';
import WorkGallery from './components/WorkGallery';
import Testimonials from './components/Testimonials';
import AboutLong from './components/AboutLong';
import FinalCTA from './components/FinalCTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StickyCta from './components/StickyCta';

import { Toaster } from 'react-hot-toast';
import { SiteProvider } from './lib/siteContext';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import Login from './components/admin/Login';
import Leads from './components/admin/Leads';
import Content from './components/admin/Content';
import Settings from './components/admin/Settings';
import CalendarModule from './components/admin/CalendarModule';
import Analytics from './components/admin/Analytics';
import Team from './components/admin/Team';
import BlogPage from './pages/Blog';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      
      <section id="approach">
        <AboutProblem />
        <Solution />
      </section>

      <section id="frameworks">
        <Frameworks />
      </section>

      <section id="services">
        <Services />
      </section>

      <WhyBlueAnt />
      <Results />
      
      <section id="work">
        <WorkGallery />
      </section>

      <Testimonials />
      
      <section id="about">
        <AboutLong />
      </section>

      <FinalCTA />
      <Contact />
      <Footer />
      <StickyCta />
    </>
  );
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(window.location.pathname.startsWith('/admin'));

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  const handleEnter = () => setIsLoaded(true);

  return (
    <BrowserRouter>
      <SiteProvider>
        <main className="relative">
          <Toaster position="top-right" />
          <AnimatePresence mode="wait">
            {!isLoaded ? (
              <LoadingScreen key="loader" onEnter={handleEnter} />
            ) : (
              <motion.div 
                key="site"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="min-h-screen bg-off-white"
              >
                <Routes>
                  {/* Public Frontend */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  
                  {/* Admin Auth */}
                  <Route path="/admin/login" element={<Login />} />
                  
                  {/* Managed Admin Area */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="leads" element={<Leads />} />
                    <Route path="calendar" element={<CalendarModule />} />
                    <Route path="content" element={<Content />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="team" element={<Team />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Redirects */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </SiteProvider>
    </BrowserRouter>
  );
}
