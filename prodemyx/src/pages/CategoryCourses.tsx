import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

interface Course {
  id: number;
  title: string;
  description?: string;
  photo?: string;
  price?: number;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

const CategoryCourses: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch courses for the specific category and all categories in parallel
        const [coursesRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/public/courses?category_id=${id}`),
          fetch(`${API_BASE_URL}/public/categories`),
        ]);

        if (!coursesRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const coursesData: Course[] = await coursesRes.json();
        const categoriesData: Category[] = await categoriesRes.json();

        setCourses(coursesData);
        const category = categoriesData.find((c) => String(c.id) === id);
        setCategoryName(category ? category.name : "Courses");

      } catch (err) {
        console.error(err);
        setError("Unable to load courses for this category.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
      <h1 className="text-center text-3xl font-bold text-gray-900 mb-10">
        {categoryName ? `${categoryName} Courses` : "Courses"}
      </h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {!loading && error && (
        <p className="text-center text-red-500">{error}</p>
      )}
      {!loading && !error && courses.length === 0 && (
        <p className="text-center text-gray-500">No courses found.</p>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/course/${course.id}`)}
              className="cursor-pointer bg-white rounded-2xl border shadow-md hover:shadow-xl transition overflow-hidden p-5"
            >
              <img
                src={
                  course.photo
                    ? `${API_BASE_URL}${course.photo.replace(/^(?:https?:\/\/[^/]+)?(?:\/api)?/, "")}`
                    : "/placeholder.jpg"
                }
                alt={course.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.jpg";
                }}
              />

              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {course.title}
              </h3>

              <p className="text-gray-600 text-sm mb-3">{categoryName}</p>

              <p className="text-indigo-600 font-semibold text-md">
                {course.price ? `₹${course.price}` : "Free"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCourses;
