import React from 'react';
import { useEffect } from 'react';
import 'animate.css/animate.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 2000, once: true });
  }, []);
  return (
    <>
      <h1 className='sectionh1' id="contact">Contact me!</h1>
      <div className='abouts'>
        <div className='about' data-aos='fade-right'>
          <div>
            <h2 className='abouth2'>About a job opportunity</h2>
            <p className='aboutp'>
              I am currently looking for roles in ~tech~. This includes anything
              related to web-development, data analysis, ML, algorithm design,
              fullstack engineering, and software engineering. Reach out to me
              to discuss!
            </p>
          </div>
        </div>
        <div className='about' data-aos='fade-left'>
          <div>
            <h2 className='abouth2'>To connect</h2>
            <p className='aboutp'>
              I'm always happy to extend my network, whether you are a
              developer, designer, employer or entrepeneur, I am happy to
              connect and get in touch!
            </p>
          </div>
        </div>
        <div className='about' data-aos='fade-up'>
          <div>
            <h2 className='abouth2'>To build something together</h2>
            <p className='aboutp'>
              If you are working on a project that is related to my prior
              projects and/or skills, reach out with any ideas that you would
              want to work on. Reach out now and let's make it happen!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
