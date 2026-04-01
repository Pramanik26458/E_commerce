// src/pages/Women.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS, useCart, useWishlist, inr, pctOff } from "../store";

const WOMEN = PRODUCTS.filter(p=>p.category==="Women");

export default function Women() {
  const { addToCart }        = useCart();
  const { toggle, isWished } = useWishlist();
  const navigate             = useNavigate();
  const [sort, setSort]      = useState("newest");
  const [added, setAdded]    = useState({});

  const sorted = [...WOMEN].sort((a,b)=>sort==="price_asc"?a.price-b.price:sort==="price_desc"?b.price-a.price:sort==="rating"?b.rating-a.rating:0);
  const handleAdd = (e,p)=>{ e.stopPropagation(); addToCart(p,p.sizes?.[1]||null,null); setAdded(v=>({...v,[p.id]:true})); setTimeout(()=>setAdded(v=>({...v,[p.id]:false})),1600); };

  return (
    <div className="min-h-screen bg-[#080808] pt-20">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap'); .font-serif{font-family:'Playfair Display',Georgia,serif!important}`}</style>
      <div className="relative h-[48vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1600&q=80" alt="Women" className="w-full h-full object-cover object-top" style={{filter:"brightness(0.3) saturate(0.6)"}}/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent"/>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3">
          <p className="text-rose-300 text-[11px] tracking-[0.3em] uppercase font-bold">Collection</p>
          <h1 className="text-5xl md:text-6xl font-black text-white font-serif italic">Women's Edit</h1>
          <p className="text-white/35 text-base max-w-md">Effortlessly iconic. From statement dresses to everyday essentials.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-white/30 text-sm">{sorted.length} products</p>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="bg-[#111] border border-white/10 text-white/50 text-xs rounded-full px-4 py-2.5 outline-none cursor-pointer">
            <option value="newest">Newest</option><option value="price_asc">Price: Low→High</option><option value="price_desc">Price: High→Low</option><option value="rating">Top Rated</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {sorted.map(p=>(
            <div key={p.id} onClick={()=>navigate(`/product/${p.id}`)} className="group bg-[#111] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-rose-400/20 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.7)]">
              <div className="relative overflow-hidden aspect-[4/5]">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
                <span className="absolute top-3 left-3 bg-rose-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full">{p.badge}</span>
                <span className="absolute top-9 left-3 bg-black/65 text-white text-[9px] font-black px-2 py-0.5 rounded-full">−{pctOff(p.original,p.price)}%</span>
                <button onClick={(e)=>{e.stopPropagation();toggle(p.id);}} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/55 flex items-center justify-center text-sm hover:scale-110 transition-transform">{isWished(p.id)?"❤️":"🤍"}</button>
                {p.stock<=5&&<div className="absolute bottom-3 left-3 right-3 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg text-center">⚡ Only {p.stock} left!</div>}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-white font-bold text-sm group-hover:text-rose-300 transition-colors">{p.name}</h3>
                <div className="flex items-center gap-2"><span className="text-amber-400 font-black text-base">{inr(p.price)}</span><span className="text-white/25 line-through text-xs">{inr(p.original)}</span></div>
                <button onClick={(e)=>handleAdd(e,p)} className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${added[p.id]?"bg-emerald-500 text-white":"bg-white/90 text-black hover:bg-rose-400 hover:scale-[1.02]"}`}>{added[p.id]?"✓ Added!":"Add to Cart"}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}