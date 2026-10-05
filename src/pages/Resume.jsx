import { useLayoutEffect } from "react";
import ResumeSection from "../components/ResumeSection";
import { profile, resumeData } from "../Data";

const resumeLinks = [
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
];

const Resume = () => {
  useLayoutEffect(() => {
    document.documentElement.dataset.page = "resume";

    return () => {
      if (document.documentElement.dataset.page === "resume") {
        delete document.documentElement.dataset.page;
      }
    };
  }, []);

  return (
    <>
      <main className="resume">
        <header className="resume-header">
          <p className="resume-kicker">{profile.name} / Curriculum vitae</p>
          <h1 className="resume-title">{profile.role}</h1>
        </header>
        {resumeData.map((datapoint) => {
          return <ResumeSection info={datapoint} key={datapoint.id} />;
        })}

      <section className="section resume-contact">
        <h2 className="res-section-title">contact</h2>
        <div className="section-content">
          <nav className="resume-links" aria-label="Contact links">
            {resumeLinks.map((link) => (
              <a
                key={link.href}
                className="resume-link"
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </section>
      </main>
    </>
  );
};
export default Resume;
