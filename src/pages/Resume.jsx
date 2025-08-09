import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResumeSection from "../components/ResumeSection";
import { resumeData } from "../Data";

const Resume = () => {
  const copyEmail = () => {
    toast.success("Copied email to clipboard", {
      position: "bottom-center",
      autoClose: 5000,
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
      <style>{`body{background-color: #ffffff;} nav{background-color:#fff!important;} .logo{color:black!important} .nav-link{color:black!important} .active{color:var(--primary-900)!important}`}</style>
      <div className="resume fade-in-quick">
        <h1 className="resume-title">
          Computer scientist, startup generalist,
        </h1>
        <h1 className="resume-title">
          Marketing analyst, passionate web developer
        </h1>
        {resumeData.map((datapoint) => {
          return <ResumeSection info={datapoint} key={datapoint.id} />;
        })}

        {/* <hr style={{ marginTop: '10vw' }}></hr> */}
      </div>
      <section className="section">
        <h3 className="res-section-title">contact me</h3>
        <div className="section-content">
          <section className="subsection-social">
            <div
              className="subsection-content hover"
              onClick={() =>
                window.open("https://www.linkedin.com/in/floydbenedikter/")
              }
              style={{ margin: "0 auto" }}
            >
              <FaLinkedin />
            </div>

            <div
              className="subsection-content hover"
              onClick={() => window.open("https://github.com/Floydbene")}
              style={{ margin: "0 auto" }}
            >
              <FaGithub />
            </div>
            <div
              className="subsection-content hover"
              onClick={() => window.open("https://www.floydbenedikter.com")}
              style={{ margin: "0 auto" }}
            >
              <FaGlobe />
            </div>
            <div
              className="subsection-content hover"
              onClick={() => copyEmail()}
              style={{ margin: "0 auto" }}
            >
              <MdOutlineAlternateEmail />
            </div>
          </section>
        </div>
      </section>
    </>
  );
};
export default Resume;
