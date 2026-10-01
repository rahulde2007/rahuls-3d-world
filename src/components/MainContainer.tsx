import {
  lazy,
  PropsWithChildren,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [shouldLoadTechStack, setShouldLoadTechStack] = useState(false);
  const techStackPlaceholder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let resizeTimeout = 0;
    let splitCleanup = () => {};
    const refreshSplitText = () => {
      splitCleanup();
      splitCleanup = setSplitText();
    };
    const resizeHandler = () => {
      const nextDesktopView = window.innerWidth > 1024;
      setIsDesktopView((current) =>
        current === nextDesktopView ? current : nextDesktopView
      );
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(refreshSplitText, 120);
    };

    const splitWhenFontsReady = () => {
      if (!disposed) refreshSplitText();
    };

    if (document.fonts?.status === "loaded") {
      splitWhenFontsReady();
    } else {
      void document.fonts?.ready.then(splitWhenFontsReady);
    }

    window.addEventListener("resize", resizeHandler, { passive: true });
    return () => {
      disposed = true;
      window.clearTimeout(resizeTimeout);
      window.removeEventListener("resize", resizeHandler);
      splitCleanup();
    };
  }, []);

  useEffect(() => {
    if (!isDesktopView || shouldLoadTechStack) return;

    const placeholder = techStackPlaceholder.current;
    if (!placeholder) return;
    if (!("IntersectionObserver" in window)) {
      setShouldLoadTechStack(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoadTechStack(true);
        observer.disconnect();
      },
      { rootMargin: "1000px 0px" }
    );
    observer.observe(placeholder);
    return () => observer.disconnect();
  }, [isDesktopView, shouldLoadTechStack]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {isDesktopView &&
              (shouldLoadTechStack ? (
                <Suspense
                  fallback={
                    <div className="techstack">
                      <h2> My Techstack</h2>
                    </div>
                  }
                >
                  <TechStack />
                </Suspense>
              ) : (
                <div className="techstack" ref={techStackPlaceholder}>
                  <h2> My Techstack</h2>
                </div>
              ))}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
