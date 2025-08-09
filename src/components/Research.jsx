import { researches } from "../Data";
import "animate.css/animate.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import "./newStyle.css";
const Research = () => {
  useEffect(() => {
    AOS.init({ duration: 300, once: true });
  }, []);
  return (
    <section className="Research-center">
      <h1 className="sectionh1" id="Research">
        My Research
      </h1>
      {researches.map((research) => {
        const { id, title, link, tags } = research;
        return (
          <div className="research" key={id} data-aos="zoom-in">
            <div className="right">
              <h2
                className="research-title"
                style={{ cursor: "pointer" }}
                onClick={() => window.open(link, "_self")}
              >
                {title}
              </h2>
              <div className="madewith">
                <h4 className="tech-used">Topics:</h4>
                <div className="tags">
                  {tags.map((tag) => {
                    return (
                      <p className="tag" key={tag}>
                        {tag}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Research;
