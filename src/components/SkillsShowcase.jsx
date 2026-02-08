import React from 'react';
import './SkillsShowcase.css';

const SkillsShowcase = () => {
  const professionalSkills = [
    'TypeScript',
    'JavaScript',
    'React',
    'Python',
    'PySpark',
    'SQL',
    'Flask',
    'Vite',
    'Zustand',
    'Docker',
  ];

  const projectSkills = [
    'Java',
    'C',
    'C++',
    'GoLang',
    'WebSockets',
    'PostgreSQL',
    'SQLite',
  ];

  return (
    <section className="skills-showcase-section">
      <h2 className="skills-showcase-title">Technical Arsenal</h2>
      
      <div className="skills-showcase-container">
        <div className="skills-category">
          <h3 className="skills-category-title">Professional Experience</h3>
          <div className="skills-grid">
            {professionalSkills.map((skill, index) => (
              <span key={index} className="tag tag--professional">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="skills-category">
          <h3 className="skills-category-title">Project Experience</h3>
          <div className="skills-grid">
            {projectSkills.map((skill, index) => (
              <span key={index} className="tag tag--project">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsShowcase;
