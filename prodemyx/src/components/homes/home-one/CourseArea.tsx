import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../api";

interface Course {
  id: number;
  title: string;
  short_description: string;
  photo: string;
  category_name: string;
}

const CATEGORY_TABS = [
  "All Courses",
  "Fullstack",
  "DevOps",
  "Cloud",
  "Machine Learning",
  "AI",
  "LLMOps",
];

const CourseArea = ({ style }: { style: boolean }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCategory, setActiveCategory] =
    useState<string>("All Courses");

  /* ---------------- FETCH COURSES ---------------- */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/public/courses`
        );
        const data = await response.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  /* ---------------- FILTER COURSES ---------------- */
  const filteredCourses =
    activeCategory === "All Courses"
      ? courses
      : courses.filter(
          (c) =>
            c.category_name?.toLowerCase() ===
            activeCategory.toLowerCase()
        );

  /* ---------------- SLIDER SETTINGS ---------------- */
  const setting = {
    slidesPerView: 4,
    loop: filteredCourses.length > 4,
    spaceBetween: 30,
    observer: true,
    observeParents: true,
    autoplay: false,
    navigation: {
      nextEl: ".courses-button-next",
      prevEl: ".courses-button-prev",
    },
    breakpoints: {
      1500: { slidesPerView: 4 },
      1200: { slidesPerView: 4 },
      992: { slidesPerView: 3, spaceBetween: 24 },
      768: { slidesPerView: 2, spaceBetween: 24 },
      576: { slidesPerView: 1 },
      0: { slidesPerView: 1 },
    },
  };

  return (
    <section
      className={`courses-area ${
        style
          ? "section-py-120"
          : "section-pt-120 section-pb-90"
      }`}
      style={{
        backgroundImage: `url(/assets/img/bg/courses_bg.jpg)`,
      }}
    >
      <div className="container">
        {/* ---------------- TITLE ---------------- */}
        <div className="section__title-wrap">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="section__title text-center mb-30">
                <span className="sub-title">
                  Programs That Redefine Learning
                </span>
                <h2 className="title">
                  Explore Our World&apos;s Best Courses
                </h2>
                <p className="desc">
                  Built for learners who want skills that actually
                  run in the real world.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- CATEGORY TABS ---------------- */}
        <div className="course-category-tabs text-center mb-40">
          <ul className="list-wrap d-flex justify-content-center gap-4 flex-wrap">
            {CATEGORY_TABS.map((cat) => (
              <li key={cat}>
                <button
                  className={`category-tab-btn ${
                    activeCategory === cat ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- SLIDER ---------------- */}
        <Swiper
          {...setting}
          modules={[Autoplay, Navigation]}
          className="swiper courses-swiper-active"
        >
          {filteredCourses.map((item) => (
            <SwiperSlide key={item.id} className="swiper-slide">
              <div className="courses__item shine__animate-item">
                <div className="courses__item-thumb">
                  <Link
                    to={`/course/${item.id}`}
                    className="shine__animate-link"
                  >
                    <img src={item.photo} alt={item.title} />
                  </Link>
                </div>

                <div className="courses__item-content">
                  <ul className="courses__item-meta list-wrap">
                    <li className="courses__item-tag">
                      {item.category_name}
                    </li>
                  </ul>

                  <h5 className="title">
                    <Link to={`/course/${item.id}`}>
                      {item.title}
                    </Link>
                  </h5>

                  <div className="courses__item-bottom">
                    <div className="button">
                      <Link to={`/course/${item.id}`}>
                        <span className="text">Enroll Now</span>
                        <i className="flaticon-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ---------------- NAV BUTTONS ---------------- */}
        {!style && (
          <div className="courses__nav">
            <div className="courses-button-prev">
              <i className="flaticon-arrow-right"></i>
            </div>
            <div className="courses-button-next">
              <i className="flaticon-arrow-right"></i>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- REQUIRED CSS ---------------- */}
      <style>
        {`
          .category-tab-btn {
            background: transparent;
            border: none;
            font-size: 16px;
            font-weight: 600;
            color: #6b7280;
            padding: 6px 12px;
            cursor: pointer;
            position: relative;
          }

          .category-tab-btn.active {
            color: #1e40af;
          }

          .category-tab-btn.active::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -6px;
            width: 100%;
            height: 3px;
            background-color: #1e40af;
            border-radius: 2px;
          }
        `}
      </style>
    </section>
  );
};

export default CourseArea;
