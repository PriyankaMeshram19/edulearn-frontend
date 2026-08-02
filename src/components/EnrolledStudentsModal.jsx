import { useEffect, useState } from "react";
import api from "../services/api";

const avatarColors = [
  "bg-purple-500", "bg-pink-500", "bg-emerald-500",
  "bg-amber-500", "bg-sky-500", "bg-rose-500", "bg-indigo-500",
];

export default function EnrolledStudentsModal({ course, onClose }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/courses/${course.id}/enrollments`)
      .then((res) => setStudents(res.data))
      .finally(() => setLoading(false));
  }, [course.id]);

  const initials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
  
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 px-4 py-8 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs opacity-80">Enrolled students in</p>
            <p className="font-semibold">{course.title}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-600">Total enrolled</span>
          <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
            {students.length} {students.length === 1 ? "student" : "students"}
          </span>
        </div>

        <div className="overflow-y-auto p-5 flex-1">
          {loading ? (
            <p className="text-center text-gray-500 py-6">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No students enrolled yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {students.map((s, i) => (
                <div key={s.enrollmentId}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:shadow-sm transition">
                  <div className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} text-white flex items-center justify-center font-semibold text-sm shrink-0`}>
                    {initials(s.studentName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{s.studentName || "Unnamed Student"}</p>
                    <p className="text-xs text-gray-500 truncate">{s.studentEmail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      s.completed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {s.completed ? "Completed" : "In Progress"}
                    </span>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(s.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}