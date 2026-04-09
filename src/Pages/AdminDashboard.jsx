import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAdmin,
  useCoupons,
  useCountdownTimer,
  setCountdownTimer,
  clearCountdownTimer
} from "../adminStore";

// ─── STATS ─────────────────────────────────
function loadStats() {
  try {
    const users = JSON.parse(localStorage.getItem("pr_users") || "[]");
    const orders = JSON.parse(localStorage.getItem("pr_orders") || "[]");
    return { users: users.length, orders: orders.length };
  } catch {
    return { users: 0, orders: 0 };
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { isAdmin, adminLogout } = useAdmin();
  const { coupons, createCoupon, deleteCoupon } = useCoupons();
  const { h, m, s, isExpired, endTimestamp } = useCountdownTimer();

  const [stats, setStats] = useState({ users: 0, orders: 0 });
  const [hours, setHours] = useState("8");
  const [minutes, setMinutes] = useState("0");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");

  useEffect(() => {
    if (!isAdmin) navigate("/admin/login");
  }, [isAdmin]);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const handleSet = () => {
    const total = Number(hours) + Number(minutes) / 60;
    if (total <= 0) return alert("Enter valid time");
    setCountdownTimer(total);
  };

  const handleCreate = () => {
    const res = createCoupon({
      code,
      discount: Number(discount),
      type: "percent"
    });

    if (res.success) {
      setCode("");
      setDiscount("");
      alert("Coupon Created 🎉");
    } else {
      alert(res.message);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080808] via-black to-[#0a0a0a] text-white">

      {/* 🔥 TOP BAR */}
      <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black tracking-wide">PR Admin</h1>
          <p className="text-white/30 text-xs">Control your store like a pro</p>
        </div>

        <button
          onClick={() => {
            adminLogout();
            navigate("./allproduct");
          }}
          className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl text-sm font-bold transition shadow-lg"
        >
          Logout
        </button>
      </div>

      <div className="p-6 space-y-6">

        {/* 📊 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: "Users", value: stats.users },
            { label: "Orders", value: stats.orders },
            { label: "Coupons", value: coupons.length }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-2xl p-5 hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-amber-400/10"
            >
              <p className="text-white/30 text-xs">{item.label}</p>
              <h2 className="text-3xl font-black mt-1">{item.value}</h2>
            </div>
          ))}
        </div>

        {/* ⏱️ TIMER */}
        <div className="bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-2xl p-6 space-y-5 shadow-lg">

          <h2 className="text-lg font-bold">Flash Sale Timer</h2>

          <div className="text-center text-4xl font-black text-amber-400 tracking-widest animate-pulse drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
            {endTimestamp && !isExpired ? `${h}:${m}:${s}` : "No Active Timer"}
          </div>

          <div className="flex gap-3">
            <input
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Hours"
              className="flex-1 bg-black/80 border border-white/10 px-3 py-2 rounded-xl focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 outline-none"
            />
            <input
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="Minutes"
              className="flex-1 bg-black/80 border border-white/10 px-3 py-2 rounded-xl focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSet}
              className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold py-2 rounded-xl transition shadow-lg shadow-amber-400/20 active:scale-95"
            >
              Start Timer
            </button>

            <button
              onClick={clearCountdownTimer}
              className="flex-1 border border-white/20 hover:bg-white/10 py-2 rounded-xl transition active:scale-95"
            >
              Clear
            </button>
          </div>
        </div>

        {/* 🎟️ COUPONS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Create */}
          <div className="bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
            <h3 className="font-bold">Create Coupon</h3>

            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Coupon Code"
              className="w-full bg-black/80 border border-white/10 px-3 py-2 rounded-xl focus:border-amber-400/50 outline-none"
            />

            <input
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Discount %"
              className="w-full bg-black/80 border border-white/10 px-3 py-2 rounded-xl focus:border-amber-400/50 outline-none"
            />

            <button
              onClick={handleCreate}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold py-2 rounded-xl transition shadow-lg shadow-amber-400/20 active:scale-95"
            >
              Create Coupon
            </button>
          </div>

          {/* List */}
          <div className="bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-2xl p-6 space-y-3 shadow-lg">
            <h3 className="font-bold">Active Coupons</h3>

            {coupons.length === 0 ? (
              <p className="text-white/30 text-sm">No coupons yet</p>
            ) : (
              coupons.map((c) => (
                <div
                  key={c.code}
                  className="flex justify-between items-center bg-black/60 border border-white/10 px-3 py-2 rounded-xl hover:scale-[1.02] transition"
                >
                  <span className="text-amber-400 font-bold">{c.code}</span>

                  <button
                    onClick={() => deleteCoupon(c.code)}
                    className="text-red-400 text-xs hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}