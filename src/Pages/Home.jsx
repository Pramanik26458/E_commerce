// src/pages/Home.jsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PRODUCTS, useCart, useWishlist, inr, pctOff } from "../store";

const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');
    .font-serif { font-family: 'Playfair Display', Georgia, serif !important; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    .float { animation: float 4s ease-in-out infinite; }
  `}</style>
);

function useCountdown(init = 8 * 3600 + 47 * 60 + 23) {
  const [s, setS] = useState(init);
  useEffect(() => {
    const t = setInterval(() => setS((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  return {
    h: String(Math.floor(s / 3600)).padStart(2, "0"),
    m: String(Math.floor((s % 3600) / 60)).padStart(2, "0"),
    s: String(s % 60).padStart(2, "0"),
  };
}

const StarRow = ({ n = 5, size = "text-sm" }) => (
  <span className={`text-amber-400 ${size}`}>{"★".repeat(Math.round(n))}</span>
);

const BadgePill = ({ label }) => {
  const styles = {
    "Best Seller": "bg-amber-400 text-black",
    "New": "bg-emerald-400 text-black",
    "Trending": "bg-sky-400 text-black",
    "🔥 Hot": "bg-rose-500 text-white",
  };
  return (
    <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full tracking-widest uppercase ${styles[label] || "bg-white/20 text-white"}`}>
      {label}
    </span>
  );
};

function UrgencyStrip() {
  const { h, m, s } = useCountdown();
  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 text-black text-xs font-black tracking-wide">
        <span>🔥 FLASH SALE — Up to 60% OFF</span>
        <span className="opacity-40 hidden sm:inline">|</span>
        <span className="flex items-center gap-2">
          Ends in:
          <span className="bg-black text-amber-400 font-black px-3 py-0.5 rounded-lg tabular-nums text-sm tracking-widest">
            {h}:{m}:{s}
          </span>
        </span>
        <span className="opacity-40 hidden sm:inline">|</span>
        <span>🚀 Free shipping over ₹999</span>
      </div>
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#070707]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80"
          alt=""
          className="w-full h-full object-cover opacity-[0.18]"
          style={{ filter: "saturate(0.3) contrast(1.1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/85 to-[#070707]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/20" />
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse 55% 45% at 72% 50%, rgba(251,191,36,0.18) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center py-32">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 border border-amber-400/35 bg-amber-400/10 text-amber-400 text-[10px] font-bold px-4 py-2 rounded-full tracking-[0.18em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            New Drop · Autumn Summer 2026
          </div>

          <h1 className="text-[clamp(3.2rem,8vw,5.5rem)] font-black text-white leading-[0.95] tracking-tight font-serif">
            Dress Like
            <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              Nobody's
            </span>
            <br />
            Watching.
          </h1>

          <p className="text-white/45 text-lg leading-relaxed max-w-[420px]">
            Premium fashion for those who refuse to blend in. Limited drops, curated edits, zero compromises.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {["K","R","A","M","S"].map((l, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[#070707] bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-[11px] font-black text-black select-none">
                  {l}
                </div>
              ))}
            </div>
            <div>
              <StarRow n={5} />
              <p className="text-white/30 text-xs mt-0.5">
                Loved by <span className="text-white/60 font-semibold">10,000+</span> customers
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={() => navigate("/allproduct")}
              className="group flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-sm px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(251,191,36,0.45)] tracking-wide uppercase"
            >
              Shop the Drop
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
            <Link to="/allproduct" className="flex items-center border border-white/15 hover:border-white/40 text-white/55 hover:text-white text-sm font-semibold px-8 py-4 rounded-full transition-all duration-300">
              Browse All
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-end items-center">
          <div className="relative float">
            <div className="w-72 aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_60px_120px_rgba(0,0,0,0.9)]">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
                alt="featured"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase">Featured Drop</p>
                <p className="text-white font-black text-lg mt-0.5 font-serif">Autumn Edit '25</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-amber-400 font-black">From ₹1,999</span>
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full">−40%</span>
                </div>
              </div>
            </div>
            <div className="absolute -top-5 -right-5 bg-[#161616] border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
              <p className="text-white/35 text-[9px] uppercase tracking-[0.15em]">Stock</p>
              <p className="text-white font-black text-2xl leading-tight">5 <span className="text-sm font-normal text-white/25">left</span></p>
              <p className="text-amber-400 text-[10px] font-bold mt-0.5">⚡ Almost Gone</p>
            </div>
            <div className="absolute -bottom-4 -left-6 bg-[#161616] border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
              <StarRow n={5} size="text-base" />
              <p className="text-white font-black text-sm mt-1">4.9 / 5.0</p>
              <p className="text-white/25 text-[9px]">2,104 reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-25">
        <span className="text-white text-[9px] tracking-[0.25em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}

function TrustBar() {
  const stats = [
    { icon: "🚀", stat: "10K+",  label: "Happy Customers" },
    { icon: "⭐", stat: "4.9",   label: "Average Rating" },
    { icon: "📦", stat: "Free",  label: "Shipping ₹999+" },
    { icon: "🔄", stat: "7-Day", label: "Easy Returns" },
  ];
  return (
    <div className="bg-[#0f0f0f] border-y border-white/[0.06] py-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ icon, stat, label }) => (
          <div key={label} className="flex items-center gap-3 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
            <div>
              <p className="text-white font-black text-xl leading-none group-hover:text-amber-400 transition-colors">{stat}</p>
              <p className="text-white/30 text-xs font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryGrid() {
  const cats = [
    { label: "Men",         route: "/men",       tag: "Refined Essentials", img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",  accent: "#c0a060" },
    { label: "Women",       route: "/women",      tag: "Statement Pieces",   img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80", accent: "#d4847a" },
    { label: "Accessories", route: "/allproduct", tag: "Finish the Look",    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",  accent: "#a0c060" },
    { label: "Sale",        route: "/allproduct", tag: "Up to 60% Off 🔥",  img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80", accent: "#e05050" },
  ];
  return (
    <section className="py-20 px-6 bg-[#080808]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-amber-400 text-[10px] tracking-[0.22em] uppercase font-bold mb-2">Collections</p>
            <h2 className="text-3xl md:text-4xl font-black text-white font-serif">Shop by Category</h2>
          </div>
          <Link to="/allproduct" className="text-white/30 hover:text-white text-sm underline underline-offset-4 transition-colors hidden md:block">All Products →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cats.map(({ label, route, tag, img, accent }) => (
            <Link key={label} to={route} className="group relative overflow-hidden rounded-2xl aspect-[3/4] block">
              <img src={img} alt={label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ filter: "brightness(0.5) saturate(0.75)" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: `radial-gradient(ellipse at bottom, ${accent} 0%, transparent 70%)` }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white/45 text-[9px] tracking-[0.2em] uppercase mb-1">{tag}</p>
                <p className="text-white font-black text-xl font-serif">{label}</p>
                <div className="mt-2 h-0.5 w-0 group-hover:w-10 transition-all duration-500 rounded-full" style={{ backgroundColor: accent }} />
              </div>
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-white/12 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  const { addToCart }        = useCart();
  const { toggle, isWished } = useWishlist();
  const navigate             = useNavigate();
  const [added, setAdded]    = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, product.sizes?.[2] || null, null);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-[#111] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-amber-400/20 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.7)]"
    >
      <div className="relative overflow-hidden aspect-[4/5]">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <BadgePill label={product.badge} />
          <span className="bg-black/65 text-white text-[9px] font-black px-2 py-0.5 rounded-full self-start">−{pctOff(product.original, product.price)}%</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); toggle(product.id); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-sm hover:scale-110 transition-transform">
          {isWished(product.id) ? "❤️" : "🤍"}
        </button>
        {product.stock <= 5 && (
          <div className="absolute bottom-3 left-3 right-3 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg text-center">⚡ Only {product.stock} left — hurry!</div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <p className="text-white/25 text-[9px] tracking-widest uppercase">{product.category}</p>
        <h3 className="text-white font-bold text-sm leading-snug group-hover:text-amber-300 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-1.5">
          <StarRow n={product.rating} size="text-xs" />
          <span className="text-white/25 text-[10px]">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-black text-base">{inr(product.price)}</span>
          <span className="text-white/25 line-through text-xs">{inr(product.original)}</span>
        </div>
        <button
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all duration-300 ${added ? "bg-emerald-500 text-white" : "bg-white/90 text-black hover:bg-amber-400 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"}`}
        >
          {added ? "✓ Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

function TrendingSection() {
  const [tab, setTab] = useState("All");
  const tabs = ["All", "Men", "Women", "Best Seller", "New"];
  const visible = tab === "All"
    ? PRODUCTS
    : ["Men","Women"].includes(tab)
    ? PRODUCTS.filter((p) => p.category === tab)
    : PRODUCTS.filter((p) => p.badge === tab || (tab === "Best Seller" && p.badge === "🔥 Hot"));

  return (
    <section className="py-20 px-6 bg-[#090909]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <p className="text-amber-400 text-[10px] tracking-[0.22em] uppercase font-bold mb-2">Curated for You</p>
            <h2 className="text-3xl md:text-4xl font-black text-white font-serif">Trending Now</h2>
          </div>
          <div className="flex gap-1.5 bg-[#141414] p-1 rounded-full border border-white/[0.06] flex-wrap">
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${tab === t ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]" : "text-white/35 hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {(visible.length ? visible : PRODUCTS).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
          <Link to="/allproduct" className="inline-block border border-white/10 hover:border-amber-400/40 text-white/45 hover:text-white font-semibold text-sm px-10 py-4 rounded-full transition-all duration-300">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}

function GenderBanners() {
  return (
    <section className="py-20 px-6 bg-[#080808]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-5">
        <Link to="/men" className="group relative overflow-hidden rounded-3xl aspect-[16/9] md:aspect-[4/3] flex items-end">
          <img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=900&q=80" alt="Men" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: "brightness(0.4) saturate(0.65)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="relative z-10 p-8">
            <p className="text-amber-400 text-[10px] tracking-[0.22em] uppercase font-bold mb-1">Men's Collection</p>
            <h3 className="text-white font-black text-3xl font-serif leading-tight">Built for<br/>the Bold.</h3>
            <div className="mt-4 flex items-center gap-2 text-white/55 text-sm font-semibold group-hover:text-amber-400 transition-colors">
              Shop Men
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </div>
          </div>
        </Link>
        <Link to="/women" className="group relative overflow-hidden rounded-3xl aspect-[16/9] md:aspect-[4/3] flex items-end">
          <img src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=900&q=80" alt="Women" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: "brightness(0.4) saturate(0.65)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="relative z-10 p-8">
            <p className="text-rose-300 text-[10px] tracking-[0.22em] uppercase font-bold mb-1">Women's Collection</p>
            <h3 className="text-white font-black text-3xl font-serif leading-tight italic">Effortlessly<br/>Iconic.</h3>
            <div className="mt-4 flex items-center gap-2 text-white/55 text-sm font-semibold group-hover:text-rose-300 transition-colors">
              Shop Women
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

function FeatureStrip() {
  const features = [
    { icon: "🚚", title: "Free & Fast Delivery",  desc: "Free shipping above ₹999. Arrives in 2–4 days." },
    { icon: "🔄", title: "7-Day Easy Returns",     desc: "No questions asked. Full refund guaranteed." },
    { icon: "🔒", title: "100% Secure Payments",   desc: "UPI, Cards, Wallets — all 256-bit encrypted." },
    { icon: "🎁", title: "Premium Packaging",       desc: "Gift-ready unboxing experience, every order." },
  ];
  return (
    <div className="py-14 px-6 bg-[#0c0c0c] border-y border-white/[0.05]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center text-center gap-3 group">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
            <div>
              <p className="text-white font-bold text-sm">{title}</p>
              <p className="text-white/30 text-xs mt-1 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Testimonials() {
  const reviews = [
    { name: "Priya S.",  avatar: "P", city: "Mumbai",    stars: 5, text: "Absolutely obsessed with the quality. Looks even better in person. Will definitely be back!" },
    { name: "Rahul M.",  avatar: "R", city: "Delhi",     stars: 5, text: "Premium feel, fast delivery, and the packaging was gorgeous. This brand is the real deal." },
    { name: "Ananya K.", avatar: "A", city: "Bengaluru", stars: 5, text: "Got so many compliments. The fit is perfect and materials feel luxurious. Worth every rupee." },
  ];
  return (
    <section className="py-20 px-6 bg-[#080808]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber-400 text-[10px] tracking-[0.22em] uppercase font-bold mb-2">Real People, Real Love</p>
          <h2 className="text-3xl md:text-4xl font-black text-white font-serif">Customer Reviews</h2>
          <p className="text-white/30 text-sm mt-2">10,000+ verified purchases.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map(({ name, avatar, city, stars, text }) => (
            <div key={name} className="bg-[#111] border border-white/[0.06] hover:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col gap-4">
              <StarRow n={stars} />
              <p className="text-white/60 text-sm leading-relaxed flex-1">"{text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-black font-black text-sm flex-shrink-0">{avatar}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-white/25 text-[10px]">{city} · ✓ Verified</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone]   = useState(false);
  const submit = () => { if (email.includes("@")) setDone(true); };
  return (
    <section className="py-24 px-6 bg-[#0d0d0d] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(192,160,96,0.07) 0%, transparent 70%)" }} />
      <div className="max-w-xl mx-auto text-center relative z-10">
        <p className="text-amber-400 text-[10px] tracking-[0.22em] uppercase font-bold mb-3">Inner Circle</p>
        <h2 className="text-3xl md:text-4xl font-black text-white font-serif mb-3">Be First. Always.</h2>
        <p className="text-white/35 text-sm leading-relaxed mb-8">Early drops, exclusive discounts, and style dispatches. No spam — ever.</p>
        {done ? (
          <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl py-5 px-8 font-semibold text-sm">
            🎉 You're in! Welcome to PR's inner circle.
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="your@email.com"
              className="flex-1 bg-[#181818] border border-white/10 focus:border-amber-400/50 text-white placeholder-white/20 rounded-full px-6 py-3.5 text-sm outline-none transition-colors"
            />
            <button onClick={submit} className="bg-amber-400 hover:bg-amber-300 text-black font-black text-sm px-8 py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:scale-105 whitespace-nowrap">
              Join Now →
            </button>
          </div>
        )}
        <p className="text-white/15 text-xs mt-3">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: "Shop",    links: [["New Arrivals","/allproduct"],["Men","/men"],["Women","/women"],["Sale","/allproduct"]] },
    { title: "Help",    links: [["Size Guide","#"],["Returns","#"],["Track Order","#"],["Contact","#"]] },
    { title: "Company", links: [["About","/about"],["Careers","#"],["Press","#"],["Partners","#"]] },
  ];
  return (
    <footer className="bg-[#070707] border-t border-white/[0.05] pt-14 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <span className="text-2xl font-black tracking-tight text-white font-serif">PR<span className="text-amber-400">.</span></span>
            <p className="text-white/20 text-sm mt-3 leading-relaxed max-w-[200px]">Premium fashion for the bold. Limited drops. Unlimited style.</p>
            <div className="flex gap-2.5 mt-5">
              {["◎","✗","▶"].map((s, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full border border-white/10 hover:border-amber-400/40 flex items-center justify-center text-white/25 hover:text-amber-400 text-xs font-bold transition-all">{s}</a>
              ))}
            </div>
          </div>
          {cols.map(({ title, links }) => (
            <div key={title}>
              <p className="text-white font-bold text-sm mb-4">{title}</p>
              <ul className="space-y-2.5">
                {links.map(([label, href]) => (
                  <li key={label}><Link to={href} className="text-white/22 hover:text-white/65 text-sm transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.05] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/15 text-xs">© 2026 Pr. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy Policy","Terms of Service","Cookie Policy","By Basak"].map((l) => (
              <a key={l} href="#" className="text-white/15 hover:text-white/40 text-xs transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function StickyBubble() {
  const { cartCount } = useCart();
  const navigate      = useNavigate();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {cartCount > 0 && (
        <button onClick={() => navigate("/cart")} className="bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm px-5 py-3 rounded-full shadow-[0_10px_40px_rgba(52,211,153,0.35)] flex items-center gap-2 hover:scale-105 transition-all duration-300">
          🛒 Cart ({cartCount})
        </button>
      )}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-11 h-11 bg-[#1a1a1a] border border-white/10 hover:border-amber-400/30 rounded-full flex items-center justify-center text-white/45 hover:text-amber-400 shadow-xl hover:scale-110 transition-all duration-300">↑</button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-[#080808]">
      <FontStyle />
      <UrgencyStrip />
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <TrendingSection />
      <GenderBanners />
      <FeatureStrip />
      <Testimonials />
      <Newsletter />
      <Footer />
      <StickyBubble />
    </div>
  );
}