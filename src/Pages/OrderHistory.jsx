import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useOrders } from "../AuthStore";
import { inr } from "../store";

const STATUS_COLORS = {
  Confirmed:        "bg-sky-400/15 text-sky-400 border-sky-400/25",
  Processing:       "bg-amber-400/15 text-amber-400 border-amber-400/25",
  Shipped:          "bg-purple-400/15 text-purple-400 border-purple-400/25",
  "Out for Delivery":"bg-orange-400/15 text-orange-400 border-orange-400/25",
  Delivered:        "bg-emerald-400/15 text-emerald-400 border-emerald-400/25",
  Cancelled:        "bg-rose-400/15 text-rose-400 border-rose-400/25",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function OrderCard({ order }) {
  const navigate         = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const doneSteps  = order.timeline.filter((t) => t.done).length;
  const totalSteps = order.timeline.length;
  const progress   = Math.round((doneSteps / totalSteps) * 100);

  return (
    <div className="bg-[#111] border border-white/[0.06] hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-white font-black text-base">{order.id}</span>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status] || STATUS_COLORS.Confirmed}`}>
              {order.status}
            </span>
          </div>
          <p className="text-white/30 text-xs">
            Placed on {formatDate(order.placedAt)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
          <p className="text-amber-400 font-black text-lg">{inr(order.total)}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="border border-white/10 hover:border-amber-400/30 text-white/45 hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
          >
            {expanded ? "Hide Details ↑" : "View Details ↓"}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white/25 text-[10px]">Delivery Progress</span>
          <span className="text-white/25 text-[10px]">ETA: {formatDate(order.deliveryEta)}</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-white/[0.06] p-5 space-y-6">

          {/* Timeline */}
          <div>
            <p className="text-white/35 text-[10px] uppercase tracking-widest font-bold mb-4">Order Timeline</p>
            <div className="flex flex-col gap-0">
              {order.timeline.map((step, i) => (
                <div key={step.label} className="flex gap-3">
                  {/* Icon + line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                      step.done
                        ? "bg-amber-400 border-amber-400 text-black"
                        : "bg-transparent border-white/15 text-white/15"
                    }`}>
                      {step.done ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white/15" />
                      )}
                    </div>
                    {i < order.timeline.length - 1 && (
                      <div className={`w-0.5 h-8 ${step.done ? "bg-amber-400/30" : "bg-white/[0.06]"}`} />
                    )}
                  </div>
                  {/* Label */}
                  <div className="pb-6 pt-1">
                    <p className={`text-sm font-semibold ${step.done ? "text-white" : "text-white/25"}`}>
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-white/25 text-[10px] mt-0.5">{formatDate(step.date)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-white/35 text-[10px] uppercase tracking-widest font-bold mb-3">Items Ordered</p>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="flex gap-3 bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 cursor-pointer hover:border-amber-400/20 transition-colors"
                >
                  <img
                    src={item.images?.[0] || item.img}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 py-1">
                    <p className="text-white font-semibold text-sm leading-snug">{item.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.selectedSize && (
                        <span className="text-white/30 text-[10px] bg-white/[0.04] px-2 py-0.5 rounded-full">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      <span className="text-white/30 text-[10px] bg-white/[0.04] px-2 py-0.5 rounded-full">
                        Qty: {item.qty}
                      </span>
                    </div>
                    <p className="text-amber-400 font-black text-sm mt-1.5">{inr(item.price * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 space-y-2">
            <p className="text-white/35 text-[10px] uppercase tracking-widest font-bold mb-3">Order Summary</p>
            <div className="flex justify-between text-sm">
              <span className="text-white/45">Subtotal</span>
              <span className="text-white">{inr(order.total + (order.discount || 0))}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/45">Discount {order.coupon && `(${order.coupon})`}</span>
                <span className="text-emerald-400">−{inr(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-white/45">Shipping</span>
              <span className={order.shipping === 0 ? "text-emerald-400" : "text-white"}>
                {order.shipping === 0 ? "FREE" : inr(order.shipping)}
              </span>
            </div>
            <div className="border-t border-white/[0.06] pt-2 flex justify-between">
              <span className="text-white font-bold">Total Paid</span>
              <span className="text-amber-400 font-black">{inr(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderHistory() {
  const navigate          = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { getMyOrders }   = useOrders();

  const orders = isLoggedIn ? getMyOrders(user.id) : [];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center flex-col gap-6 px-5 pt-20 text-center">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap'); .font-serif{font-family:'Playfair Display',Georgia,serif!important}`}</style>
        <span className="text-6xl">🔐</span>
        <div>
          <h2 className="text-3xl font-black text-white font-serif mb-2">Sign in to view orders</h2>
          <p className="text-white/35 text-sm">You need to be logged in to see your order history.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="bg-amber-400 hover:bg-amber-300 text-black font-black text-sm px-8 py-3.5 rounded-full transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="border border-white/15 hover:border-white/30 text-white/55 hover:text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] pt-24">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap'); .font-serif{font-family:'Playfair Display',Georgia,serif!important}`}</style>

      <div className="max-w-4xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-amber-400 text-[10px] tracking-[0.22em] uppercase font-bold mb-1">My Account</p>
            <h1 className="text-4xl font-black text-white font-serif">Order History</h1>
            <p className="text-white/30 text-sm mt-1">
              Hi <span className="text-white/60 font-semibold">{user.name}</span> · {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            to="/allproduct"
            className="bg-amber-400 hover:bg-amber-300 text-black font-black text-sm px-6 py-3 rounded-full transition-colors self-start"
          >
            Shop Now →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <span className="text-7xl">📦</span>
            <div>
              <h2 className="text-2xl font-black text-white font-serif mb-2">No orders yet</h2>
              <p className="text-white/35 text-sm">Start shopping and your orders will appear here.</p>
            </div>
            <Link
              to="/allproduct"
              className="bg-amber-400 hover:bg-amber-300 text-black font-black text-sm px-8 py-4 rounded-full transition-colors hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}