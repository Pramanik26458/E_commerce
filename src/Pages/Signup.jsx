
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthStore";

export default function Signup() {
  const navigate          = useNavigate();
  const { signup, isLoggedIn } = useAuth();

  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [agreed, setAgreed]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6)  s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][strength];
  const strengthColor = ["", "bg-rose-500", "bg-orange-400", "bg-yellow-400", "bg-emerald-400", "bg-emerald-400"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields."); return;
    }
    if (password !== confirm) {
      setError("Passwords don't match."); return;
    }
    if (!agreed) {
      setError("Please agree to the Terms & Privacy Policy."); return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const result = signup({ name, email, password });
    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => navigate("/"), 1200);
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

      {/* LEFT panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.22) saturate(0.4)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080808]" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-16 gap-6">
          <Link to="/" className="text-3xl font-black text-white font-serif tracking-tight">
            PR<span className="text-amber-400">.</span>
          </Link>
          <h2 className="text-5xl font-black text-white font-serif leading-tight">
            Join the
            <br />
            <span className="italic text-amber-400">Inner Circle.</span>
          </h2>
          <p className="text-white/40 text-base leading-relaxed max-w-sm">
            Create your free account and unlock exclusive drops, member discounts, and a seamless shopping experience.
          </p>
          <div className="flex flex-col gap-3 mt-4">
            {[
              "Free account, always",
              "Early access to limited drops",
              "Exclusive member-only coupons",
              "Order tracking & history",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2 text-white/50 text-sm">
                <span className="text-amber-400">✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex justify-center text-2xl font-black text-white font-serif">
            PR<span className="text-amber-400">.</span>
          </Link>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-black text-white font-serif">Create Account</h1>
            <p className="text-white/35 text-sm mt-1">
              Already have an account?{" "}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                Sign in →
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-white/40 text-xs font-bold uppercase tracking-widest block mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-amber-400/60 text-white placeholder-white/20 rounded-2xl px-5 py-3.5 text-sm outline-none transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-white/40 text-xs font-bold uppercase tracking-widest block mb-2">Email Address</label>
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
              <label className="text-white/40 text-xs font-bold uppercase tracking-widest block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-amber-400/60 text-white placeholder-white/20 rounded-2xl px-5 py-3.5 text-sm outline-none transition-colors pr-12"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 text-xs transition-colors">
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-white/10"}`} />
                    ))}
                  </div>
                  <p className="text-white/30 text-[10px]">Strength: <span className="text-white/60">{strengthLabel}</span></p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-white/40 text-xs font-bold uppercase tracking-widest block mb-2">Confirm Password</label>
              <input
                type={showPw ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                className={`w-full bg-white/[0.04] border focus:border-amber-400/60 text-white placeholder-white/20 rounded-2xl px-5 py-3.5 text-sm outline-none transition-colors ${
                  confirm && confirm !== password ? "border-rose-500/50" : "border-white/10"
                }`}
              />
              {confirm && confirm !== password && (
                <p className="text-rose-400 text-xs mt-1">Passwords don't match</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setAgreed((v) => !v)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  agreed ? "bg-amber-400 border-amber-400" : "border-white/20 group-hover:border-white/40"
                }`}
              >
                {agreed && <span className="text-black text-xs font-black">✓</span>}
              </div>
              <span className="text-white/35 text-xs leading-relaxed">
                I agree to PR's{" "}
                <a href="#" className="text-amber-400 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-amber-400 hover:underline">Privacy Policy</a>
              </span>
            </label>

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
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-black font-black text-sm py-4 rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating Account...
                </>
              ) : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-white/20 text-xs">
            Your data is stored locally and never shared.
          </p>
        </div>
      </div>
    </div>
  );
}