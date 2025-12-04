import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/features/cartSlice";

interface Course {
  id: number;
  title: string;
  long_description?: string;
  price: number;
  photo?: string;
}

export default function PublicCourseDetails() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // NEW: See More toggle
  const [expanded, setExpanded] = useState(false);

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadCourse();
  }, [id]);

  async function loadCourse() {
    try {
      const data = await apiFetch(`/public/courses/${id}`);
      setCourse(data || null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!course)
    return <div className="p-10 text-center text-red-500">Course not found.</div>;

  return (
    <section className="courses__details-area section-py-120">
      <div className="container">
        <div className="row align-items-center">

          {/* LEFT SIDE — IMAGE */}
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
                alt={course.title}
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </div>
          </div>

          {/* RIGHT SIDE — CONTENT */}
          <div className="col-xl-6 col-lg-6">
            <div className="courses__details-content">

              {/* TITLE */}
              <h2 className="title">{course.title}</h2>

              {/* LONG DESCRIPTION (Expandable) */}
              <div className="long-description mb-4" style={{ maxWidth: "90%" }}>
                <p style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
                  {expanded
                    ? course.long_description
                    : (course.long_description || "").slice(0, 300) +
                      ((course.long_description || "").length > 300 ? "..." : "")}
                </p>

                {/* See More / See Less */}
                {course.long_description &&
                  course.long_description.length > 300 && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: "#0047ff",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginTop: "5px",
                        fontSize: "15px",
                      }}
                    >
                      {expanded ? "See Less ▲" : "See More ▼"}
                    </button>
                  )}
              </div>

              {/* PRICE */}
              <h5 className="price">Rs {course.price}</h5>

              {/* ADD TO CART BUTTON */}
              <button
                onClick={() => {
                  dispatch(
                    addToCart({
                      id: course.id,
                      title: course.title,
                      price: course.price,
                      quantity: 1,
                      thumb:
                        course.photo ||
                        "/assets/img/courses/courses_details.jpg",
                      user_name: "",
                      user_email: "",
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
