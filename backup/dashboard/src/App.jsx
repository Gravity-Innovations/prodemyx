// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// PUBLIC PAGES
import Categories from "./pages/Categories";
import CategoryCourses from "./pages/CategoryCourses";
import CourseDetails from "./pages/CourseDetails";
import Login from "./pages/Login";

// ADMIN PAGES
import AdminDashboard from "./pages/AdminDashboard";
import Coursemanagement from "./pages/Coursemanagement";
import CreateCategory from "./pages/CreateCategory";
import Enrollment from "./pages/Enrollment";
import CreateUser from "./pages/CreateUser";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import CreateCourse from "./pages/Createcourse";
import EditCourse from "./pages/EditCourse";

// STUDENT / INSTRUCTOR
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import StudentEnrolledCourses from "./pages/StudentEnrolledCourses";
import InstructorProfile from "./pages/InstructorProfile";
import InstructorAssignedCourses from "./pages/InstructorAssignedCourses";

// ADMIN PROTECTED ROUTE
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter basename="/app">
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* PUBLIC – CATEGORY LISTING */}
        <Route path="/categories" element={<Categories />} />

        {/* PUBLIC – COURSES INSIDE A CATEGORY */}
        <Route path="/categories/:id" element={<CategoryCourses />} />

        {/* PUBLIC – COURSE DETAILS */}
        <Route path="/course/:id" element={<CourseDetails />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admindashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/coursemanagement"
          element={
            <AdminRoute>
              <Coursemanagement />
            </AdminRoute>
          }
        />

        <Route
          path="/createcourse"
          element={
            <AdminRoute>
              <CreateCourse />
            </AdminRoute>
          }
        />

        <Route
          path="/editcourse/:id"
          element={
            <AdminRoute>
              <EditCourse />
            </AdminRoute>
          }
        />

        <Route
          path="/createcategory"
          element={
            <AdminRoute>
              <CreateCategory />
            </AdminRoute>
          }
        />

        <Route
          path="/enrollment"
          element={
            <AdminRoute>
              <Enrollment />
            </AdminRoute>
          }
        />

        <Route
          path="/createuser"
          element={
            <AdminRoute>
              <CreateUser />
            </AdminRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />

        <Route
          path="/usermanagement"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />

        {/* STUDENT ROUTES */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/enrolled-courses" element={<StudentEnrolledCourses />} />

        {/* INSTRUCTOR ROUTES */}
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/profile" element={<InstructorProfile />} />
        <Route path="/instructor/assigned-courses" element={<InstructorAssignedCourses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
