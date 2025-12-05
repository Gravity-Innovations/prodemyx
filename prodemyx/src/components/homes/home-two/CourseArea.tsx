import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../api";

interface Course {
  id: number;
  title: string;
  short_description: string;
  photo: string;
  category_name: string;
}

const CourseArea = ({ style }: { style: boolean }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/courses`);
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // slider setting
  const setting = {
    slidesPerView: 4,
    loop: true,
    spaceBetween: 30,
    observer: true,
    observeParents: true,
    autoplay: false,
    navigation: {
      nextEl: '.courses-button-next',
      prevEl: '.courses-button-prev',
    },
    breakpoints: {
      '1500': { slidesPerView: 4 },
      '1200': { slidesPerView: 4 },
      '992': { slidesPerView: 3, spaceBetween: 24 },
      '768': { slidesPerView: 2, spaceBetween: 24 },
      '576': { slidesPerView: 1 },
      '0': { slidesPerView: 1 },
    },
  };

  return (
    <section className={`courses-area ${style ? "section-py-120" : "section-pt-120 section-pb-90"}`} style={{ backgroundImage: `url(/assets/img/bg/courses_bg.jpg )` }}>
      <div className="container">
        <div className="section__title-wrap">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="section__title text-center mb-40">
                <span className="sub-title">Top Class Courses</span>
                <h2 className="title">Explore Our World&apos;s Best Courses</h2>
                <p className="desc">When known printer took a galley of type scrambl edmake</p>
              </div>
            </div>
          </div>
        </div>

        <Swiper {...setting} modules={[Autoplay, Navigation]} className="swiper courses-swiper-active">
          {courses.map((item) => (
            <SwiperSlide key={item.id} className="swiper-slide">
              <div className="courses__item shine__animate-item">
                <div className="courses__item-thumb">
                  <Link to={`/course-details/${item.id}`} className="shine__animate-link">
                    <img src={item.photo} alt={item.title} />
                  </Link>
                </div>
                <div className="courses__item-content">
                  <ul className="courses__item-meta list-wrap">
                    <li className="courses__item-tag">
                      <Link to={`/courses?category=${item.category_name}`}>{item.category_name}</Link>
                    </li>
                  </ul>
                  <h5 className="title"><Link to={`/course-details/${item.id}`}>{item.title}</Link></h5>
                  <div className="courses__item-bottom">
                    <div className="button">
                      <Link to={`/course-details/${item.id}`}>
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
        {!style &&
          <div className="courses__nav">
            <div className="courses-button-prev"><i className="flaticon-arrow-right"></i></div>
            <div className="courses-button-next"><i className="flaticon-arrow-right"></i></div>
          </div>
        }
        <div className="row justify-content-center">
          <div className="col-lg-3">
            <div className="browse-btn mt-20 text-center">
              <Link to="/categories" className="btn">View All</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourseArea;

