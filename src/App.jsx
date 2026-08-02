import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCoursesPage from "./pages/admin/ManageCoursesPage";
import ManageStudentsPage from "./pages/admin/ManageStudentsPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import NotFoundPage from "./pages/shared/NotFoundPage";
import CoursePlayerPage from "./pages/student/CoursePlayerPage";
import ProfilePage from "./pages/shared/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute allowedRole="ADMIN"><ManageCoursesPage /></ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute allowedRole="ADMIN"><ManageStudentsPage /></ProtectedRoute>
          } />

          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRole="STUDENT"><StudentDashboard /></ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          <Route path="/student/course/:enrollmentId" element={
            <ProtectedRoute allowedRole="STUDENT"><CoursePlayerPage /></ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;