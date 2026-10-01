import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const projects = [
  {
    title: "WiFi QR Generator",
    category: "Web-based WiFi QR code generator",
    description:
      "A simple and practical WiFi QR Generator that allows users to create a QR code from WiFi network details and quickly share or connect to a wireless network. Built as a useful web-based project with a clean and straightforward user experience.",
    image: "/images/WiFi QR Generator.png",
    width: 1535,
    height: 825,
    link: "https://github.com/rahulde2007/WiFi-QR-Generator",
  },
  {
    title: "Graph RAG App",
    category: "Experimental graph-based retrieval application",
    description:
      "An experimental Graph RAG application focused on connecting information through a graph-based retrieval approach. The project explores how structured relationships between data can improve information retrieval and provide more contextual results.",
    image: "/images/Graph RAG.png",
    width: 1535,
    height: 821,
    link: "https://github.com/rahulde2007/Graph-RAG-App",
  },
  {
    title: "RepoMind",
    category: "Developer-focused repository analysis",
    description:
      "RepoMind is a developer-focused project designed to make working with software repositories more intelligent and easier to understand. It explores AI-assisted analysis of codebases and repository information to help developers understand and navigate projects more efficiently.",
    image: "/images/RepoMind.png",
    width: 1527,
    height: 827,
    link: "https://github.com/rahulde2007/Repo-mind",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Description</span>
                          <p>{project.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage
                        image={project.image}
                        alt={project.title}
                        link={project.link}
                        loading={index === 0 ? "eager" : "lazy"}
                        width={project.width}
                        height={project.height}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
