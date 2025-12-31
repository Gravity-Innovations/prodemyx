import { useState } from "react";
import InjectableSvg from "../../../hooks/InjectableSvg";
import SvgAnimation from "../../../hooks/SvgAnimation";
import { Link } from "react-router-dom";
import VideoPopup from "../../../modals/VideoPopup";
import BtnArrow from "../../../svg/BtnArrow";

const Banner = () => {
  const svgIconRef = SvgAnimation(
    "/assets/img/banner/h2_banner_shape02.svg"
  );
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section
        className="banner-area-two banner-bg-two tg-motion-effects"
        style={{
          backgroundImage: `url(/assets/img/banner/banner_bg02.png)`,
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            {/* LEFT CONTENT */}
            <div className="col-xl-5 col-lg-6">
              <div className="banner__content-two">
                <h1
                  className="text-white hero-title"
                  style={{
                    fontSize: "42px",
                    fontWeight: 700,
                    lineHeight: "1.25",
                    letterSpacing: "-0.02em",
                  }}
                >
                  World’s First EdTech
                  <br />
                  Built Entirely on{" "}
                  <span style={{ color: "#facc15" }}>
                    Real Production Infrastructure
                  </span>
                </h1>

                <p
  className="hero-subtitle"
  style={{
    marginTop: "18px",
    fontSize: "18px",
    color: "#cbd5f5",
    maxWidth: "480px",
    lineHeight: "1.6",
  }}
>

                  Learn Coding, DevOps, AIOps, LLMOps &amp; more using the same
                  systems, tools, and workflows used in real companies.
                </p>

                {/* CTA BUTTONS */}
                <div className="banner__btn-two hero-cta">

                  <Link to="" className="btn arrow-btn">
                    Start Now <BtnArrow />
                  </Link>

                  <a
                    onClick={() => setIsVideoOpen(true)}
                    style={{ cursor: "pointer" }}
                    className="play-btn popup-video"
                  >
                    <i className="fas fa-play"></i> Watch Our <br />
                    Class Demo
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="col-xl-7 col-lg-6 col-md-8">
              <div
                className="banner__images-two tg-svg"
                ref={svgIconRef}
              >
                <img
                  src="/assets/img/banner/h2_banner_img.png"
                  alt="img"
                  className="main-img"
                />

                <div
                  className="shape big-shape"
                  data-aos="fade-up"
                  data-aos-delay="600"
                >
                  <InjectableSvg
                    src="/assets/img/banner/h2_banner_shape01.svg"
                    alt="shape"
                    className="injectable tg-motion-effects1"
                  />
                </div>

                <span className="svg-icon"></span>

                <div
                  className="about__enrolled"
                  data-aos="fade-right"
                  data-aos-delay="200"
                >
                  <p className="title">
                    <span>36K+</span> Enrolled Students
                  </p>
                  <img
                    src="/assets/img/others/student_grp.png"
                    alt="img"
                  />
                </div>

                <div
                  className="banner__student"
                  data-aos="fade-left"
                  data-aos-delay="200"
                >
                  <div className="icon">
                    <InjectableSvg
                      src="/assets/img/banner/h2_banner_icon.svg"
                      alt="img"
                      className="injectable"
                    />
                  </div>
                  <div className="content">
                    <span>Total Students</span>
                    <h4 className="title">15K</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <img
          src="/assets/img/banner/h2_banner_shape03.svg"
          alt="shape"
          className="line-shape-two"
          data-aos="fade-right"
          data-aos-delay="1600"
        />
      </section>

      <VideoPopup
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoId="b2Az7_lLh3g"
      />
    </>
  );
};

export default Banner;
