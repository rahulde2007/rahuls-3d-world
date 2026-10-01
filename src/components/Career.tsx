import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>CSE Student</h4>
                <h5>Future Institute of Engineering and Management · Sonarpur, Kolkata</h5>
              </div>
              <h3>Aug 2026 — Present</h3>
            </div>
            <p>
              Currently pursuing a Bachelor of Technology in Computer Science
              and Engineering, focusing on programming fundamentals, web
              development, problem solving, and modern technologies.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Web Development &amp; Competitive Programmer</h4>
                <h5>Self Learning &amp; Personal Projects · Kolkata, India</h5>
              </div>
              <h3>2026 — Present</h3>
            </div>
            <p>
              Learning web development and programming through hands-on practice
              and personal projects. Exploring HTML, CSS, JavaScript, React, C++,
              and other modern technologies while continuously improving
              problem-solving and development skills.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Science Student</h4>
                <h5>Rohini C.R.D High School · Rohini, Jhargram</h5>
              </div>
              <h3>Jan 2018 — Feb 2026</h3>
            </div>
            <p>
              Completed secondary and higher secondary education with a focus on
              Science, developing an early interest in mathematics, technology,
              and computer science.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
