import React from "react";

const ResumeSection = ({ info }) => {
  const subtitles = info.subtitles;
  return (
    <section className="section">
      <h3 className="res-section-title">{info.title}</h3>
      <div className="section-content">
        {subtitles.map((subtitle) => {
          return (
            <section className="subsection" key={subtitle.subtitle}>
              <div>
                <h4
                  className="subsection-title"
                  style={{ textTransform: "initial" }}
                >
                  {subtitle.subtitle}
                </h4>
                {subtitle.imgUrl ? (
                  <img
                    src={subtitle.imgUrl}
                    onClick={() => window.open(subtitle.imgLink, "_blank")}
                    style={{
                      height: "100px",
                      margin: "1rem 0rem",
                      cursor: "pointer",
                    }}
                  ></img>
                ) : (
                  <></>
                )}
              </div>

              <div className="subsection-content">
                {subtitle.title ? (
                  <>
                    <h4 className="subsection-subtitle">{subtitle.title}</h4>
                    <h5 className="subsection-subtitle">
                      {subtitle.timeFrame}
                    </h5>
                  </>
                ) : (
                  <></>
                )}
                {subtitle.text}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
};

export default ResumeSection;
