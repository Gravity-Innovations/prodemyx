// src/pages/PublicCourseDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/features/cartSlice";

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  photo?: string;
}

export default function PublicCourseDetails() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadCourse();
  }, [id]);

  async function loadCourse() {
    try {
      const data = await apiFetch(`/public/courses/${id}`);
      if (!data) {
        setCourse(null);
        return;
      }
      setCourse(data);
    } catch {
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!course) return <div className="p-10 text-center text-red-500">Course not found.</div>;

  return (
    <section className="courses__details-area section-py-120">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-xl-6 col-lg-6">
            <div className="courses__details-thumb">
              <img
                src={course.photo || "/assets/img/courses/courses_details.jpg"}
                alt={course.title}
              />
            </div>
          </div>

          <div className="col-xl-6 col-lg-6">
            <div className="courses__details-content">

              <h2 className="title">{course.title}</h2>
              <p>{course.description}</p>

              <p>
                <b style={{ color: "#000" }}>Outcome</b>: Engineers who can build and ship real products end-to-end
              </p>

              <h5 className="price">Rs {course.price}</h5>

              {/* ONLY ADD TO CART BUTTON */}
              <button
                onClick={() => {
                  dispatch(
                    addToCart({
                      id: course.id,
                      title: course.title,
                      price: course.price,
                      quantity: 1,
                      thumb: course.photo || "/assets/img/courses/courses_details.jpg",
                      user_name: '',
                      user_email: '',
                    })
                  );
                  navigate("/cart");
                }}
                className="w-[360px] h-[55px]"
                style={{
                  backgroundColor: "#F9C93A",
                  color: "#000",
                  padding: "4px 24px",
                  fontWeight: 600,
                  borderRadius: "50px",
                  border: "2px solid #000",
                  boxShadow: "4px 4px 0 #000",
                  cursor: "pointer",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                Add to Cart
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
