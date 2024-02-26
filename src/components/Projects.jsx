import { portfolio } from '../Data';
import { FaGithub } from 'react-icons/fa6';
import { IoCaretForwardCircleOutline } from 'react-icons/io5';
import 'animate.css/animate.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import './newStyle.css';
const Projects = () => {
  useEffect(() => {
    AOS.init({ duration: 300, once: true });
  }, []);
  return (
    <section className='projects-center'>
      <h1 className='sectionh1' id="projects">My Projects</h1>
      {portfolio.map((project) => {
        const { id, img, information, title, live, git, tags } = project;
        return (
          <div className='project' key={id} data-aos='zoom-in'>
            <img src={img} className='project-image' />
            <div className='right'>
              <h2 className='project-title'>{title}</h2>
              <div className='madewith'>
                <h4 className='tech-used'>Technologies used:</h4>
                <div className='tags'>
                  {tags.map((tag) => {
                    return (
                      <p className='tag' key={tag}>
                        {tag}
                      </p>
                    );
                  })}
                </div>
              </div>
              <p className='project-para'>{information}</p>
              <div className='btns'>
                {live ? (
                  <div
                    className='projbut btn'
                    onClick={() => window.open(live)}
                  >
                    <IoCaretForwardCircleOutline className='btnicon' />
                    Live
                  </div>
                ) : (
                  <></>
                )}
                {git ? (
                  <div className='projbut btn' onClick={() => window.open(git)}>
                    <FaGithub className='btnicon' />
                    GitHub
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Projects;
