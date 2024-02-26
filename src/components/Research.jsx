import { researches } from '../Data';
import { FaGithub } from 'react-icons/fa6';
import { IoCaretForwardCircleOutline } from 'react-icons/io5';
import 'animate.css/animate.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import './newStyle.css';
const Research = () => {
  useEffect(() => {
    AOS.init({ duration: 300, once: true });
  }, []);
  return (
    <section className='Research-center'>
      <h1 className='sectionh1' id="Research">My Research</h1>
      {researches.map((research) => {
        const { id, img, information, title, link, git, tags } = research;
        return (
          <div className='research' key={id} data-aos='zoom-in'>
            <div className='right'>
              <h2 className='research-title' style={{cursor:"pointer"}} onClick={()=>window.open(link, '_self')}>{title}</h2>
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
              <p className='research-para'>{information}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Research;
