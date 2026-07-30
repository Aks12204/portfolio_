import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { MapPin, Mail, Award, Rocket, Edit3 } from 'lucide-react';

export const About = () => {
  const { data, isAuthenticated, openAdminTab } = usePortfolio();
  const { profile, projects, achievements } = data;

  return (
    <section id="about">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-tag">About Me</span>
            <h2 className="section-title">Background & Overview</h2>
          </div>
          {isAuthenticated && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => openAdminTab('profile')}
            >
              <Edit3 size={16} /> Edit Profile Info
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              {profile.bio}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-primary)', fontWeight: '500' }}>
              {profile.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <MapPin size={18} color="var(--accent)" />
                  <span>Based in {profile.location}</span>
                </div>
              )}
              {profile.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Mail size={18} color="var(--accent)" />
                  <span>{profile.email}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
              <Rocket size={28} color="var(--accent)" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>{projects.length}+</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Projects Built</p>
            </div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
              <Award size={28} color="var(--accent)" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>{achievements.length}+</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Achievements & Posts</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
