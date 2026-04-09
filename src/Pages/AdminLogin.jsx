import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../adminStore";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAdmin();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    const res = adminLogin({
      email: form.email,
      password: form.password
    });

    if (res.success) {
      navigate("/admin/dashboard"); // ✅ redirect
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] border border-white/[0.06] rounded-2xl p-8 space-y-6">
        
        {/* Title */}
        <div className="text-center">
          <h1 className="text-white text-2xl font-black">Admin Login</h1>
          <p className="text-white/30 text-sm mt-1">
            Access admin dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="text-white/30 text-xs mb-1 block">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@pr.com"
              className="w-full bg-white/[0.04] border border-white/10 focus:border-amber-400/50 text-white placeholder-white/20 rounded-xl px-4 py-2.5 text-sm outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-white/30 text-xs mb-1 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full bg-white/[0.04] border border-white/10 focus:border-amber-400/50 text-white placeholder-white/20 rounded-xl px-4 py-2.5 text-sm outline-none"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-rose-400 text-xs font-semibold">
              ✗ {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-300 text-black font-black text-sm py-3 rounded-xl transition-colors"
          >
            Login as Admin
          </button>
        </form>

        {/* Hint */}
        <p className="text-white/20 text-xs text-center">
          Default: admin@pr.com / admin123
        </p>
      </div>
    </div>
  );
}