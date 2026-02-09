import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Projects from "../components/Projects";
import React from "react";
import floydImage from "../assets/floyd.jpeg";
import CodeWindow from "../components/CodeWindow";
import Journey from "../components/Journey";
import SkillsShowcase from "../components/SkillsShowcase";
import SkillsRain from "../components/SkillsRain";

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
        <div className="profile-image-container fade-in">
          <img
            src={floydImage}
            alt="Floyd Benedikter"
            className="profile-image"
            ref={imgRef}
          />
        </div>
        <h1 className="greeting fade-in">
          Hello! I'm <span className="primary-name">Floyd</span>
        </h1>
        <h2 className="subtitle fade-in">
          Forward Deployed Software Engineer (FDSE)
        </h2>
      </div>
      {/* <AboutMy /> */}
      <CodeWindow />
      <Journey />
      <SkillsShowcase />
      <Projects id="projects" />
      <div className="bottomrow fade-in">
        <h4 className="social" onClick={() => copyEmail()}>
          Email
        </h4>
        <h4
          className="social"
          onClick={() => window.open("https://www.github.com/floydbene")}
        >
          GitHub
        </h4>
        <h4
          className="social"
          onClick={() =>
            window.open("https://www.linkedin.com/in/floydbenedikter")
          }
        >
          LinkedIn
        </h4>
        <h4 className="social" onClick={() => window.open("resume", "_self")}>
          Resume
        </h4>
      </div>
      <footer>&copy; Made with love by Floyd Benedikter</footer>
    </>
  );
};
export default Landing;
