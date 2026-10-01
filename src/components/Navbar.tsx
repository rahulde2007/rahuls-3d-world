import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";
import { prefersReducedMotion } from "./utils/motion";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  useEffect(() => {
    const navigation = document.querySelector(".header ul");
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: prefersReducedMotion() ? 0 : 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    const onNavigationClick = (event: Event) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        "a[data-href]"
      );
      const target = link?.dataset.href;
      if (!target || window.innerWidth <= 1024) return;
      event.preventDefault();
      smoother.scrollTo(target, true, "top top");
    };
    const onResize = () => {
      ScrollSmoother.refresh(true);
    };

    navigation?.addEventListener("click", onNavigationClick);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      navigation?.removeEventListener("click", onNavigationClick);
      window.removeEventListener("resize", onResize);
      smoother.kill();
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          RD
        </a>
        <a
          href="https://www.linkedin.com/in/rahul-de-r6294520571/"
          className="navbar-connect"
          data-cursor="disable"
          target="_blank"
          rel="noreferrer"
        >
          RAHUL DE
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
