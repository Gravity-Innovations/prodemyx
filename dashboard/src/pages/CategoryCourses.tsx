import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

type Course = {
  id: number;
  title: string;
  price?: number | null;
  photo?: string | null;
  category_id?: number | null;
};

type Category = {
  id: number;
  name: string;
};

export default function CategoryCourses() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch courses and categories at the same time
        const [allCourses, allCategories] = await Promise.all([
          apiFetch("/public/courses") as Promise<Course[]>, // Public endpoint
          apiFetch("/api/categories") as Promise<Category[]>, // Protected endpoint
        ]);

        // Filter courses for the current category
        const filtered = allCourses.filter(
          (c) => String(c.category_id) === String(id)
        );
        setCourses(filtered);

        // Find the category name from the fetched categories
        const match = allCategories.find((c) => String(c.id) === String(id));
        if (match) {
          setCategoryName(match.name);
        } else if (filtered.length > 0) {
          // Fallback if category name isn't in the protected list for some reason
          setCategoryName("Category Courses");
        }
      } catch (err: any) {
        console.error("Failed to load category courses:", err);
        setError("Unable to load courses for this category.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  return (
    <div className="px-6 md:px-12 py-16 max-w-7xl mx-auto">

      {/* TITLE */}
      <h1 className="text-center text-3xl font-bold text-gray-900 mb-10">
        {categoryName ? `${categoryName} Courses` : "Courses"}
      </h1>

      {/* LOADING */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {/* ERROR */}
      {!loading && error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* EMPTY */}
      {!loading && !error && courses.length === 0 && (
        <p className="text-center text-gray-500">
          No courses found in this category.
        </p>
      )}

      {/* COURSE GRID */}
      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/course/${course.id}`)}
              className="cursor-pointer bg-white rounded-2xl border shadow-md hover:shadow-xl transition overflow-hidden p-5"
            >
              {/* IMAGE */}
              <img
                src={course.photo || "/placeholder.jpg"}
                alt={course.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.jpg";
                }}
              />

              {/* TITLE */}
              <h3 className="text-lg font-semibold mb-1">{course.title}</h3>

              {/* CATEGORY */}
              <p className="text-gray-600 text-sm mb-3">{categoryName}</p>

              {/* PRICE */}
              <p className="text-indigo-600 font-semibold text-md">
                {course.price ? `₹${course.price}` : "Free"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
