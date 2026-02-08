import React from "react";
import { Link } from "react-router-dom";
import { journeyData } from "../Data";
import "./Journey.css";

const Journey = () => {
  // Separate Northslope from other items
  const regularItems = journeyData.slice(0, -1);
  const finalItem = journeyData[journeyData.length - 1];

  return (
    <section className="journey-section">
      <h2 className="journey-title">Journey</h2>
      <div className="timeline-container">
        <div className="timeline-line"></div>
        {regularItems.map((item) => (
          <div key={item.id} className={`timeline-item ${item.side}`}>
            <Link to="/resume" className="timeline-content-link">
              <div className="timeline-content">
                <div className="timeline-header">
                  {item.logo && (
                    <img
                      src={item.logo}
                      alt={`${item.title} logo`}
                      className="timeline-logo"
                    />
                  )}
                  <div className="timeline-text-content">
                    <h3 className="timeline-item-title">{item.title}</h3>
                    {item.subtitle && (
                      <p className="timeline-item-subtitle">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                <p className={`timeline-item-type experience`}>{item.type}</p>
                <p className="timeline-item-date">{item.dateLabel}</p>
              </div>
            </Link>
            <div className="timeline-dot"></div>
          </div>
        ))}

        {/* Final destination - Northslope */}
        <div className="timeline-final">
          <Link to="/resume" className="timeline-content-link">
            <div className="timeline-content timeline-final-content">
              <div className="timeline-header">
                {finalItem.logo && (
                  <img
                    src={finalItem.logo}
                    alt={`${finalItem.title} logo`}
                    className="timeline-logo"
                  />
                )}
                <div className="timeline-text-content">
                  <h3 className="timeline-item-title">{finalItem.title}</h3>
                  {finalItem.subtitle && (
                    <p className="timeline-item-subtitle">{finalItem.subtitle}</p>
                  )}
                </div>
              </div>
              <p className={`timeline-item-type ${finalItem.type.toLowerCase()}`}>
                {finalItem.type}
              </p>
              <p className="timeline-item-date">{finalItem.dateLabel}</p>
            </div>
          </Link>
          <div className="timeline-dot timeline-final-dot"></div>
        </div>
      </div>
    </section>
  );
};

export default Journey;
