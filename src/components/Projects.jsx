import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, Edit3, Trash2, Plus } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import '../styles/projects.css';

export const Projects = () => {
  const { data, isAuthenticated, deleteProject, openAdminTab } = usePortfolio();
  const { projects } = data;
  const [selectedTag, setSelectedTag] = useState('All');

  // Extract unique tags across projects
  const allTags = ['All', ...new Set(projects.flatMap((p) => p.tags || []))];

  const filteredProjects = selectedTag === 'All'
    ? projects
    : projects.filter((p) => p.tags?.includes(selectedTag));

  return (
    <section id="projects">
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-tag">Portfolio</span>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">
              A selection of cloud, web, and full-stack applications I've engineered.
            </p>
          </div>
          {isAuthenticated && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => openAdminTab('projects')}
            >
              <Plus size={16} /> Add New Project
            </button>
          )}
        </div>

        {allTags.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image-wrapper">
                <img src={project.image} alt={project.title} className="project-image" />
                {project.featured && <span className="project-featured-badge">Featured</span>}
              </div>

              <div className="project-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <h3 className="project-title" style={{ marginBottom: 0 }}>{project.title}</h3>
                  {isAuthenticated && (
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        className="btn-icon"
                        style={{ padding: '0.3rem' }}
                        onClick={() => openAdminTab('projects', project)}
                        title="Edit project"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="btn-icon"
                        style={{ padding: '0.3rem' }}
                        onClick={() => deleteProject(project.id)}
                        title="Delete project"
                      >
                        <Trash2 size={14} color="#ef4444" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="project-description">{project.description}</p>

                {project.tags && project.tags.length > 0 && (
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="project-links">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                      <GithubIcon size={16} /> Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
