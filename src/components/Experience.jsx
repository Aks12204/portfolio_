import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Edit3, Trash2 } from 'lucide-react';

export const Experience = () => {
  const { data, isAuthenticated, deleteExperience, openAdminTab } = usePortfolio();
  const { experience } = data;

  return (
    <section id="experience">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-tag">Career Journey</span>
            <h2 className="section-title">Work Experience</h2>
            <p className="section-subtitle">
              Professional roles, engineering highlights, and contributions over the years.
            </p>
          </div>
          {isAuthenticated && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => openAdminTab('experience')}
            >
              <Plus size={16} /> Add Experience
            </button>
          )}
        </div>

        <div className="timeline">
          {experience.map((exp) => (
            <div key={exp.id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <span className="timeline-company">{exp.company}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="timeline-period">{exp.period}</span>
                    {isAuthenticated && (
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          className="btn-icon"
                          style={{ padding: '0.3rem' }}
                          onClick={() => openAdminTab('experience', exp)}
                          title="Edit work experience"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ padding: '0.3rem' }}
                          onClick={() => deleteExperience(exp.id)}
                          title="Delete work experience"
                        >
                          <Trash2 size={14} color="#ef4444" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="timeline-desc">{exp.description}</p>

                {exp.technologies && exp.technologies.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
