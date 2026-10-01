import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const social = document.getElementById("social");
    if (!social) return;

    const icons = Array.from(social.querySelectorAll("span")).map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        element,
        link: element.querySelector("a") as HTMLElement,
        rect,
        mouseX: rect.width / 2,
        mouseY: rect.height / 2,
        currentX: 0,
        currentY: 0,
      };
    });
    let frame = 0;

    const updatePositions = () => {
      let isMoving = false;
      icons.forEach((icon) => {
        icon.currentX += (icon.mouseX - icon.currentX) * 0.1;
        icon.currentY += (icon.mouseY - icon.currentY) * 0.1;
        icon.link.style.setProperty("--siLeft", `${icon.currentX}px`);
        icon.link.style.setProperty("--siTop", `${icon.currentY}px`);
        isMoving ||=
          Math.abs(icon.mouseX - icon.currentX) > 0.1 ||
          Math.abs(icon.mouseY - icon.currentY) > 0.1;
      });
      frame = isMoving ? requestAnimationFrame(updatePositions) : 0;
    };

    const onMouseMove = (event: MouseEvent) => {
      icons.forEach((icon) => {
        const x = event.clientX - icon.rect.left;
        const y = event.clientY - icon.rect.top;
        if (x < 40 && x > 10 && y < 40 && y > 5) {
          icon.mouseX = x;
          icon.mouseY = y;
        } else {
          icon.mouseX = icon.rect.width / 2;
          icon.mouseY = icon.rect.height / 2;
        }
      });
      if (!frame) frame = requestAnimationFrame(updatePositions);
    };

    const onResize = () => {
      icons.forEach((icon) => {
        icon.rect = icon.element.getBoundingClientRect();
        icon.mouseX = icon.rect.width / 2;
        icon.mouseY = icon.rect.height / 2;
      });
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a
            href="https://github.com/rahulde2007"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href="https://www.linkedin.com/in/rahul-de-r6294520571/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a
            href="https://www.instagram.com/rahulde_18/"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href="/RAHUL%20DE%20RESUME.pdf"
        target="_blank"
        rel="noreferrer"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
