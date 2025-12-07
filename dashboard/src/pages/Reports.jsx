import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { apiFetch } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/api/reports/summary");
        setSummary(data);
      } catch (err) {
        setError("Failed to load reports summary.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  // Mock data for charts until real data is available
  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 4500 },
    { name: "May", sales: 6000 },
    { name: "Jun", sales: 5500 },
  ];

  const userData = [
    { name: "Students", count: summary?.total_users ? summary.total_users - 1 : 0 },
    { name: "Instructors", count: 1 }, // Assuming at least one instructor
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Reports
        </h1>
        {loading && <p>Loading reports...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold mb-4">Sales Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
