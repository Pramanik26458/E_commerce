// src/authStore.js
// ─────────────────────────────────────────────────────────────────────────────
// Paste at: src/authStore.js
// Handles: user signup, login, logout, order history — all via localStorage
// Import useAuth, useOrders from this file in any component
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

const USERS_KEY  = "pr_users";
const SESSION_KEY = "pr_session";
const ORDERS_KEY  = "pr_orders";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function loadOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); }
  catch { return []; }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// ─── SHARED LISTENERS ────────────────────────────────────────────────────────

let _authListeners = [];
let _currentUser   = loadSession();

function notifyAuth() {
  _authListeners.forEach((fn) => fn(_currentUser ? { ..._currentUser } : null));
}

// ─── useAuth HOOK ─────────────────────────────────────────────────────────────

export function useAuth() {
  const [user, setUser] = useState(_currentUser);

  useEffect(() => {
    _authListeners.push(setUser);
    return () => {
      _authListeners = _authListeners.filter((fn) => fn !== setUser);
    };
  }, []);

  // SIGN UP
  const signup = useCallback(({ name, email, password }) => {
    const users = loadUsers();

    // Check email already exists
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "An account with this email already exists." };
    }

    // Basic validation
    if (!name.trim() || name.trim().length < 2) {
      return { success: false, message: "Please enter your full name." };
    }
    if (!email.includes("@") || !email.includes(".")) {
      return { success: false, message: "Please enter a valid email address." };
    }
    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters." };
    }

    const newUser = {
      id:        `user_${Date.now()}`,
      name:      name.trim(),
      email:     email.toLowerCase().trim(),
      password,  // in real app: hash this!
      avatar:    name.trim()[0].toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after signup
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar };
    _currentUser = sessionUser;
    saveSession(sessionUser);
    notifyAuth();

    return { success: true, message: "Account created! Welcome to PR." };
  }, []);

  // LOG IN
  const login = useCallback(({ email, password }) => {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!found) {
      return { success: false, message: "Invalid email or password. Please try again." };
    }

    const sessionUser = { id: found.id, name: found.name, email: found.email, avatar: found.avatar };
    _currentUser = sessionUser;
    saveSession(sessionUser);
    notifyAuth();

    return { success: true, message: `Welcome back, ${found.name}!` };
  }, []);

  // LOG OUT
  const logout = useCallback(() => {
    _currentUser = null;
    localStorage.removeItem(SESSION_KEY);
    notifyAuth();
  }, []);

  // UPDATE PROFILE
  const updateProfile = useCallback(({ name }) => {
    if (!_currentUser) return { success: false, message: "Not logged in." };
    const users = loadUsers();
    const idx   = users.findIndex((u) => u.id === _currentUser.id);
    if (idx === -1) return { success: false, message: "User not found." };

    users[idx].name   = name.trim();
    users[idx].avatar = name.trim()[0].toUpperCase();
    saveUsers(users);

    const updated = { ..._currentUser, name: name.trim(), avatar: name.trim()[0].toUpperCase() };
    _currentUser  = updated;
    saveSession(updated);
    notifyAuth();

    return { success: true, message: "Profile updated!" };
  }, []);

  return { user, signup, login, logout, updateProfile, isLoggedIn: !!user };
}

// ─── useOrders HOOK ───────────────────────────────────────────────────────────

let _orderListeners = [];
let _orders = loadOrders();

function notifyOrders() {
  _orderListeners.forEach((fn) => fn([..._orders]));
}

export function useOrders() {
  const [orders, setOrders] = useState(_orders);

  useEffect(() => {
    _orderListeners.push(setOrders);
    return () => {
      _orderListeners = _orderListeners.filter((fn) => fn !== setOrders);
    };
  }, []);

  // Place a new order
  const placeOrder = useCallback(({ userId, items, total, discount, coupon, shipping }) => {
    const order = {
      id:          `ORD-${Date.now()}`,
      userId,
      items:       items.map((i) => ({ ...i })),
      total,
      discount,
      coupon:      coupon || null,
      shipping,
      status:      "Confirmed",
      placedAt:    new Date().toISOString(),
      deliveryEta: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // +4 days
      timeline: [
        { label: "Order Placed",    done: true,  date: new Date().toISOString() },
        { label: "Processing",      done: true,  date: new Date().toISOString() },
        { label: "Shipped",         done: false, date: null },
        { label: "Out for Delivery",done: false, date: null },
        { label: "Delivered",       done: false, date: null },
      ],
    };

    _orders = [order, ..._orders];
    saveOrders(_orders);
    notifyOrders();

    return order;
  }, []);

  // Get orders for a specific user
  const getMyOrders = useCallback((userId) => {
    return _orders.filter((o) => o.userId === userId);
  }, []);

  return { orders, placeOrder, getMyOrders };
}