import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const avatarColors = [
  "bg-purple-500", "bg-sky-500", "bg-indigo-500", "bg-fuchsia-500", "bg-blue-500",
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseEnrollments, setCourseEnrollments] = useState({});
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
    api.get("/admin/courses").then((res) => setCourses(res.data));
  }, []);

  const toggleCourse = async (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      return;
    }
    setExpandedCourse(courseId);
    if (!courseEnrollments[courseId]) {
      const res = await api.get(`/admin/courses/${courseId}/enrollments`);
      setCourseEnrollments((prev) => ({ ...prev, [courseId]: res.data }));
    }
  };

  const initials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300">
      {/* HEADER */}
      <div className="bg-slate-900 px-4 sm:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your courses and students</p>
      </div>

      <div className="px-4 sm:px-8 py-8 -mt-6">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-sky-500">
            <p className="text-3xl font-bold text-slate-800">{stats?.totalCourses ?? "..."}</p>
            <p className="text-sm text-slate-500 mt-1">Total Courses</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-purple-500">
            <p className="text-3xl font-bold text-slate-800">{stats?.totalStudents ?? "..."}</p>
            <p className="text-sm text-slate-500 mt-1">Total Students</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-indigo-500">
            <p className="text-3xl font-bold text-slate-800">{stats?.totalEnrollments ?? "..."}</p>
            <p className="text-sm text-slate-500 mt-1">Total Enrollments</p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <Link to="/admin/courses"
            className="bg-gradient-to-r from-sky-500 to-purple-500 hover:opacity-90 text-white text-sm font-semibold px-5 py-3 rounded-xl text-center shadow-md">
            + Manage Courses
          </Link>
          <Link to="/admin/students"
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold px-5 py-3 rounded-xl text-center shadow-sm">
            View All Students
          </Link>
        </div>

        {/* PER-COURSE ENROLLMENT CARDS */}
        <h2 className="text-lg font-bold text-slate-800 mb-4">Enrollment by Course</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-slate-800 leading-snug">{course.title}</h3>
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                    course.status === "PUBLISHED" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {course.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">By {course.authorName}</p>

                <button
                  onClick={() => toggleCourse(course.id)}
                  className="w-full flex items-center justify-between bg-gradient-to-r from-sky-50 to-purple-50 hover:from-sky-100 hover:to-purple-100 rounded-xl px-4 py-3 transition"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {courseEnrollments[course.id]?.length ?? "…"} student(s) enrolled
                  </span>
                  <span className="text-purple-600 text-sm font-semibold">
                    {expandedCourse === course.id ? "Hide" : "View"}
                  </span>
                </button>
              </div>

              {expandedCourse === course.id && (
                <div className="border-t border-slate-100 p-4 bg-slate-50 flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {!courseEnrollments[course.id] ? (
                    <p className="text-xs text-slate-400 text-center py-3">Loading...</p>
                  ) : courseEnrollments[course.id].length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-3">No students enrolled yet.</p>
                  ) : (
                    courseEnrollments[course.id].map((s, i) => (
                      <div key={s.enrollmentId} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
                        <div className={`w-8 h-8 rounded-full ${avatarColors[i % avatarColors.length]} text-white flex items-center justify-center text-xs font-semibold shrink-0`}>
                          {initials(s.studentName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{s.studentName || "Unnamed"}</p>
                          <p className="text-[11px] text-slate-400 truncate">{s.studentEmail}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                          s.completed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {s.completed ? "Done" : "Active"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}