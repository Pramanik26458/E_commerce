// src/pages/Login.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Paste at: src/pages/Login.jsx   (NEW FILE — add route in App.jsx)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthStore";

export default function Login() {
  const navigate        = useNavigate();
  const { login, isLoggedIn } = useAuth();

  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    // Simulate small delay for UX
    await new Promise((r) => setTimeout(r, 600));

    const result = login({ email, password });
    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => navigate("/"), 1000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', Georgia, serif !important; }
      `}</style>

      {/* LEFT — decorative panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.25) saturate(0.4)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080808]" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-16 gap-6">
          <Link to="/" className="text-3xl font-black text-white font-serif tracking-tight">
            PR<span className="text-amber-400">.</span>
          </Link>
          <h2 className="text-5xl font-black text-white font-serif leading-tight">
            Welcome
            <br />
            <span className="italic text-amber-400">Back.</span>
          </h2>
          <p className="text-white/40 text-base leading-relaxed max-w-sm">
            Sign in to access your orders, wishlist, exclusive drops and member-only discounts.
          </p>
          <div className="flex flex-col gap-3 mt-4">
            {["10,000+ happy customers", "Exclusive member drops", "Early access to sales"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-white/50 text-sm">
                <span className="text-amber-400">✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex justify-center text-2xl font-black text-white font-serif">
            PR<span className="text-amber-400">.</span>
          </Link>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-black text-white font-serif">Sign In</h1>
            <p className="text-white/35 text-sm mt-1">
              Don't have an account?{" "}
              <Link to="/signup" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Create one →
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-white/40 text-xs font-bold uppercase tracking-widest block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-amber-400/60 text-white placeholder-white/20 rounded-2xl px-5 py-3.5 text-sm outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/40 text-xs font-bold uppercase tracking-widest">
                  Password
                </label>
                <button type="button" className="text-amber-400 text-xs hover:text-amber-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-amber-400/60 text-white placeholder-white/20 rounded-2xl px-5 py-3.5 text-sm outline-none transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 text-xs transition-colors"
                >
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm px-4 py-3 rounded-xl">
                ✗ {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm px-4 py-3 rounded-xl">
                ✓ {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-black font-black text-sm py-4 rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] hover:scale-[1.02] mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing In...
                </>
              ) : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-white/20 text-xs">or continue as</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Guest */}
          <Link
            to="/"
            className="block text-center border border-white/10 hover:border-white/20 text-white/40 hover:text-white text-sm font-semibold py-3.5 rounded-2xl transition-all duration-300"
          >
            Browse as Guest
          </Link>

          {/* Demo hint */}
          <div className="bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <p className="text-amber-400/70 text-xs font-semibold mb-1">🧪 Test Account</p>
            <p className="text-white/30 text-xs">Sign up first, then use those credentials to log in.</p>
          </div>
        </div>
      </div>
    </div>
  );
}