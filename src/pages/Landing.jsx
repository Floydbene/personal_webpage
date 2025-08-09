import { SVG } from "../components/SVG";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Projects from "../components/Projects";
import React from "react";
import { TfiMouse } from "react-icons/tfi";
import { TfiAngleDoubleDown } from "react-icons/tfi";
import AboutMy from "../components/AboutMy";
import Skills from "../components/Skills";
import Contact from "../components/Contact";
import Floyd from "../assets/floyd_lowersize.jpg";
import Research from "../components/Research";

const Landing = () => {
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
      <div className="hello">
        <div className="hello-left">
          <SVG />
          <h4 className="info fade-in">
            I'm a London-based Full-Stack Engineer with a passion for practical
            ML to solve real problems.
          </h4>
          <h4 className="info fade-in">
            I turn data-heavy challenges into clean, user-friendly experiences
            and I'm excited to join teams where I can scale ML features.
          </h4>
        </div>
        <div className="landing-img fade-in">
          <img src={Floyd} alt="" />
        </div>
      </div>
      <div className="scrollicon fade-in">
        <TfiMouse />
        <TfiAngleDoubleDown className="vibing" />
      </div>
      {/* <AboutMy /> */}
      <Projects id="projects" />
      <Skills id="skills" />
      <Research id="research" />
      <Contact id="contact" />
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
