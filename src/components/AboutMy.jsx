import React from 'react';
import 'animate.css/animate.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const AboutMy = () => {
  useEffect(() => {
    AOS.init({ duration: 2000, once: true });
  }, []);
  return (
    <>
      <h1 className='sectionh1 animation' data-aos='fade-up'>
        About My
      </h1>
      <div className='abouts' data-aos='fade-up'>
        <div className='about '>
          <div>
            <h2 className='abouth2'>Past</h2>
            <p className='aboutp'>
              I discovered my love for programming in sophomore year of college.
              I graduated from Princeton University with a degree in computer
              science engineering. I engineered both algorithms and user
              interfaces for autonomous vehicle public transportation systems.
            </p>
          </div>
        </div>
        <div className='about'>
          <div>
            <h2 className='abouth2'>Present</h2>
            <p className='aboutp'>
              I am currently pursuing a part-time master of Computer science.
              I'm pursuing certificates in Software Engineering, Back-End
              development and web design on Udemy. In my free time I like to
              create websites and learn new technologies every day!
            </p>
          </div>
        </div>
        <div className='about'>
          <div>
            <h2 className='abouth2'>Future</h2>
            <p className='aboutp'>
              I'm excited to apply my skills in software engineering. I enjoy
              working on complex, real-life applicable problems.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutMy;
