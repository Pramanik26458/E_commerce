
// ─────────────────────────────────────────────────────────────────────────────
// Admin authentication, countdown timer management, and coupon management
// All data stored in localStorage — no backend needed for project
//
// HOW IT WORKS:
//   - Admin credentials are hardcoded (can be changed below)
//   - Admin session is stored separately from user session
//   - Countdown timer uses a real Unix timestamp (Date.now()) so it persists
//     across page refreshes — it doesn't reset to a fixed number each time
//   - Coupons are stored in localStorage so admin can create/delete them,
//     and the cart page reads them from the same localStorage key
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

// ─── ADMIN CREDENTIALS ───────────────────────────────────────────────────────
// Change these to whatever you like. In a real app these would be in a backend.
const ADMIN_EMAIL    = "admin@pr.com";
const ADMIN_PASSWORD = "admin123";

// ─── LOCALSTORAGE KEYS ───────────────────────────────────────────────────────
const ADMIN_SESSION_KEY = "pr_admin_session";  // stores { email, loggedInAt }
const TIMER_KEY         = "pr_timer_end";      // stores Unix timestamp (ms) when offer ends
const COUPONS_KEY       = "pr_coupons";        // stores array of coupon objects

// ─── DEFAULT COUPONS (loaded once if localStorage is empty) ──────────────────
const DEFAULT_COUPONS = [
  { code: "PR10",    discount: 10, type: "percent", minOrder: 0,    active: true,  usageLimit: 100, usageCount: 0 },
  { code: "SAVE20",  discount: 20, type: "percent", minOrder: 500,  active: true,  usageLimit: 50,  usageCount: 0 },
  { code: "FIRST15", discount: 15, type: "percent", minOrder: 0,    active: true,  usageLimit: 200, usageCount: 0 },
  { code: "WELCOME", discount: 12, type: "percent", minOrder: 0,    active: true,  usageLimit: 500, usageCount: 0 },
  { code: "FLAT100", discount: 100, type: "flat",   minOrder: 1000, active: true,  usageLimit: 30,  usageCount: 0 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function loadAdminSession() {
  try { return JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || "null"); }
  catch { return null; }
}

function loadCoupons() {
  try {
    const stored = JSON.parse(localStorage.getItem(COUPONS_KEY));
    // If nothing stored yet, seed with defaults
    if (!stored) {
      localStorage.setItem(COUPONS_KEY, JSON.stringify(DEFAULT_COUPONS));
      return DEFAULT_COUPONS;
    }
    return stored;
  } catch {
    return DEFAULT_COUPONS;
  }
}

function saveCoupons(coupons) {
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
}

function loadTimerEnd() {
  // Returns the Unix timestamp (ms) when the offer ends, or null
  try {
    const v = localStorage.getItem(TIMER_KEY);
    return v ? Number(v) : null;
  } catch { return null; }
}

function saveTimerEnd(ts) {
  localStorage.setItem(TIMER_KEY, String(ts));
}

// ─── SHARED ADMIN STATE ───────────────────────────────────────────────────────
let _adminSession  = loadAdminSession();
let _adminListeners = [];

function notifyAdmin() {
  _adminListeners.forEach(fn => fn(_adminSession ? { ..._adminSession } : null));
}

// ─── useAdmin HOOK ────────────────────────────────────────────────────────────
// Use this in any component that needs to know if admin is logged in,
// or needs admin-only actions (login, logout).
//
// Usage:
//   const { admin, adminLogin, adminLogout, isAdmin } = useAdmin();

export function useAdmin() {
  const [admin, setAdmin] = useState(_adminSession);

  useEffect(() => {
    _adminListeners.push(setAdmin);
    return () => { _adminListeners = _adminListeners.filter(fn => fn !== setAdmin); };
  }, []);

  // Admin Login
  const adminLogin = useCallback(({ email, password }) => {
    if (
      email.toLowerCase().trim() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      const session = { email: ADMIN_EMAIL, loggedInAt: new Date().toISOString() };
      _adminSession = session;
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      notifyAdmin();
      return { success: true, message: "Welcome, Admin!" };
    }
    return { success: false, message: "Invalid admin credentials." };
  }, []);

  // Admin Logout
  const adminLogout = useCallback(() => {
    _adminSession = null;
    localStorage.removeItem(ADMIN_SESSION_KEY);
    notifyAdmin();
  }, []);

  return { admin, adminLogin, adminLogout, isAdmin: !!admin };
}

// ─── useCoupons HOOK ──────────────────────────────────────────────────────────
// For the ADMIN DASHBOARD — create, delete, toggle coupons.
// For CART PAGE validation — use the separate validateCoupon() export below.
//
// Coupon object shape:
//   { code, discount, type ("percent"|"flat"), minOrder, active, usageLimit, usageCount }
//
// Usage in admin dashboard:
//   const { coupons, createCoupon, deleteCoupon, toggleCoupon } = useCoupons();

let _coupons     = loadCoupons();
let _couponSubs  = [];
const _notifyC   = () => _couponSubs.forEach(fn => fn([..._coupons]));

export function useCoupons() {
  const [coupons, setCoupons] = useState(_coupons);

  useEffect(() => {
    _couponSubs.push(setCoupons);
    return () => { _couponSubs = _couponSubs.filter(fn => fn !== setCoupons); };
  }, []);

  // Create a new coupon
  const createCoupon = useCallback(({ code, discount, type, minOrder, usageLimit }) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return { success: false, message: "Coupon code cannot be empty." };
    if (_coupons.find(c => c.code === trimmed)) {
      return { success: false, message: `Code "${trimmed}" already exists.` };
    }
    if (discount <= 0) return { success: false, message: "Discount must be > 0." };
    if (type === "percent" && discount > 80) {
      return { success: false, message: "Percent discount cannot exceed 80%." };
    }

    const newCoupon = {
      code: trimmed,
      discount: Number(discount),
      type,            // "percent" or "flat"
      minOrder: Number(minOrder) || 0,
      active: true,
      usageLimit: Number(usageLimit) || 999,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    _coupons = [newCoupon, ..._coupons];
    saveCoupons(_coupons);
    _notifyC();
    return { success: true, message: `Coupon "${trimmed}" created!` };
  }, []);

  // Delete a coupon by code
  const deleteCoupon = useCallback((code) => {
    _coupons = _coupons.filter(c => c.code !== code);
    saveCoupons(_coupons);
    _notifyC();
  }, []);

  // Toggle active/inactive
  const toggleCoupon = useCallback((code) => {
    _coupons = _coupons.map(c => c.code === code ? { ...c, active: !c.active } : c);
    saveCoupons(_coupons);
    _notifyC();
  }, []);

  return { coupons, createCoupon, deleteCoupon, toggleCoupon };
}

// ─── validateCoupon() ─────────────────────────────────────────────────────────
// Used in Cart.jsx to validate a coupon code at checkout.
// Reads from localStorage directly so it always has fresh data.
//
// Returns:
//   { valid: true,  discount: 500, rate: 0.2, message: "20% off applied! 🎉" }
//   { valid: false, discount: 0,   message: "Invalid coupon code." }
//
// Usage in Cart.jsx:
//   import { validateCoupon } from "../adminStore";
//   const result = validateCoupon(couponCode, cartTotal);

export function validateCoupon(code, cartTotal) {
  const coupons = loadCoupons();
  const coupon  = coupons.find(c => c.code === code.trim().toUpperCase());

  // Not found
  if (!coupon) return { valid: false, discount: 0, message: "Invalid coupon code. Please check and try again." };

  // Inactive
  if (!coupon.active) return { valid: false, discount: 0, message: "This coupon has been deactivated." };

  // Usage limit exceeded
  if (coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, discount: 0, message: "This coupon has reached its usage limit." };
  }

  // Minimum order not met
  if (cartTotal < coupon.minOrder) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order of ₹${coupon.minOrder} required for this coupon.`,
    };
  }

  // Calculate discount
  let discountAmt;
  if (coupon.type === "percent") {
    discountAmt = Math.round(cartTotal * (coupon.discount / 100));
  } else {
    // flat discount — can't exceed cart total
    discountAmt = Math.min(coupon.discount, cartTotal);
  }

  const label = coupon.type === "percent"
    ? `${coupon.discount}% off applied! 🎉`
    : `₹${coupon.discount} flat discount applied! 🎉`;

  // Increment usage count in localStorage
  const updated = coupons.map(c =>
    c.code === coupon.code ? { ...c, usageCount: c.usageCount + 1 } : c
  );
  saveCoupons(updated);
  // Also sync the in-memory array so the admin dashboard updates
  _coupons = updated;
  _notifyC();

  return {
    valid: true,
    discount: discountAmt,
    rate: coupon.type === "percent" ? coupon.discount / 100 : null,
    type: coupon.type,
    rawDiscount: coupon.discount,
    message: label,
  };
}

// ─── useCountdownTimer HOOK ────────────────────────────────────────────────────
// This is the IMPROVED timer — it uses a real Unix timestamp stored in
// localStorage so the countdown survives page refreshes.
//
// How it works:
//   - Admin sets a "hours from now" duration in the Admin Dashboard
//   - We compute: endTimestamp = Date.now() + hours * 3600 * 1000
//   - We save that endTimestamp to localStorage
//   - On every render, we compute: remaining = endTimestamp - Date.now()
//   - This means if you close the tab for 10 minutes, the timer correctly
//     shows 10 fewer minutes when you come back — it doesn't reset!
//
// Usage in Home.jsx:
//   import { useCountdownTimer } from "../adminStore";
//   const { h, m, s, isExpired, endTimestamp } = useCountdownTimer();

let _timerSubs = [];
const _notifyTimer = () => _timerSubs.forEach(fn => fn(loadTimerEnd()));

export function useCountdownTimer() {
  const [endTs, setEndTs] = useState(loadTimerEnd);

  useEffect(() => {
    _timerSubs.push(setEndTs);
    return () => { _timerSubs = _timerSubs.filter(fn => fn !== setEndTs); };
  }, []);

  // Compute remaining seconds
  const [remaining, setRemaining] = useState(() => {
    if (!endTs) return 0;
    return Math.max(0, Math.floor((endTs - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!endTs) { setRemaining(0); return; }

    // Update every second
    const tick = () => {
      const r = Math.max(0, Math.floor((endTs - Date.now()) / 1000));
      setRemaining(r);
    };

    tick(); // immediate
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTs]);

  return {
    h: String(Math.floor(remaining / 3600)).padStart(2, "0"),
    m: String(Math.floor((remaining % 3600) / 60)).padStart(2, "0"),
    s: String(remaining % 60).padStart(2, "0"),
    isExpired: remaining === 0,
    endTimestamp: endTs,
    remaining,
  };
}

// setCountdownTimer() — called by Admin Dashboard to start a new timer
// duration: number of hours from now
export function setCountdownTimer(hours) {
  const end = Date.now() + hours * 3600 * 1000;
  saveTimerEnd(end);
  _notifyTimer();
  return end;
}

// clearCountdownTimer() — called by Admin Dashboard to reset the timer
export function clearCountdownTimer() {
  localStorage.removeItem(TIMER_KEY);
  _notifyTimer();
}