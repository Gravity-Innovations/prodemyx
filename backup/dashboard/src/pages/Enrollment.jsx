import { useEffect, useState } from "react";
import { apiFetch } from "../api"; 
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";


export default function Enrollment() {
  const [enrollments, setEnrollments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadEnrollments();
  }, []);

  async function loadEnrollments() {
    try {
      const data = await apiFetch("/enrollments");
      setEnrollments(data.enrollments);
    } catch (err) {
      console.error(err);
      alert("Failed to load enrollments.");
    }
  }

  async function editEnrollment(id) {
    const status = prompt("Enter new status: Completed / In Progress / Dropped");
    if (!status) return;

    try {
      await apiFetch(`/enrollments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      loadEnrollments();
    } catch (err) {
      alert("Failed to update enrollment");
    }
  }

  async function deleteEnrollment(id) {
    if (!confirm("Remove this student from the course?")) return;

    try {
      await apiFetch(`/enrollments/${id}`, {
        method: "DELETE",
      });
      loadEnrollments();
    } catch (err) {
      alert("Failed to delete enrollment");
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111318] dark:text-white/90 min-h-screen flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-3xl font-bold">Course Enrollments Management</p>
              <p className="text-gray-500">View, add, and manage student course enrollments.</p>
            </div>

            <button
              onClick={() => navigate("/new-enrollment")}
              className="flex items-center gap-2 h-10 px-4 bg-primary text-white rounded-lg"
            >
              <span className="material-symbols-outlined">add</span>
              Enroll Student
            </button>
          </div>

          {/* TABLE */}
          <div className="mt-6 flow-root">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">

                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-white/5">
                      <tr>
                        <th className="pl-6 py-3 text-left text-sm font-semibold">Student Name</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold">Course Name</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold">Enrollment Date</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold">Status</th>
                        <th className="px-3 py-3 text-right text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>

                    <tbody id="enrollment-table" className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-background-dark">

                      {enrollments.map((e) => (
                        <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">

  {/* STUDENT NAME COLUMN (with avatar like HTML page) */}
  <td className="p-3">
    <div className="flex items-center gap-3">
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10"
        style={{
          backgroundImage:
            `url("${e.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDpCNTRq0Pifh6aZSNyGlvmNaxybNQMDSwuxKSYORT6AY0WnI_3C0e2WIvvm9KSm68aCyjTvdg3LI_9GUbxBSm1FAo5TYHtUYRyLI-897n2WAETIm-rDGHeoH77rCDqtSV-ercZwlrzTIvl7ByKf5vmnV-GA4zqLWSNyIeHODep7vLJilkpOxOiWqIH7vYvBnjvTSEB9-A1-ccSNvZLZAeQ_-4oeLLWOTokxhFtB1pdhaMdmInrmrxKmLdzRzNPYvGoW-bCkym1yzk"}")`
        }}
      ></div>

      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {e.student_name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ID: {e.student_id}
        </p>
      </div>
    </div>
  </td>

  {/* COURSE NAME */}
  <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
    {e.course_name}
    <br />
    <span className="text-gray-500 text-xs">{e.course_code || ""}</span>
  </td>

  {/* ENROLL DATE */}
  <td className="p-3 text-sm text-gray-500">
    {new Date(e.enrollment_date).toDateString()}
  </td>

  {/* STATUS BADGE */}
  <td className="p-3">
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
        e.status === "Completed"
          ? "bg-green-100 text-green-800"
          : e.status === "In Progress"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {e.status}
    </span>
  </td>

  {/* ACTIONS */}
  <td className="p-3 text-right">
    <button
      onClick={() => editEnrollment(e.id)}
      className="text-gray-400 hover:text-primary"
    >
      <span className="material-symbols-outlined">edit</span>
    </button>

    <button
      onClick={() => deleteEnrollment(e.id)}
      className="text-gray-400 hover:text-red-500 ml-3"
    >
      <span className="material-symbols-outlined">person_remove</span>
    </button>
  </td>
</tr>

                      ))}

                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}