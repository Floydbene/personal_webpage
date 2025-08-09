import React from "react";
import { useEffect } from "react";
import "animate.css/animate.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 2000, once: true });
  }, []);
  return (
    <>
      <h1 className="sectionh1" id="contact">
        Let's Connect!
      </h1>
      <div className="abouts">
        <div className="about" data-aos="fade-right">
          <div>
            <h2 className="abouth2">Ready to build something amazing?</h2>
            <p className="aboutp">
              I'm actively seeking opportunities in ML Engineering, Full-Stack
              Development, and Data Science roles. Whether you're looking for
              someone to architect scalable ML pipelines, build responsive web
              applications, or tackle complex algorithmic challenges - let's
              talk about how I can drive impact at your company.
            </p>
          </div>
        </div>
        <div className="about" data-aos="fade-left">
          <div>
            <h2 className="abouth2">Expand our networks</h2>
            <p className="aboutp">
              I believe great ideas come from diverse connections. Whether
              you're a fellow engineer pushing the boundaries of AI, a product
              designer crafting intuitive experiences, or an entrepreneur
              building the next big thing - I'd love to connect and share
              insights!
            </p>
          </div>
        </div>
        <div className="about" data-aos="fade-up">
          <div>
            <h2 className="abouth2">Collaborate on cutting-edge projects</h2>
            <p className="aboutp">
              Got an idea that involves machine learning, data visualization, or
              full-stack development? I'm always excited to collaborate on
              projects that push technical boundaries and create real-world
              impact. Drop me a line and let's turn your vision into reality!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
