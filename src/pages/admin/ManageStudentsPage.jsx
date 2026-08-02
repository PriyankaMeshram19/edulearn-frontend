import { useEffect, useState } from "react";
import api from "../../services/api";

const avatarColors = [
  "bg-purple-500", "bg-sky-500", "bg-indigo-500", "bg-fuchsia-500", "bg-blue-500",
];

export default function ManageStudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get("/admin/students").then((res) => setStudents(res.data));
  }, []);

  const initials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 px-4 py-8 sm:px-6">
      <div className="bg-slate-900 px-4 sm:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          All Students ({students.length})
        </h1>
        <p className="text-slate-400 text-sm mt-1">Everyone registered on EduLearn</p>
      </div>

      <div className="px-4 sm:px-8 py-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map((s, i) => (
            <div key={s.id} className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${avatarColors[i % avatarColors.length]} text-white flex items-center justify-center font-semibold shrink-0`}>
                {initials(s.name)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 truncate">{s.name || "Unnamed"}</p>
                <p className="text-sm text-slate-500 truncate">{s.email}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Joined {new Date(s.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}