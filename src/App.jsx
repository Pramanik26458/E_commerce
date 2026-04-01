// src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// REPLACE your existing App.jsx with this
// ─────────────────────────────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar       from "./components/Navbar";
import Home         from "./pages/Home";
import AllProduct   from "./Pages/AllProduct";
import Men          from "./Pages/Men";
import Women        from "./Pages/Women";
import Produnct     from "./Pages/Produnct";
import About        from "./Pages/About";
import Cart         from "./Pages/Cart";
import Wishlist     from "./Pages/Wishlist";
import Login        from "./Pages/Login";
import Signup       from "./Pages/Signup";
import OrderHistory from "./Pages/OrderHistory";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/allproduct"  element={<AllProduct />} />
        <Route path="/men"         element={<Men />} />
        <Route path="/women"       element={<Women />} />
        <Route path="/product/:id" element={<Produnct />} />
        <Route path="/about"       element={<About />} />
        <Route path="/cart"        element={<Cart />} />
        <Route path="/wishlist"    element={<Wishlist />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/signup"      element={<Signup />} />
        <Route path="/orders"      element={<OrderHistory />} />
        <Route path="*" element={
          <div className="min-h-screen bg-[#080808] flex items-center justify-center flex-col gap-4">
            <span className="text-7xl font-black text-white">404</span>
            <p className="text-white/40 text-sm">Page not found.</p>
            <a href="/" className="bg-amber-400 text-black font-bold px-6 py-2.5 rounded-full text-sm hover:bg-amber-300 transition-colors">
              Go Home
            </a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}