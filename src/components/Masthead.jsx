import React from "react";
import { Link } from "react-router-dom";
import { profile } from "../Data";

/* Greeting and name are one sentence, so they are one heading — a screen
   reader gets "Hello, my name is Floyd Benedikter" and the type does the
   work of separating the two voices. */
const Masthead = () => (
  <header className="si-masthead">
    <h1 className="si-wordmark">
      <span className="si-wordmark__hello">Hello, my name is</span>
      <span className="si-wordmark__name">
        <span className="si-wordmark__word">Floyd</span>
        <span className="si-wordmark__word">Benedikter</span>
      </span>
    </h1>

    <div className="si-masthead__body">
      <p className="si-lede">
        {profile.lede.map(({ t, em }, index) =>
          em ? <strong key={index}>{t}</strong> : t
        )}
      </p>
      <p className="si-location">Currently at {profile.employer} · {profile.based}</p>
      <div className="si-masthead__links">
        <Link to="/resume" className="si-link" data-internal="true">View résumé</Link>
        <a href={`mailto:${profile.email}`} className="si-link">Get in touch</a>
      </div>
    </div>
  </header>
);

export default Masthead;
