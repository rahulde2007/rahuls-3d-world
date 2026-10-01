import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let overIcons = false;
    let frame = 0;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");

    const updatePosition = () => {
      frame = 0;
      if (overIcons) return;

      cursorPos.x += (mousePos.x - cursorPos.x) / 6;
      cursorPos.y += (mousePos.y - cursorPos.y) / 6;
      setX(cursorPos.x);
      setY(cursorPos.y);

      if (
        Math.abs(mousePos.x - cursorPos.x) > 0.2 ||
        Math.abs(mousePos.y - cursorPos.y) > 0.2
      ) {
        frame = requestAnimationFrame(updatePosition);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      if (reducedMotion) {
        setX(mousePos.x);
        setY(mousePos.y);
        return;
      }
      if (!overIcons && !frame) frame = requestAnimationFrame(updatePosition);
    };

    const onMouseOver = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-cursor]"
      );
      if (!target) return;

      if (target.dataset.cursor === "icons") {
        const rect = target.getBoundingClientRect();
        overIcons = true;
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        cursor.classList.add("cursor-icons");
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        if (reducedMotion) {
          setX(rect.left);
          setY(rect.top);
        } else {
          gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
        }
      } else if (target.dataset.cursor === "disable") {
        cursor.classList.add("cursor-disable");
      }
    };

    const onMouseOut = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-cursor]"
      );
      const relatedTarget = event.relatedTarget;
      if (
        !target ||
        (relatedTarget instanceof Node && target.contains(relatedTarget))
      ) {
        return;
      }

      cursor.classList.remove("cursor-disable", "cursor-icons");
      overIcons = false;
      if (!frame) frame = requestAnimationFrame(updatePosition);
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      if (frame) cancelAnimationFrame(frame);
      gsap.killTweensOf(cursor);
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
