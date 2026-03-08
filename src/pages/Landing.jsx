import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Projects from "../components/Projects";
import React from "react";
import floydImage from "../assets/floyd.jpeg";
import CodeWindow from "../components/CodeWindow";
import Journey from "../components/Journey";
import SkillsShowcase from "../components/SkillsShowcase";
import SkillsRain from "../components/SkillsRain";
import { FaEnvelope, FaGithub, FaLinkedin, FaFileAlt } from "react-icons/fa";

const Landing = () => {
  const heroRef = React.useRef(null);
  const imgRef = React.useRef(null);

  const copyEmail = () => {
    toast.success("Copied email to clipboard", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText("floyd.benedikter@gmail.com");
  };
  return (
    <>
      <div className="hello" ref={heroRef}>
        <SkillsRain containerRef={heroRef} targetRef={imgRef} />
        <div className="profile-image-container stagger-1">
          <img
            src={floydImage}
            alt="Floyd Benedikter"
            className="profile-image"
            ref={imgRef}
          />
        </div>
        <h1 className="greeting stagger-2">
          Hello! I'm <span className="primary-name">Floyd</span>
        </h1>
        <h2 className="subtitle stagger-3">
          Forward Deployed Software Engineer (FDSE)
        </h2>
      </div>
      <CodeWindow />
      <Journey />
      <SkillsShowcase />
      <Projects id="projects" />
      <div className="bottomrow stagger-4">
        <button
          className="social-icon-btn"
          onClick={() => copyEmail()}
          title="Copy email"
          aria-label="Email"
        >
          <FaEnvelope />
        </button>
        <button
          className="social-icon-btn"
          onClick={() => window.open("https://www.github.com/floydbene")}
          title="GitHub"
          aria-label="GitHub"
        >
          <FaGithub />
        </button>
        <button
          className="social-icon-btn"
          onClick={() =>
            window.open("https://www.linkedin.com/in/floydbenedikter")
          }
          title="LinkedIn"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </button>
        <button
          className="social-icon-btn"
          onClick={() => window.open("resume", "_self")}
          title="Resume"
          aria-label="Resume"
        >
          <FaFileAlt />
        </button>
      </div>
      <footer>&copy; Made with love by Floyd Benedikter</footer>
    </>
  );
};
export default Landing;
