import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href="https://www.linkedin.com/in/rahul-de-r6294520571/"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                LinkedIn — RAHUL DE
              </a>
            </p>
            <h4>Education</h4>
            <p>
              Future Institute of Engineering and Management — Bachelor of
              Technology (B.Tech) in Computer Science and Engineering — Sonarpur,
              Kolkata — Aug 2026 — Present
            </p>
            <p>
              Rohini C.R.D High School — Science — Rohini, Jhargram — Jan 2018 —
              Feb 2026
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/rahulde2007"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/rahul-de-r6294520571/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/rahulde_18/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>RAHUL DE</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
