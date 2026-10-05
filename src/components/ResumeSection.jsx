const ResumeSection = ({ info }) => (
  <section className="section" aria-labelledby={`resume-section-${info.id}`}>
    <h2 className="res-section-title" id={`resume-section-${info.id}`}>{info.title}</h2>
    <div className="section-content">
      {info.subtitles.map((subtitle) => (
        <section className="subsection" key={subtitle.subtitle}>
          <div className="subsection-identity">
            <h3 className="subsection-title">{subtitle.subtitle}</h3>
            {subtitle.imgUrl && (
              subtitle.imgLink ? (
                <a className="subsection-logo-link" href={subtitle.imgLink} target="_blank" rel="noreferrer" aria-label={`${subtitle.subtitle} website (opens in a new tab)`}>
                  <img className="subsection-logo" src={subtitle.imgUrl} alt="" loading="lazy" />
                </a>
              ) : <img className="subsection-logo" src={subtitle.imgUrl} alt="" loading="lazy" />
            )}
          </div>
          <div className="subsection-content">
            {subtitle.title && <p className="subsection-subtitle subsection-role">{subtitle.title}</p>}
            {subtitle.timeFrame && <p className="subsection-subtitle subsection-timeframe">{subtitle.timeFrame}</p>}
            {subtitle.text}
          </div>
        </section>
      ))}
    </div>
  </section>
);

export default ResumeSection;
