import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/enrollments/student")
      .then((res) => setEnrollments(res.data))
      .finally(() => setLoading(false));
  }, []);

  const completedCount = enrollments.filter((e) => e.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 px-4 sm:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome, {user?.name}</h1>
        <p className="text-slate-300 text-sm mt-1">Track your learning progress</p>
      </div>

      <div className="px-4 sm:px-8 py-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-sky-500">
            <p className="text-3xl font-bold text-slate-800">{enrollments.length}</p>
            <p className="text-sm text-slate-500 mt-1">Purchased Courses</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-emerald-500">
            <p className="text-3xl font-bold text-slate-800">{completedCount}</p>
            <p className="text-sm text-slate-500 mt-1">Completed</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-purple-500">
            <p className="text-3xl font-bold text-slate-800">{enrollments.length - completedCount}</p>
            <p className="text-sm text-slate-500 mt-1">In Progress</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-800 mb-4">My Courses</h2>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center text-slate-500">
            You haven't purchased any courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map((e) => (
              <div key={e.id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
                <img src={e.course.thumbnailUrl} alt={e.course.title} className="w-full h-36 object-cover" />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-slate-800">{e.course.title}</h3>
                  <p className="text-sm text-slate-500 mb-3">By {e.course.authorName}</p>
                  <span className={`text-xs w-fit px-2.5 py-1 rounded-full mb-3 font-medium ${
                    e.completed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {e.completed ? "Completed" : "Pending"}
                  </span>
                  <button
                    onClick={() => navigate(`/student/course/${e.id}`)}
                    className="mt-auto bg-gradient-to-r from-sky-500 to-purple-500 hover:opacity-90 text-white text-sm font-semibold py-2 rounded-xl"
                  >
                    {e.completed ? "Review Course" : "Continue Learning"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}