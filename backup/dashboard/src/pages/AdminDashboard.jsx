import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api.js";

// Unified authenticated fetch
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    ...options,
  });

  let text = await res.text();

  try {
    const json = JSON.parse(text);
    if (!res.ok) throw new Error(json.message || "API Error");
    return json;
  } catch (e) {
    console.error("Non-JSON response:", text);
    throw new Error("Invalid server response");
  }
};

import Sidebar from "../components/sidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    total_courses: 0,
    total_enrollments: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || user.role !== "admin") {
      navigate("/login");
      return;
    }

    loadStats();
  }, []);

  // FIXED: correct backend endpoint
  const loadStats = async () => {
    try {
      const data = await apiFetch("/admin/summary");
      setStats({
        total_users: data.total_users,
        total_courses: data.total_courses,
        total_enrollments: data.total_enrollments,
      });
    } catch (err) {
      console.error("Admin Dashboard Load Error:", err);
    }
  };

  return (
    <div className="bg-background-light font-display text-[#333333] min-h-screen">
      <div className="relative flex min-h-screen w-full">

        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="flex-1">
          <TopNavbar />

          <main className="p-6">
            <h1 className="text-[#111318] text-3xl font-bold mb-6">Dashboard</h1>
            <StatsSection stats={stats} />
            <ChartsAndLists />
          </main>
        </div>

      </div>
    </div>
  );
};

const TopNavbar = () => (
  <header className="flex justify-between items-center border-b bg-white px-6 py-3">
    <input
      className="bg-background-light px-4 h-10 rounded-lg border"
      placeholder="Search courses, users..."
    />
    <div className="flex items-center gap-4">
      <span className="material-symbols-outlined text-xl">notifications</span>
      <div
        className="size-10 rounded-full bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPp9CSCQemHquzD1XC0S3-n6DQ-Ul8SJwLt3RGkcHUTNIxEJD0fiZazL-cW5yOe6Gr6fE_4Ya8bGDv6uSk_6I6svjn6xQ0RaGmrIiJxOkF8_xJONIC5Y7PAZT18FdX7LTvQyF-aoXmA2JCOiL1BK1PdvQNOMCQVmE1epROI_kYPgzcLopSW2pxrAsp9e3tGD1H59-y8CncVnBZTxasd_0MYLfNc_tjJ7mwPgHgxvXYHHAUeTxjRDV_JZwNSh9pXRAc68mRvgPr34g")',
        }}
      ></div>
    </div>
  </header>
);

const StatsSection = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <StatBox title="Total Users" value={stats.total_users} />
    <StatBox title="Total Courses" value={stats.total_courses} />
    <StatBox title="Total Enrollments" value={stats.total_enrollments} />
    <StatBox title="Completion Rate" value="76%" />
  </div>
);

const StatBox = ({ title, value }) => (
  <div className="p-6 bg-white rounded-xl border">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold text-[#111318]">{value}</p>
  </div>
);

const ChartsAndLists = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Placeholder */}
  </div>
);

export default AdminDashboard;
