import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus } from 'lucide-react';

export const Skills = () => {
  const { data, isAuthenticated, openAdminTab } = usePortfolio();
  const { skills } = data;

  return (
    <section id="skills">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-tag">Expertise</span>
            <h2 className="section-title">Technical Skills</h2>
            <p className="section-subtitle">
              Tools, languages, frameworks, and technologies I work with daily.
            </p>
          </div>
          {isAuthenticated && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => openAdminTab('skills')}
            >
              <Plus size={16} /> Manage Skills
            </button>
          )}
        </div>

        <div className="skills-grid">
          {skills.map((skillGroup, idx) => (
            <div key={idx} className="skill-category-card">
              <h3 className="skill-category-title">{skillGroup.category}</h3>
              <div className="skill-pills">
                {skillGroup.items.map((skill, sIdx) => (
                  <span key={sIdx} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
