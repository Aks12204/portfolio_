import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Achievements } from './components/Achievements';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { CheckCircle2 } from 'lucide-react';
import './styles/global.css';

const ToastNotification = () => {
  const { toastMessage } = usePortfolio();
  if (!toastMessage) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <CheckCircle2 size={18} color="#10b981" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

const MainContent = () => {
  return (
    <div className="app-main">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Achievements />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <AdminModal />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <MainContent />
      </PortfolioProvider>
    </ThemeProvider>
  );
}
