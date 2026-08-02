import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", { token, newPassword });
      setMessage(res.data + " Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 px-4 py-8 sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-800">Reset password</h1>
        <p className="text-sm text-gray-500 mb-5">Enter your new password below</p>

        {message && (
          <p className="text-green-700 bg-green-50 border border-green-200 rounded-md p-2 text-sm mb-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-700 bg-red-50 border border-red-200 rounded-md p-2 text-sm mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input
              type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-5 text-center">
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}