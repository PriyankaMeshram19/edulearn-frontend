import EnrolledStudentsModal from "../../components/EnrolledStudentsModal";
import { useEffect, useState } from "react";
import api from "../../services/api";

const emptyForm = {
  title: "", authorName: "", description: "", thumbnailUrl: "",
  price: "", youtubeVideoUrl: "", documentationContent: "", status: "PUBLISHED",
};

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewingCourse, setViewingCourse] = useState(null);

  const loadCourses = () => {
    api.get("/admin/courses").then((res) => setCourses(res.data));
  };

  useEffect(() => { loadCourses(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/admin/courses/${editingId}`, form);
      } else {
        await api.post("/admin/courses", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadCourses();
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setForm({
      title: course.title,
      authorName: course.authorName,
      description: course.description || "",
      thumbnailUrl: course.thumbnailUrl || "",
      price: course.price,
      youtubeVideoUrl: course.youtubeVideoUrl || "",
      documentationContent: course.documentationContent || "",
      status: course.status,
    });
    setEditingId(course.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    await api.delete(`/admin/courses/${id}`);
    loadCourses();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 px-4 sm:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Manage Courses</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-5 rounded-xl shadow-md h-fit">
          <h2 className="font-semibold text-lg mb-4">
            {editingId ? "Edit Course" : "Add New Course"}
          </h2>
          {error && (
            <p className="text-red-700 bg-red-50 border border-red-200 rounded-md p-2 text-sm mb-3">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3" autoComplete="off">
            <input name="title" placeholder="Course title" value={form.title} onChange={handleChange} required
                   className="border border-gray-300 rounded-lg p-2 text-sm" />
            <input name="authorName" placeholder="Author name" value={form.authorName} onChange={handleChange} required
                   className="border border-gray-300 rounded-lg p-2 text-sm" />
            <textarea name="description" placeholder="Short description" value={form.description} onChange={handleChange}
                   className="border border-gray-300 rounded-lg p-2 text-sm" rows={2} />
            <input name="thumbnailUrl" placeholder="Thumbnail image URL" value={form.thumbnailUrl} onChange={handleChange}
                   className="border border-gray-300 rounded-lg p-2 text-sm" />
            <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange} required
                   className="border border-gray-300 rounded-lg p-2 text-sm" />
            <input name="youtubeVideoUrl" placeholder="YouTube embed URL" value={form.youtubeVideoUrl} onChange={handleChange}
                   className="border border-gray-300 rounded-lg p-2 text-sm" />
            <textarea name="documentationContent" placeholder="Course notes (short paragraph)" value={form.documentationContent} onChange={handleChange}
                   className="border border-gray-300 rounded-lg p-2 text-sm" rows={3} />
            <select name="status" value={form.status} onChange={handleChange}
                   className="border border-gray-300 rounded-lg p-2 text-sm">
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
            <button type="submit" disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg text-sm">
              {loading ? "Saving..." : editingId ? "Update Course" : "Add Course"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null); }}
                      className="text-sm text-gray-500 hover:underline">
                Cancel edit
              </button>
            )}
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-md overflow-x-auto">
          <h2 className="font-semibold text-lg mb-4">All Courses ({courses.length})</h2>
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left border-b text-gray-500">
                <th className="pb-2">Title</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b last:border-0">
                  <td className="py-2 pr-2">{course.title}</td>
                  <td className="py-2 pr-2">₹{course.price}</td>
                  <td className="py-2 pr-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      course.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="py-2 flex gap-2 flex-wrap">
                    <button onClick={() => setViewingCourse(course)} className="text-purple-600 hover:underline">Students</button>
                    <button onClick={() => handleEdit(course)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewingCourse && (
        <EnrolledStudentsModal course={viewingCourse} onClose={() => setViewingCourse(null)} />
      )}
    </div>
  );
}