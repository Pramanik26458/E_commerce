// src/pages/Wishlist.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PRODUCTS, useCart, useWishlist, inr, pctOff } from "../store";

export default function Wishlist() {
  const navigate             = useNavigate();
  const { addToCart }        = useCart();
  const { ids, toggle }      = useWishlist();
  const [added, setAdded]    = useState({});

  const wished = PRODUCTS.filter(p=>ids.includes(p.id));

  const handleAdd = (e,product)=>{ e.stopPropagation(); addToCart(product,product.sizes?.[2]||null,null); setAdded(v=>({...v,[product.id]:true})); setTimeout(()=>setAdded(v=>({...v,[product.id]:false})),1600); };

  return (
    <div className="min-h-screen bg-[#080808] pt-24">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap'); .font-serif{font-family:'Playfair Display',Georgia,serif!important}`}</style>
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="mb-8">
          <p className="text-amber-400 text-[11px] tracking-[0.2em] uppercase font-bold mb-1">Saved Items</p>
          <h1 className="text-4xl font-black text-white font-serif">My Wishlist</h1>
          <p className="text-white/25 text-sm mt-1">{wished.length} item{wished.length!==1?"s":""} saved</p>
        </div>
        {wished.length===0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <span className="text-7xl">🤍</span>
            <div><h2 className="text-2xl font-black text-white font-serif mb-2">Nothing saved yet</h2><p className="text-white/30 text-sm">Tap the ❤️ on any product to save it here.</p></div>
            <Link to="/allproduct" className="bg-amber-400 hover:bg-amber-300 text-black font-black text-sm px-8 py-4 rounded-full transition-colors">Explore Products →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {wished.map(p=>(
              <div key={p.id} onClick={()=>navigate(`/product/${p.id}`)} className="group bg-[#111] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-amber-400/20 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.7)]">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
                  <span className="absolute top-3 left-3 bg-black/65 text-white text-[9px] font-black px-2 py-0.5 rounded-full">−{pctOff(p.original,p.price)}%</span>
                  <button onClick={(e)=>{e.stopPropagation();toggle(p.id);}} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500/80 flex items-center justify-center text-sm hover:scale-110 transition-transform">❤️</button>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-white/20 text-[9px] tracking-widest uppercase">{p.category}</p>
                  <h3 className="text-white font-bold text-sm group-hover:text-amber-300 transition-colors">{p.name}</h3>
                  <div className="flex items-center gap-2"><span className="text-amber-400 font-black text-base">{inr(p.price)}</span><span className="text-white/20 line-through text-xs">{inr(p.original)}</span></div>
                  <button onClick={(e)=>handleAdd(e,p)} className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${added[p.id]?"bg-emerald-500 text-white":"bg-white/90 text-black hover:bg-amber-400 hover:scale-[1.02]"}`}>{added[p.id]?"✓ Added!":"Add to Cart"}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}