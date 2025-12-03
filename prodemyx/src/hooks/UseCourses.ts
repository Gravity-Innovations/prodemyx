import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCourses, set_courses as setCoursesAction } from "../redux/features/courseSlice";
import { apiFetch } from "../api"; 

const UseCourses = () => {
   const dispatch = useDispatch();
   const courses = useSelector(selectCourses);
   const [categories, setCategories] = useState([]);

   useEffect(() => {
      const fetchCourses = async () => {
         try {
            const coursesData = await apiFetch('/public/courses');
            dispatch(setCoursesAction(coursesData));
         } catch (error) {
            console.error("Failed to fetch courses:", error);
         }
      };

      const fetchCategories = async () => {
         try {
            const categoriesData = await apiFetch('/api/categories');
            setCategories(categoriesData);
         } catch (error) {
            console.error("Failed to fetch categories:", error);
         }
      };

      fetchCourses();
      fetchCategories();
   }, [dispatch]);

   const setCourses = (newCourses: any) => {
      dispatch(setCoursesAction(newCourses));
   };

   return {
      courses,
      setCourses,
      categories,
   }
}

export default UseCourses;