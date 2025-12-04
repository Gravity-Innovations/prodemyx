import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./CourseDetailsArea.css";

interface Course {
  photo?: string;
  title: string;
  long_description?: string;
  price?: number;
}

const CourseDetailsArea = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    async function loadCourse() {
      const res = await fetch(`http://localhost:5000/public/courses/${id}`);
      const data = await res.json();
      setCourse(data);
    }

    loadCourse();
  }, [id]);

  if (!course) return <div className="container py-5">Loading...</div>;

  return (
    <section className="courses__details-area section-py-120">
      <div className="container">
        <div className="row">

          {/* LEFT SIDE — COURSE IMAGE */}
          <div className="col-xl-6 col-lg-6">
            <div className="courses__details-thumb">
              <img
                src={
                  course.photo
                    ? course.photo.startsWith("http")
                      ? course.photo
                      : `http://localhost:5000${course.photo}`
                    : "/assets/img/courses/courses_details.jpg"
                }
                alt="Course"
              />
            </div>
          </div>

          {/* RIGHT SIDE — COURSE CONTENT */}
          <div className="col-xl-6 col-lg-6">
            <div className="courses__details-content">

              <h2 className="title">{course.title}</h2>
              {/* LONG DESCRIPTION INSTEAD OF OUTCOME */}
              <p className="course-description">
                {course.long_description || "No description available."}
              </p>

              <h5 className="price">Rs {course.price || 0}.00</h5>

              <div className="courses__item-bottom">
                <div className="button">
                  <Link to="#">
                    <span className="text">Add to Cart</span>
                    <i className="flaticon-arrow-right"></i>
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CourseDetailsArea;
