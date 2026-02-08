import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResumeSection from "../components/ResumeSection";
import { resumeData } from "../Data";
import { useTheme } from "../context/ThemeContext";

const Resume = () => {
  const { isDarkMode } = useTheme();

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
      <div className="resume fade-in-quick">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1 className="resume-title">
            Software Engineer, Startup Generalist
          </h1>
        </div>
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
