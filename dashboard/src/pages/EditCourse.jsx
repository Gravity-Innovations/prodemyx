// frontend/src/pages/EditCourse.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { apiFetch } from "../api";

export default function EditCourse() {
    const navigate = useNavigate();
    const { id } = useParams();

    // form state
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [instructorId, setInstructorId] = useState("");
    const [zoomLink, setZoomLink] = useState("");
    const [scheduleMorning, setScheduleMorning] = useState(false);
    const [scheduleEvening, setScheduleEvening] = useState(false);
    const [scheduleWeekend, setScheduleWeekend] = useState(false);

    // Files (File objects for new uploads)
    const [materialFile, setMaterialFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    // Existing file paths (for display)
    const [existingMaterialUrl, setExistingMaterialUrl] = useState("");
    const [existingCoverUrl, setExistingCoverUrl] = useState("");

    // backend data
    const [categories, setCategories] = useState([]);
    const [instructors, setInstructors] = useState([]);

    // UI state
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function loadData() {
            try {
                const [cats, users, course] = await Promise.all([
                    apiFetch("/api/categories", { method: "GET" }),
                    apiFetch("/api/users", { method: "GET" }),
                    apiFetch(`/public/courses/${id}`, { method: "GET" }),
                ]);

                if (!mounted) return;

                setCategories(Array.isArray(cats) ? cats : []);
                setInstructors(
                    Array.isArray(users) ? users.filter((u) => u.role === "instructor") : []
                );

                // Populate form
                if (course) {
                    setTitle(course.title || "");
                    setShortDescription(course.short_description || "");
                    setLongDescription(course.long_description || "");
                    setCategoryId(course.category_id || "");
                    setInstructorId(course.instructor_id || "");
                    setZoomLink(course.zoom_link || "");

                    setScheduleMorning(!!course.schedule_morning);
                    setScheduleEvening(!!course.schedule_evening);
                    setScheduleWeekend(!!course.schedule_weekend);

                    setExistingCoverUrl(course.photo || "");
                    setExistingMaterialUrl(course.material_url || "");
                }
            } catch (err) {
                console.error("Failed to load data:", err);
                alert("Failed to load course data.");
                navigate("/coursemanagement");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadData();

        return () => {
            mounted = false;
        };
    }, [id, navigate]);

    const handleCoverSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            // Create a preview URL
            setExistingCoverUrl(URL.createObjectURL(file));
        }
    };

    const handleMaterialSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setMaterialFile(file);
        }
    };

    async function handleSubmit(status = "published") {
        if (!title.trim() || !categoryId) {
            alert("Please provide a title and select a category.");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            if (shortDescription) formData.append("short_description", shortDescription.trim());
            if (longDescription) formData.append("long_description", longDescription.trim());
            formData.append("category_id", categoryId);
            if (instructorId) formData.append("instructor_id", instructorId);
            if (zoomLink) formData.append("zoom_link", zoomLink.trim());

            formData.append("schedule_morning", scheduleMorning);
            formData.append("schedule_evening", scheduleEvening);
            formData.append("schedule_weekend", scheduleWeekend);

            formData.append("status", status);

            if (coverFile) {
                formData.append("photo", coverFile);
            }
            if (materialFile) {
                formData.append("material", materialFile);
            }

            // We need to use fetch directly for FormData because apiFetch might default to JSON
            // But we need to attach the token.
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
                method: "PUT",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    // Do NOT set Content-Type, browser sets it for FormData
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update failed");

            // success UI
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000);

            // navigate back
            setTimeout(() => navigate("/coursemanagement"), 900);
        } catch (err) {
            console.error("Update course failed:", err);
            alert("Failed to update course: " + (err.message || "unknown error"));
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="font-display bg-background-light dark:bg-background-dark relative flex min-h-screen w-full">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* breadcrumbs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <a
                            className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary cursor-pointer"
                            onClick={() => navigate("/coursemanagement")}
                        >
                            Courses
                        </a>
                        <span className="text-gray-400 dark:text-gray-500 text-sm font-medium leading-normal">/</span>
                        <span className="text-gray-900 dark:text-white text-sm font-medium leading-normal">Edit Course</span>
                    </div>

                    {/* header */}
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Edit Course</h1>
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
                                Update Course
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
                                            className="form-input flex w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-11 px-3"
                                        />
                                    </label>

                                    <label className="flex flex-col w-full">
                                        <p className="text-gray-900 dark:text-white text-sm font-medium pb-2">Short Description</p>
                                        <textarea
                                            value={shortDescription}
                                            onChange={(e) => setShortDescription(e.target.value)}
                                            className="form-textarea flex w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-20 p-3"
                                        />
                                    </label>

                                    <label className="flex flex-col w-full">
                                        <p className="text-gray-900 dark:text-white text-sm font-medium pb-2">Long Description</p>
                                        <textarea
                                            value={longDescription}
                                            onChange={(e) => setLongDescription(e.target.value)}
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
                                                onChange={handleCoverSelect}
                                            />
                                        </label>
                                    </div>

                                    {existingCoverUrl && (
                                        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center gap-3">
                                            <img
                                                src={existingCoverUrl}
                                                className="w-16 h-16 rounded object-cover"
                                                alt="Cover"
                                            />
                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">Current Cover</p>
                                                {coverFile && <p className="text-xs text-green-500">New file selected: {coverFile.name}</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Scheduling */}
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                                    <h3 className="text-gray-900 dark:text-white text-lg font-bold">Scheduling &amp; Logistics</h3>
                                </div>
                                <div className="p-6 grid gap-6">
                                    <div className="flex flex-col w-full">
                                        <p className="text-gray-900 dark:text-white text-sm font-medium pb-2">Course Schedule</p>
                                        <div className="flex flex-wrap gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={scheduleMorning} onChange={(e) => setScheduleMorning(e.target.checked)} className="form-checkbox rounded text-primary" />
                                                <span className="text-gray-700 dark:text-gray-300 text-sm">Morning</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={scheduleEvening} onChange={(e) => setScheduleEvening(e.target.checked)} className="form-checkbox rounded text-primary" />
                                                <span className="text-gray-700 dark:text-gray-300 text-sm">Evening</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={scheduleWeekend} onChange={(e) => setScheduleWeekend(e.target.checked)} className="form-checkbox rounded text-primary" />
                                                <span className="text-gray-700 dark:text-gray-300 text-sm">Weekend</span>
                                            </label>
                                        </div>
                                    </div>
                                    <label className="flex flex-col w-full">
                                        <p className="text-gray-900 dark:text-white text-sm font-medium pb-2">Zoom Meeting Link</p>
                                        <input value={zoomLink} onChange={(e) => setZoomLink(e.target.value)} className="form-input flex w-full rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-11 px-3" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* right column */}
                        <div className="lg:col-span-1 flex flex-col gap-8">
                            {/* Materials */}
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
                                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, PPT, MP4</p>
                                            </div>
                                            <input className="hidden" type="file" onChange={handleMaterialSelect} />
                                        </label>
                                    </div>
                                    {(existingMaterialUrl || materialFile) && (
                                        <div className="mt-4 space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-primary">description</span>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {materialFile ? materialFile.name : "Current Material"}
                                                        </p>
                                                        {existingMaterialUrl && !materialFile && (
                                                            <a href={existingMaterialUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline">View</a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                        <p className="text-sm">Course updated successfully.</p>
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
