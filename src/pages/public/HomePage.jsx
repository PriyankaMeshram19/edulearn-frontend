import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import CourseCard from "../../components/CourseCard";
import PaymentModal from "../../components/PaymentModal";
export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/courses")
      .then((res) => setCourses(res.data))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const handleBuyNow = (course) => {
  if (!user) {
    alert("Please log in or sign up first to purchase this course.");
    navigate("/login");
    return;
  }
  setSelectedCourse(course);
  };

 const handlePaymentSuccess = (message) => {
  setSelectedCourse(null);
  alert(message + "\n\nA receipt has been sent to your email.");
  navigate("/student/dashboard");
  };

  const goToDashboard = () => {
    navigate(user.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard");
  };

  // Live filter: title ya author name se match karega, jaise-jaise type karo
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.authorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 shadow-sm bg-white sticky top-0 z-20">
        <div className="font-bold text-xl text-purple-700">EduLearn</div>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <a href="/" className="hover:text-purple-700">Home</a>
          <a href="#courses" className="hover:text-purple-700">Courses</a>
          <a href="#contact" className="hover:text-purple-700">Contact</a>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
            {search && filteredCourses.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-100 rounded-lg shadow-lg max-h-60 overflow-y-auto z-30">
                {filteredCourses.map((c) => (
                  <a
                    key={c.id}
                    href="#courses"
                    onClick={() => setSearch("")}
                    className="block px-3 py-2 text-sm hover:bg-gray-50 border-b last:border-0"
                  >
                    <span className="font-medium text-gray-800">{c.title}</span>
                    <span className="block text-xs text-gray-500">By {c.authorName}</span>
                  </a>
                ))}
              </div>
            )}
            {search && filteredCourses.length === 0 && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-100 rounded-lg shadow-lg px-3 py-2 text-sm text-gray-500 z-30">
                No courses found.
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <button onClick={() => navigate("/login")}
                className="text-sm font-medium text-gray-700 hover:text-purple-700">Login</button>
              <button onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-sky-500 to-purple-500 hover:opacity-90 text-white text-sm font-semibold px-4 py-2 rounded-lg">
                Sign Up
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 hover:opacity-90 text-white flex items-center justify-center transition"
                title={user.name}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9V21h19.6v-1.6c0-3.3-6.5-4.9-9.8-4.9z"/>
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 text-sm">
                  <div className="px-4 py-2 text-gray-500 border-b truncate">{user.name}</div>

                  <Link to="/profile" onClick={() => setMenuOpen(false)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                      My Profile
                  </Link>

                  <button
                    onClick={() => { setMenuOpen(false); goToDashboard(); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); navigate("/"); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        className="relative bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200')",
          minHeight: "360px",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 px-6 sm:px-12 max-w-xl text-left text-white py-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Learn new skills, anytime, anywhere
          </h1>
          <p className="text-sm sm:text-base text-gray-100">
            Explore hands-on courses taught by real instructors — build real
            projects and grow your career with EduLearn.
          </p>
        </div>
      </section>

      {/* COURSES SECTION */}
      <section id="courses" className="flex-1 px-4 sm:px-8 py-10 sm:py-14 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
          Explore Our Courses
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading courses...</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-center text-gray-500">No courses available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onBuyNow={handleBuyNow} />
            ))}

            {selectedCourse && (
              <PaymentModal
                course={selectedCourse}
                onClose={() => setSelectedCourse(null)}
                onSuccess={handlePaymentSuccess}
              />
              )}
          </div>
        )}
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="bg-gray-300 px-4 sm:px-8 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Get in Touch</h2>
          <p className="text-gray-500 text-sm sm:text-base mb-8">
            Have questions? We're here to help.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left sm:text-center">
            <div className="flex sm:flex-col items-center sm:items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M6.6 10.8c1.4 2.8 3.7 5 6.5 6.5l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8z"/>
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Call us</p>
                <p className="text-sm text-gray-500">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M2 4h20v16H2V4zm2 2v.01L12 12l8-5.99V6H4zm16 12V8.24l-8 5.99-8-5.99V18h16z"/>
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Email us</p>
                <p className="text-sm text-gray-500">support@edulearn.com</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.8 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.8V21c0 .3.2.6.7.5C19.1 20.2 22 16.4 22 12c0-5.5-4.5-10-10-10z"/>
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Follow us</p>
                <div className="flex gap-3 mt-1 justify-center sm:justify-center">
                  <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.9.2-1.5 1.5-1.5H16V4.2C15.7 4.2 14.7 4 13.6 4 11.2 4 9.6 5.5 9.6 8.1v2.4H7v3h2.6V21h3.9z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-pink-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.4.4.6.2 1 .5 1.5.9.4.4.7.9.9 1.5.2.5.3 1.2.4 2.4.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.4-.2.6-.5 1-.9 1.5-.4.4-.9.7-1.5.9-.5.2-1.2.3-2.4.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.5-1.5-.9-.4-.4-.7-.9-.9-1.5-.2-.5-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.4.2-.6.5-1 .9-1.5.4-.4.9-.7 1.5-.9.5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-1.9.4-.5.2-.8.4-1.2.7-.3.3-.5.7-.7 1.2-.1.3-.3.9-.4 1.9-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 1.9.2.5.4.8.7 1.2.3.3.7.5 1.2.7.3.1.9.3 1.9.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 1.9-.4.5-.2.8-.4 1.2-.7.3-.3.5-.7.7-1.2.1-.3.3-.9.4-1.9.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-1.9-.2-.5-.4-.8-.7-1.2-.3-.3-.7-.5-1.2-.7-.3-.1-.9-.3-1.9-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4zm5.7-2a1 1 0 1 1-2.1 0 1 1 0 0 1 2.1 0z"/>
                    </svg>
                  </a>
                  <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-sky-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.6.8-2.6 1a4 4 0 0 0-6.9 3.7A11.5 11.5 0 0 1 3.6 4.6a4 4 0 0 0 1.3 5.4c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.2 4-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8A8 8 0 0 1 2 18.4a11.4 11.4 0 0 0 6.2 1.8c7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2.2-2.2z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 text-sm py-6 px-4 sm:px-8 text-center">
        © {new Date().getFullYear()} EduLearn. All rights reserved.
      </footer>
    </div>
  );
}