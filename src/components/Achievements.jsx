import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { AchievementCard } from './AchievementCard';
import { Plus, Award } from 'lucide-react';
import '../styles/achievements.css';

export const Achievements = () => {
  const { data, setIsAdminOpen } = usePortfolio();
  const { achievements } = data;

  return (
    <section id="achievements">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-tag">Updates & Feed</span>
            <h2 className="section-title">Achievements & Milestones</h2>
            <p className="section-subtitle">
              Recent certifications, project launches, hackathons, and announcements (Latest on top).
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsAdminOpen(true)}
          >
            <Plus size={16} /> Post New Achievement
          </button>
        </div>

        <div className="achievements-feed">
          {achievements && achievements.length > 0 ? (
            achievements.map((item) => (
              <AchievementCard key={item.id} achievement={item} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
              <Award size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No achievements posted yet.</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => setIsAdminOpen(true)}>
                Add your first achievement
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
