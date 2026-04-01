// src/pages/Produnct.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PRODUCTS, useCart, useWishlist, inr, pctOff } from "../store";

const StarRow = ({ n, size = "text-sm" }) => (
  <span className={`text-amber-400 ${size}`}>{"★".repeat(Math.round(n))}</span>
);

export default function Produnct() {
  const { id }               = useParams();
  const navigate             = useNavigate();
  const { addToCart }        = useCart();
  const { toggle, isWished } = useWishlist();

  const product = PRODUCTS.find((p) => p.id === id);

  const [imgIdx, setImgIdx]   = useState(0);
  const [size, setSize]       = useState(null);
  const [color, setColor]     = useState(null);
  const [qty, setQty]         = useState(1);
  const [added, setAdded]     = useState(false);
  const [sizeErr, setSizeErr] = useState(false);
  const [tab, setTab]         = useState("desc");

  useEffect(() => {
    setImgIdx(0); setSize(null); setColor(null); setQty(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center flex-col gap-4 pt-20">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap'); .font-serif{font-family:'Playfair Display',Georgia,serif!important}`}</style>
        <span className="text-6xl">🔍</span>
        <p className="text-white/40 text-sm">Product not found.</p>
        <Link to="/allproduct" className="bg-amber-400 text-black font-bold px-6 py-2.5 rounded-full text-sm hover:bg-amber-300 transition-colors">
          Browse All Products
        </Link>
      </div>
    );
  }

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!size) {
      setSizeErr(true);
      setTimeout(() => setSizeErr(false), 2000);
      return;
    }
    for (let i = 0; i < qty; i++) addToCart(product, size, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', Georgia, serif !important; }
      `}</style>

      <div className="max-w-7xl mx-auto px-5 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/25 mb-8 flex-wrap">
          <Link to="/" className="hover:text-white/60 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/allproduct" className="hover:text-white/60 transition-colors">All Products</Link>
          <span>/</span>
          <Link to={`/${product.category.toLowerCase()}`} className="hover:text-white/60 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-white/50">{product.name}</span>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

          {/* ── LEFT: IMAGE GALLERY ── */}
          <div className="space-y-3">
            {/* Main Image */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#111] border border-white/[0.06]">
              <img
                src={product.images[imgIdx]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* Wishlist */}
              <button
                onClick={() => toggle(product.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-lg hover:scale-110 transition-transform"
              >
                {isWished(product.id) ? "❤️" : "🤍"}
              </button>
              {/* Discount badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full">
                  −{pctOff(product.original, product.price)}% OFF
                </span>
              </div>
              {/* Prev/Next arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => (i === 0 ? product.images.length - 1 : i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors text-xl"
                  >‹</button>
                  <button
                    onClick={() => setImgIdx((i) => (i === product.images.length - 1 ? 0 : i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors text-xl"
                  >›</button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`relative flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    imgIdx === i
                      ? "border-amber-400"
                      : "border-white/10 opacity-50 hover:opacity-75"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: PRODUCT INFO ── */}
          <div className="space-y-6">

            {/* Title & Badge */}
            <div>
              <p className="text-white/30 text-[11px] tracking-[0.2em] uppercase font-bold">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-black text-white font-serif mt-1 leading-tight">
                {product.name}
              </h1>
              <span className={`inline-block mt-2 text-[10px] font-black px-3 py-1 rounded-full ${
                product.badge === "Best Seller" ? "bg-amber-400 text-black" :
                product.badge === "New"         ? "bg-emerald-400 text-black" :
                product.badge === "Trending"    ? "bg-sky-400 text-black" :
                "bg-rose-500 text-white"
              }`}>
                {product.badge}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRow n={product.rating} />
              <span className="text-white/45 text-sm">
                {product.rating} ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-amber-400 font-black text-4xl">{inr(product.price)}</span>
              <span className="text-white/30 line-through text-lg">{inr(product.original)}</span>
              <span className="text-emerald-400 text-sm font-bold">
                You save {inr(product.original - product.price)}
              </span>
            </div>

            {/* Low stock warning */}
            {product.stock <= 7 && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                <span className="text-rose-400">⚡</span>
                <p className="text-rose-400 text-sm font-semibold">
                  Only {product.stock} left in stock — order soon!
                </p>
              </div>
            )}

            {/* Color Picker */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-white/45 text-xs font-bold uppercase tracking-widest mb-3">
                  Color {color && <span className="text-white/25 normal-case font-normal ml-1">selected</span>}
                </p>
                <div className="flex gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        color === c
                          ? "border-amber-400 scale-110 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                          : "border-white/20 hover:border-white/50"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Picker */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  sizeErr ? "text-rose-400" : "text-white/45"
                }`}>
                  {sizeErr ? "⚠ Please select a size first" : "Select Size"}
                </p>
                <button className="text-amber-400 text-xs underline underline-offset-2 hover:text-amber-300 transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSize(s); setSizeErr(false); }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${
                      size === s
                        ? "bg-amber-400 border-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                        : "border-white/10 text-white/45 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-white/45 text-xs font-bold uppercase tracking-widest mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center text-white/50 hover:text-white text-2xl transition-colors"
                  >−</button>
                  <span className="w-8 text-center text-white font-black text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="w-11 h-11 flex items-center justify-center text-white/50 hover:text-white text-2xl transition-colors"
                  >+</button>
                </div>
                <span className="text-white/25 text-xs">{product.stock} in stock</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 ${
                  added
                    ? "bg-emerald-500 text-white scale-[0.98]"
                    : "bg-amber-400 hover:bg-amber-300 text-black hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] hover:scale-[1.02]"
                }`}
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
              <button
                onClick={() => toggle(product.id)}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-xl transition-all duration-200 ${
                  isWished(product.id)
                    ? "border-rose-500 bg-rose-500/10"
                    : "border-white/10 hover:border-rose-400/50 hover:bg-rose-500/5"
                }`}
              >
                {isWished(product.id) ? "❤️" : "🤍"}
              </button>
            </div>

            {/* View Cart shortcut */}
            {added && (
              <button
                onClick={() => navigate("/cart")}
                className="w-full border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-sm font-semibold py-3 rounded-2xl transition-all"
              >
                View Cart & Checkout →
              </button>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: "🚚", text: "Free Delivery" },
                { icon: "🔄", text: "7-Day Return" },
                { icon: "🔒", text: "Secure Pay" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl py-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-white/35 text-[10px] font-semibold text-center">{text}</span>
                </div>
              ))}
            </div>

            {/* Tabs: Description / Care / Reviews */}
            <div className="border-t border-white/[0.07] pt-6">
              <div className="flex gap-1 bg-white/[0.04] rounded-full p-1 mb-5">
                {[["desc","Description"],["care","Care"],["reviews","Reviews"]].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setTab(val)}
                    className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
                      tab === val
                        ? "bg-white/10 text-white"
                        : "text-white/30 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === "desc" && (
                <p className="text-white/50 text-sm leading-relaxed">{product.description}</p>
              )}

              {tab === "care" && (
                <ul className="space-y-2.5">
                  {[
                    "Machine wash cold, gentle cycle",
                    "Do not bleach",
                    "Tumble dry low",
                    "Iron on low heat if needed",
                    "Dry clean acceptable",
                  ].map((c) => (
                    <li key={c} className="flex items-center gap-2 text-white/45 text-sm">
                      <span className="text-amber-400 text-base">·</span>{c}
                    </li>
                  ))}
                </ul>
              )}

              {tab === "reviews" && (
                <div className="space-y-4">
                  {[
                    { name: "Rahul M.", stars: 5, text: "Absolutely love the quality. Fits perfectly and feels premium." },
                    { name: "Priya S.", stars: 5, text: "Looks even better in person. Got so many compliments!" },
                    { name: "Arjun K.", stars: 4, text: "Great product, fast delivery. Slightly large but still great." },
                  ].map(({ name, stars, text }) => (
                    <div key={name} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-black text-xs">
                          {name[0]}
                        </div>
                        <span className="text-white font-semibold text-sm">{name}</span>
                        <span className="text-emerald-400 text-[10px] ml-auto">✓ Verified</span>
                      </div>
                      <StarRow n={stars} size="text-xs" />
                      <p className="text-white/45 text-xs mt-1.5 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white font-serif">You May Also Like</h2>
              <Link to="/allproduct" className="text-white/30 hover:text-white text-sm underline underline-offset-2 transition-colors">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="group bg-[#111] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-amber-400/20 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-3.5">
                    <p className="text-white font-bold text-sm group-hover:text-amber-300 transition-colors leading-snug">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-amber-400 font-black text-sm">{inr(p.price)}</span>
                      <span className="text-white/25 line-through text-xs">{inr(p.original)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}