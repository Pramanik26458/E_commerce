// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart, useWishlist, inr } from "../store";

const LINKS = [
  { label: "Home",     to: "/" },
  { label: "Shop All", to: "/allproduct" },
  { label: "Men",      to: "/men" },
  { label: "Women",    to: "/women" },
  { label: "About",    to: "/about" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { items, removeFromCart, updateQty, cartCount, cartTotal } = useCart();
  const { count: wishCount } = useWishlist();

  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [cartOpen,    setCartOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [query,       setQuery]       = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false); setCartOpen(false); setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80);
  }, [searchOpen]);

  // Lock body scroll when cart/mobile open
  useEffect(() => {
    document.body.style.overflow = cartOpen || mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/allproduct?q=${encodeURIComponent(query.trim())}`); setSearchOpen(false); setQuery(""); }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap'); .font-serif{font-family:'Playfair Display',Georgia,serif!important}`}</style>

      {/* ─── NAV BAR ─── */}
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-[#080808]/97 backdrop-blur-2xl border-b border-white/[0.07] py-3 shadow-[0_4px_30px_rgba(0,0,0,0.7)]" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="shrink-0 leading-none">
            <span className="text-[1.7rem] font-black tracking-tight text-white font-serif">
              PR<span className="text-amber-400">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {LINKS.map(({ label, to }) => (
              <Link key={label} to={to} className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                pathname === to ? "text-amber-400" : "text-white/50 hover:text-white"
              }`}>{label}</Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button onClick={() => setSearchOpen(v => !v)} className="p-1.5 text-white/45 hover:text-white transition-colors" aria-label="Search">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-1.5 text-white/45 hover:text-white transition-colors hidden sm:block" aria-label="Wishlist">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              {wishCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{wishCount}</span>}
            </Link>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative p-1.5 text-white/45 hover:text-white transition-colors" aria-label="Cart">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-1.5 text-white/50 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/></svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-white/[0.06] bg-[#0c0c0c] px-5 py-3">
            <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-2">
              <input ref={searchRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search products, categories..."
                className="flex-1 bg-white/[0.05] border border-white/10 focus:border-amber-400/50 text-white placeholder-white/20 rounded-full px-5 py-2.5 text-sm outline-none transition-colors"
              />
              <button type="submit" className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-5 py-2.5 rounded-full transition-colors">Search</button>
              <button type="button" onClick={() => setSearchOpen(false)} className="text-white/25 hover:text-white px-1 text-lg">✕</button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-72 bg-[#0d0d0d] border-r border-white/[0.07] z-40 pt-20 px-6 pb-8 flex flex-col md:hidden">
            <div className="space-y-1 flex-1">
              {LINKS.map(({ label, to }) => (
                <Link key={label} to={to} className={`block py-3 text-base font-semibold border-b border-white/[0.05] transition-colors ${
                  pathname === to ? "text-amber-400" : "text-white/55 hover:text-white"
                }`}>{label}</Link>
              ))}
              <Link to="/wishlist" className="flex items-center justify-between py-3 text-base font-semibold text-white/55 hover:text-white transition-colors border-b border-white/[0.05]">
                Wishlist
                {wishCount > 0 && <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{wishCount}</span>}
              </Link>
              <Link to="/cart" className="flex items-center justify-between py-3 text-base font-semibold text-white/55 hover:text-white transition-colors">
                Cart
                {cartCount > 0 && <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ─── CART DRAWER ─── */}
      {cartOpen && <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50" onClick={() => setCartOpen(false)} />}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#0d0d0d] border-l border-white/[0.07] z-50 flex flex-col transition-transform duration-300 ease-in-out ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
          <div>
            <h2 className="text-white font-black text-lg font-serif">Cart</h2>
            <p className="text-white/30 text-xs mt-0.5">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setCartOpen(false)} className="text-white/30 hover:text-white text-xl w-8 h-8 flex items-center justify-center transition-colors">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 pb-20">
              <span className="text-5xl">🛍️</span>
              <p className="text-white/35 text-sm">Your cart is empty</p>
              <button onClick={() => { setCartOpen(false); navigate("/allproduct"); }}
                className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm px-6 py-2.5 rounded-full transition-colors">
                Start Shopping
              </button>
            </div>
          ) : items.map(item => (
            <div key={item._key} className="flex gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3">
              <img src={item.images?.[0]} alt={item.name}
                className="w-20 h-24 object-cover rounded-xl flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => { navigate(`/product/${item.id}`); setCartOpen(false); }}
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <p className="text-white font-semibold text-sm leading-snug cursor-pointer hover:text-amber-400 transition-colors line-clamp-2"
                    onClick={() => { navigate(`/product/${item.id}`); setCartOpen(false); }}>
                    {item.name}
                  </p>
                  {item.selectedSize && <p className="text-white/25 text-[10px] mt-0.5">Size: {item.selectedSize}</p>}
                  <p className="text-amber-400 font-black text-sm mt-1">{inr(item.price)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-white/[0.05] rounded-full border border-white/[0.07]">
                    <button onClick={() => updateQty(item._key, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white text-base transition-colors">−</button>
                    <span className="w-6 text-center text-white text-xs font-bold">{item.qty}</span>
                    <button onClick={() => updateQty(item._key, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white text-base transition-colors">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item._key)} className="text-white/15 hover:text-rose-400 text-xs transition-colors">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/[0.07] px-5 py-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/45 text-sm">Subtotal</span>
              <span className="text-white font-black text-xl">{inr(cartTotal)}</span>
            </div>
            <p className="text-emerald-400 text-xs text-center">🎉 Free shipping on this order!</p>
            <button onClick={() => { setCartOpen(false); navigate("/cart"); }}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-black text-sm py-4 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:scale-[1.02]">
              View Cart & Checkout →
            </button>
            <button onClick={() => setCartOpen(false)} className="w-full border border-white/10 text-white/40 hover:text-white text-sm py-3 rounded-2xl transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}