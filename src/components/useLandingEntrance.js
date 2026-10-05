import { useLayoutEffect } from "react";

export default function useLandingEntrance(siteRef, searchParams) {
  useLayoutEffect(() => {
    const name = siteRef.current?.querySelector(".si-wordmark__name");
    // Deep links and restored scroll positions should go straight to the content.
    if (!name?.animate || window.scrollY > 0 ||
        window.location.hash || searchParams.has("entry") || searchParams.has("section")) return;

    const root = document.documentElement;
    const events = ["pointerdown", "keydown", "wheel", "touchstart", "resize", "scroll"];
    let animation;
    let timer;
    let stopped = false;
    root.dataset.landingEntrance = "name";

    const centerName = () => {
      name.style.transform = "none";
      const rect = name.getBoundingClientRect();
      const scale = Math.min(1.35, (window.innerWidth - 40) / rect.width);
      const x = (window.innerWidth - rect.width * scale) / 2 - rect.left;
      const y = (window.innerHeight - rect.height * scale) / 2 - rect.top;
      name.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    };

    const finish = () => {
      stopped = true;
      clearTimeout(timer);
      animation?.cancel();
      name.style.removeProperty("transform");
      delete root.dataset.landingEntrance;
      events.forEach((event) => window.removeEventListener(event, finish));
    };

    const start = () => {
      if (stopped) return;
      centerName();
      animation = name.animate(
        [{ transform: name.style.transform }, { transform: "none" }],
        { delay: 350, duration: 850, easing: "cubic-bezier(0.76, 0, 0.24, 1)", fill: "both" }
      );
      animation.onfinish = () => {
        if (stopped) return;
        name.style.removeProperty("transform");
        animation.cancel();
        root.dataset.landingEntrance = "reveal";
        timer = window.setTimeout(finish, 750);
      };
    };

    // Keep the first paint centered, then measure again when the font is ready.
    centerName();
    Promise.race([
      document.fonts.ready,
      new Promise((resolve) => { timer = window.setTimeout(resolve, 400); }),
    ]).then(() => {
      clearTimeout(timer);
      start();
    });

    // Interacting skips the introduction rather than making visitors wait.
    events.forEach((event) => window.addEventListener(event, finish, { passive: true }));
    return finish;
  }, [siteRef, searchParams]);
}
