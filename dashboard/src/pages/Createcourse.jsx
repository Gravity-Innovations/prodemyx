// frontend/src/pages/CreateCourse.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { apiFetch } from "../api";

export default function CreateCourse() {
  const navigate = useNavigate();

  // form state
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [scheduleMorning, setScheduleMorning] = useState(true);
  const [scheduleEvening, setScheduleEvening] = useState(false);
  const [scheduleWeekend, setScheduleWeekend] = useState(false);
  const [materialFile, setMaterialFile] = useState(null);
  const [materialPath, setMaterialPath] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPath, setCoverPath] = useState("");

  // backend data
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingMaterial, setUploadingMaterial] = useState(false);

  // ===== MATERIAL UPLOAD =====
  const handleMaterialUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Allowed PDFs only (as per your UI)
    if (file.type !== "application/pdf") {
      alert("Only PDF files allowed.");
      return;
    }

    setMaterialFile(file);
    setUploadingMaterial(true);

    try {
      const formData = new FormData();
      formData.append("material", file);

      const res = await fetch("http://localhost:5000/api/upload-material", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Upload material error response:", data);
        alert(data.message || "Upload failed");
        return;
      }

      // NORMALIZE filePath: backend may return "/uploads/..." or full URL "http://..."
      let path = data.filePath || "";
      if (!path) {
        alert("Upload succeeded but server returned no path.");
        return;
      }

      try {
        // if server returned full URL, extract pathname
        if (path.startsWith("http://") || path.startsWith("https://")) {
          const u = new URL(path);
          path = u.pathname;
        }
      } catch (err) {
        // ignore malformed URL; keep as-is
      }

      // ensure leading slash
      if (!path.startsWith("/")) path = `/${path}`;

      setMaterialPath(path);
    } catch (err) {
      console.error("Material upload failed:", err);
      alert("Upload failed: " + (err.message || "unknown error"));
    } finally {
      setUploadingMaterial(false);
    }
  };

  // ===== COVER UPLOAD =====
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only image files
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Only JPG, PNG, and WEBP files allowed.");
      return;
    }

    setCoverFile(file);
    setUploadingCover(true);

    try {
      const formData = new FormData();
      formData.append("cover", file);

      const res = await fetch("http://localhost:5000/api/upload-cover", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Cover upload error response:", data);
        alert(data.message || "Cover upload failed");
        return;
      }

      // NORMALIZE returned filePath to a path starting with /uploads/...
      let path = data.filePath || "";

      if (!path) {
        alert("Upload succeeded but server returned no path.");
        return;
      }

      try {
        if (path.startsWith("http://") || path.startsWith("https://")) {
          const u = new URL(path);
          path = u.pathname;
        }
      } catch (err) {
        // keep as-is if URL parsing fails
      }

      if (!path.startsWith("/")) path = `/${path}`;

      // store the normalized path (backend expects a path like /uploads/...)
      setCoverPath(path);
    } catch (err) {
      console.error("Cover upload failed:", err);
      alert("Cover upload failed: " + (err.message || "unknown error"));
    } finally {
      setUploadingCover(false);
    }
  };

  useEffect(() => {
    // load categories and instructors in parallel
    let mounted = true;

    async function loadAll() {
      try {
        const [cats, users] = await Promise.all([
          apiFetch("/api/categories", { method: "GET" }),
          apiFetch("/api/users", { method: "GET" }),
        ]);

        if (!mounted) return;

        setCategories(Array.isArray(cats) ? cats : []);
        // filter instructors from users list (role === 'instructor')
        setInstructors(
          Array.isArray(users) ? users.filter((u) => u.role === "instructor") : []
        );
      } catch (err) {
        console.error("Failed to load categories/instructors:", err);
        setCategories([]);
        setInstructors([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(status = "published") {
    if (!title.trim() || !categoryId) {
      alert("Please provide a title and select a category.");
      return;
    }

    // Ensure we send the photo value in normalized form:
    // backend expects '/uploads/...' (it will store as-is)
    let photoToSend = coverPath || null;
    if (photoToSend && photoToSend.startsWith("http")) {
      try {
        const u = new URL(photoToSend);
        photoToSend = u.pathname;
      } catch {}
    }
    if (photoToSend && !photoToSend.startsWith("/")) photoToSend = `/${photoToSend}`;

    const payload = {
      title: title.trim(),
      short_description: shortDescription.trim() || null,
      long_description: longDescription.trim() || null,
      category_id: Number(categoryId),
      zoom_link: zoomLink.trim() || null,
      instructor_id: instructorId ? Number(instructorId) : null,
      schedule_morning: !!scheduleMorning,
      schedule_evening: !!scheduleEvening,
      schedule_weekend: !!scheduleWeekend,
      material_path: materialPath || null,
      photo: photoToSend, // normalized path or null
      status: status,
    };

    setSubmitting(true);
    try {
      await apiFetch("/api/courses", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // success UI
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);

      // navigate back to course management after short delay
      setTimeout(() => navigate("/coursemanagement"), 900);
    } catch (err) {
      console.error("Create course failed:", err);
      alert("Failed to create course: " + (err.message || "unknown error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark relative flex min-h-screen w-full">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <a
              className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary cursor-pointer"
              onClick={() => navigate("/coursemangement")}
            >
              Courses
            </a>
            <span className="text-gray-400 dark:text-gray-500 text-sm font-medium leading-normal">/</span>
            <span className="text-gray-900 dark:text-white text-sm font-medium leading-normal">Create New Course</span>
          </div>

          {/* header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Create New Course</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                Fill in the details below to add a new course to the catalog.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={submitting}
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => handleSubmit("published")}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                disabled={submitting}
              >
                Publish Course
              </button>
            </div>
          </div>

          {/* form grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* left (main form) */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Course Information */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-gray-900 dark:text-white text-lg font-bold">Course Information</h3>
                </div>

                <div className="p-6 grid gap-6">
                  <label className="flex flex-col w-full">
                    <p className="text-gray-900 dark:text-white text-sm font-medium pb-2">Course Title</p>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Introduction to Digital Marketing"
                      className="form-input flex w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-11 px-3"
                    />
                  </label>

                  <label className="flex flex-col w-full">
                    <p className="text-gray-900 dark:text-white text-sm font-medium pb-2">Short Description</p>
                    <textarea
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Short description (shown on course listing)"
                      className="form-textarea flex w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-20 p-3"
                    />
                  </label>

                  <label className="flex flex-col w-full">
                    <p className="text-gray-900 dark:text-white text-sm font-medium pb-2">Long Description</p>
                    <textarea
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                      placeholder="Detailed course description"
                      className="form-textarea flex w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-32 p-3"
                    />
                  </label>

                  <label className="flex flex-col w-full">
                    <p className="text-gray-900 dark:text-white text-sm font-medium pb-2">Course Category</p>

                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="form-select flex w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-11 px-3"
                    >
                      <option value="">Select a category...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {/* Course Cover Photo */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-gray-900 dark:text-white text-lg font-bold">Course Cover Photo</h3>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-35 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-4xl">image</span>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, WEBP (MAX. 5MB)</p>
                      </div>

                      <input
                        className="hidden"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        disabled={uploadingCover}
                      />
                    </label>
                  </div>

                  {coverPath && (
                    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center gap-3">
                      <img
                        src={
                          coverPath.startsWith("http")
                            ? coverPath
                            : `http://localhost:5000${coverPath}`
                        }
                        className="w-16 h-16 rounded object-cover"
                        alt="Cover"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Cover uploaded</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{coverFile?.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Scheduling & Logistics */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-gray-900 dark:text-white text-lg font-bold">Scheduling &amp; Logistics</h3>
                </div>

                <div className="p-6 grid gap-6">
                  <div className="flex flex-col w-full">
                    <p className="text-gray-900 dark:text-white text-sm font-medium pb-2">Course Schedule</p>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scheduleMorning}
                          onChange={(e) => setScheduleMorning(e.target.checked)}
                          className="form-checkbox rounded text-primary"
                        />{" "}
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Morning</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scheduleEvening}
                          onChange={(e) => setScheduleEvening(e.target.checked)}
                          className="form-checkbox rounded text-primary"
                        />{" "}
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Evening</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scheduleWeekend}
                          onChange={(e) => setScheduleWeekend(e.target.checked)}
                          className="form-checkbox rounded text-primary"
                        />{" "}
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Weekend</span>
                      </label>
                    </div>
                  </div>

                  <label className="flex flex-col w-full">
                    <p className="text-gray-900 dark:text-white text-sm font-medium pb-2">Zoom Meeting Link</p>
                    <input
                      value={zoomLink}
                      onChange={(e) => setZoomLink(e.target.value)}
                      placeholder="https://zoom.us/j/..."
                      className="form-input flex w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-11 px-3"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* right column */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              {/* Course Materials */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-gray-900 dark:text-white text-lg font-bold">Course Materials</h3>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-4xl">cloud_upload</span>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, PPT, MP4 (MAX. 50MB)</p>
                      </div>
                      <input className="hidden" type="file" onChange={handleMaterialUpload} disabled={uploadingMaterial} />
                    </label>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">description</span>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">course-syllabus.pdf</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">1.2 MB</p>
                        </div>
                      </div>
                      <button className="text-gray-500 hover:text-error dark:text-gray-400 dark:hover:text-error">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructor */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-gray-900 dark:text-white text-lg font-bold">Instructor</h3>
                </div>

                <div className="p-6">
                  <label className="flex flex-col w-full">
                    <p className="text-gray-900 dark:text-white text-sm font-medium pb-2">Assign Instructor</p>
                    <select
                      value={instructorId}
                      onChange={(e) => setInstructorId(e.target.value)}
                      className="form-select flex w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-11 px-3"
                    >
                      <option value="">Select an instructor...</option>
                      {instructors.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name || u.email}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {/* success toast */}
              {toastVisible && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-success/10 text-success">
                  <span className="material-symbols-outlined mt-0.5">check_circle</span>
                  <div className="flex flex-col">
                    <p className="font-medium text-sm">Success!</p>
                    <p className="text-sm">Your course has been successfully created.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
