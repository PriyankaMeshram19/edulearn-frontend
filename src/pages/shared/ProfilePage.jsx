import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/profile").then((res) => {
      setProfile(res.data);
      setName(res.data.name);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await api.put("/profile", { name });
      setProfile(res.data);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const backLink = user?.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard";

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <Link to={backLink} className="text-sm text-purple-600 hover:underline mb-4 inline-block">
          &larr; Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mb-1">My Profile</h1>
        <p className="text-sm text-slate-500 mb-6">View and update your account details</p>

        {message && (
          <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md p-2 text-sm mb-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-700 bg-red-50 border border-red-200 rounded-md p-2 text-sm mb-4">
            {error}
          </p>
        )}

        {!profile ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                value={profile.email}
                disabled
                className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-lg p-2.5 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <input
                value={profile.role}
                disabled
                className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-lg p-2.5 text-sm cursor-not-allowed"
              />
            </div>

            <button type="submit" disabled={loading}
              className="bg-gradient-to-r from-sky-500 to-purple-500 hover:opacity-90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm mt-2">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}