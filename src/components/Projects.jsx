import { portfolio, researches } from "../Data";
import { FaGithub } from "react-icons/fa6";
import { IoCaretForwardCircleOutline } from "react-icons/io5";
import "animate.css/animate.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import "./newStyle.css";
import researchCover from "../assets/caching.png";
const Projects = () => {
  useEffect(() => {
    AOS.init({ duration: 300, once: true });
  }, []);

  const workItems = [
    ...researches.map((research) => ({
      id: `research-${research.id}`,
      title: research.title,
      img: researchCover,
      information: "Research article",
      live: research.link,
      liveLabel: "Read",
      tags: research.tags,
      date: "Research",
      categories: "Article",
    })),
    ...portfolio.map((project) => ({
      ...project,
      id: `project-${project.id}`,
    })),
  ];

  return (
    <section className="projects-center">
      <h1 className="skills-showcase-title" id="projects">
        My Work
      </h1>
      <p className="projects-subtitle">
        Projects I&apos;ve built using various frameworks.
      </p>

      <div className="projects-grid">
        {workItems.map((project) => {
          const {
            id,
            img,
            information,
            title,
            live,
            git,
            tags,
            date,
            categories,
            liveLabel,
          } = project;

          const isExternalLink = (url) => /^https?:\/\//i.test(url);

          const liveHref =
            live && !isExternalLink(live) && !live.startsWith("/")
              ? `/${live}`
              : live;

          return (
            <article className="projectCard" key={id} data-aos="zoom-in">
              <div className="projectCard__media">
                <img
                  src={img}
                  className="projectCard__image"
                  alt={title}
                  loading="lazy"
                />
              </div>

              <div className="projectCard__body">
                {(date || categories) && (
                  <div className="projectCard__meta">
                    <span className="projectCard__metaLeft">{date}</span>
                    <span className="projectCard__metaRight">{categories}</span>
                  </div>
                )}

                <h3 className="project-title">{title}</h3>

                <p className="project-para">{information}</p>

                {tags?.length ? (
                  <div className="projectCard__tags">
                    {tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="btns">
                  {live ? (
                    <a
                      className="projbut btn"
                      href={liveHref}
                      target={isExternalLink(liveHref) ? "_blank" : undefined}
                      rel={isExternalLink(liveHref) ? "noreferrer" : undefined}
                    >
                      <IoCaretForwardCircleOutline className="btnicon" />
                      {liveLabel || "Live"}
                    </a>
                  ) : null}

                  {git ? (
                    <a
                      className="projbut btn"
                      href={git}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaGithub className="btnicon" />
                      GitHub
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
