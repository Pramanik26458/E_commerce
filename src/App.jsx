import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthStore";

import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import AllProduct from "./Pages/AllProduct";
import Men from "./Pages/Men";
import Women from "./Pages/Women";
import Produnct from "./Pages/Produnct";
import About from "./Pages/About";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/Wishlist";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import OrderHistory from "./Pages/OrderHistory";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminLogin from "./Pages/AdminLogin";


// 🔐 User Protected Route
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
}


// 🧠 App Content Wrapper (for hiding navbar)
function AppContent() {
  const location = useLocation();

  // 🔥 Check if admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* 🔥 Hide Navbar in Admin Pages */}
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/allproduct" element={<AllProduct />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/product/:id" element={<Produnct />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* 🔐 Protected Route */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[#080808] flex items-center justify-center flex-col gap-4">
              <span className="text-7xl font-black text-white">404</span>
              <p className="text-white/40 text-sm">Page not found.</p>
              <a
                href="/"
                className="bg-amber-400 text-black font-bold px-6 py-2.5 rounded-full text-sm hover:bg-amber-300 transition-colors"
              >
                Go Home
              </a>
            </div>
          }
        />
      </Routes>
    </>
  );
}


// 🚀 Main App
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}