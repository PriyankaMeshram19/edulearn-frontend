import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function CoursePlayerPage() {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const notesRef = useRef(null);

  useEffect(() => {
    api.get(`/enrollments/${enrollmentId}`)
      .then((res) => setEnrollment(res.data))
      .catch(() => navigate("/student/dashboard"))
      .finally(() => setLoading(false));
  }, [enrollmentId, navigate]);

  useEffect(() => {
    if (enrollment && notesRef.current) {
      const el = notesRef.current;
      if (el.scrollHeight <= el.clientHeight) {
        setScrolledToEnd(true);
      }
    }
  }, [enrollment]);

  const handleNotesScroll = () => {
    const el = notesRef.current;
    if (!el) return;
    const reachedEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    if (reachedEnd) setScrolledToEnd(true);
  };

  const handleMarkComplete = async () => {
    await api.patch(`/enrollments/${enrollmentId}/complete`);
    setEnrollment({ ...enrollment, completed: true });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading course...</div>;
  }

  if (!enrollment) return null;

  const { course, completed } = enrollment;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 px-4 sm:px-8 py-6">
      <Link to="/student/dashboard" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to My Courses
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{course.title}</h1>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            completed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}>
            {completed ? "Completed" : "In Progress"}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-6">By {course.authorName}</p>

        {/* VIDEO */}
        <div className="bg-black rounded-xl overflow-hidden mb-6 max-w-2xl mx-auto aspect-video">
          <iframe
            className="w-full h-full"
            src={course.youtubeVideoUrl}
            title={course.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* NOTES */}
        <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">Course Notes</h2>
          <div
            ref={notesRef}
            onScroll={handleNotesScroll}
            className="text-gray-600 text-sm leading-relaxed max-h-40 overflow-y-auto pr-2 border border-gray-100 rounded-lg p-3"
          >
            {course.documentationContent}
          </div>
          {!scrolledToEnd && !completed && (
            <p className="text-xs text-gray-400 mt-2">Scroll through the notes above to unlock completion.</p>
          )}
        </div>

        {/* MARK COMPLETE */}
        <div className="flex justify-end">
          {completed ? (
            <span className="text-emerald-600 text-sm font-medium">✓ You've completed this course</span>
          ) : (
            <button
              onClick={handleMarkComplete}
              disabled={!scrolledToEnd}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition"
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}