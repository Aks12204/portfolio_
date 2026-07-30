import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, ArrowRight, Download, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';
import '../styles/hero.css';

export const Hero = () => {
  const { data } = usePortfolio();
  const { profile } = data;

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-text-content">
            <div className="hero-status-pill">
              <span className="status-dot"></span>
              <span>Available for projects & roles</span>
            </div>

            <h1 className="hero-name">{profile.name}</h1>
            <h2 className="hero-role">{profile.role}</h2>
            <p className="hero-tagline">{profile.tagline}</p>

            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary">
                Explore Projects <ArrowRight size={18} />
              </a>
              <a href="#contact" className="btn btn-secondary">
                Get in Touch
              </a>
              {profile.resumeUrl && profile.resumeUrl !== '#' && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <Download size={16} /> Resume
                </a>
              )}
            </div>

            <div className="hero-socials">
              {profile.socials?.github && (
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="GitHub">
                  <GithubIcon size={18} />
                </a>
              )}
              {profile.socials?.linkedin && (
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="LinkedIn">
                  <LinkedinIcon size={18} />
                </a>
              )}
              {profile.socials?.twitter && (
                <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="Twitter">
                  <TwitterIcon size={18} />
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="btn-icon" aria-label="Email">
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>

          <div className="hero-avatar-wrapper">
            <img
              src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
              alt={profile.name}
              className="hero-avatar"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
