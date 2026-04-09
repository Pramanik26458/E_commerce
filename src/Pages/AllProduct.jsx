import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PRODUCTS, useCart, useWishlist, inr, pctOff } from "../store";

const StarRow = ({ n }) => <span className="text-amber-400 text-xs">{"★".repeat(Math.round(n))}</span>;

function ProductCard({ product }) {
  const { addToCart }        = useCart();
  const { toggle, isWished } = useWishlist();
  const navigate             = useNavigate();
  const [added, setAdded]    = useState(false);
  const handleAdd = (e) => { e.stopPropagation(); addToCart(product, product.sizes?.[2]||null, null); setAdded(true); setTimeout(()=>setAdded(false),1600); };
  const bs = { "Best Seller":"bg-amber-400 text-black","New":"bg-emerald-400 text-black","Trending":"bg-sky-400 text-black","🔥 Hot":"bg-rose-500 text-white" }[product.badge]||"bg-white/20 text-white";
  return (
    <div onClick={()=>navigate(`/product/${product.id}`)} className="group bg-[#111] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-amber-400/20 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.7)]">
      <div className="relative overflow-hidden aspect-[4/5]">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase ${bs}`}>{product.badge}</span>
          <span className="bg-black/65 text-white text-[9px] font-black px-2 py-0.5 rounded-full self-start">−{pctOff(product.original,product.price)}%</span>
        </div>
        <button onClick={(e)=>{e.stopPropagation();toggle(product.id);}} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/55 flex items-center justify-center text-sm hover:scale-110 transition-transform">
          {isWished(product.id)?"❤️":"🤍"}
        </button>
        {product.stock<=5&&<div className="absolute bottom-3 left-3 right-3 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg text-center">⚡ Only {product.stock} left!</div>}
      </div>
      <div className="p-4 space-y-2">
        <p className="text-white/25 text-[9px] tracking-widest uppercase">{product.category}</p>
        <h3 className="text-white font-bold text-sm leading-snug group-hover:text-amber-300 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-1.5"><StarRow n={product.rating}/><span className="text-white/25 text-[10px]">({product.reviews.toLocaleString()})</span></div>
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-black text-base">{inr(product.price)}</span>
          <span className="text-white/25 line-through text-xs">{inr(product.original)}</span>
        </div>
        <button onClick={handleAdd} className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-300 ${added?"bg-emerald-500 text-white":"bg-white/90 text-black hover:bg-amber-400 hover:scale-[1.02]"}`}>
          {added?"✓ Added!":"Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default function AllProduct() {
  const [sp] = useSearchParams();
  const urlQ = sp.get("q")||"";
  const [search, setSearch]     = useState(urlQ);
  const [cat, setCat]           = useState("All");
  const [badge, setBadge]       = useState("All");
  const [sort, setSort]         = useState("newest");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [drawer, setDrawer]     = useState(false);

  useEffect(()=>setSearch(urlQ),[urlQ]);

  const filtered = useMemo(()=>{
    let list=[...PRODUCTS];
    if(search) list=list.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.category.toLowerCase().includes(search.toLowerCase()));
    if(cat!=="All") list=list.filter(p=>p.category===cat);
    if(badge!=="All") list=list.filter(p=>p.badge===badge);
    list=list.filter(p=>p.price<=maxPrice);
    if(sort==="price_asc") list.sort((a,b)=>a.price-b.price);
    else if(sort==="price_desc") list.sort((a,b)=>b.price-a.price);
    else if(sort==="rating") list.sort((a,b)=>b.rating-a.rating);
    return list;
  },[search,cat,badge,sort,maxPrice]);

  const Filters = ()=>(
    <div className="space-y-7">
      <div>
        <p className="text-white/35 text-[10px] tracking-widest uppercase font-bold mb-2.5">Search</p>
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
          className="w-full bg-white/[0.04] border border-white/10 focus:border-amber-400/50 text-white placeholder-white/20 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"/>
      </div>
      <div>
        <p className="text-white/35 text-[10px] tracking-widest uppercase font-bold mb-2.5">Category</p>
        {["All","Men","Women"].map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors mb-1 ${cat===c?"bg-amber-400/12 text-amber-400 font-bold":"text-white/40 hover:text-white hover:bg-white/[0.04]"}`}>{c}</button>
        ))}
      </div>
      <div>
        <p className="text-white/35 text-[10px] tracking-widest uppercase font-bold mb-2.5">Collection</p>
        {["All","Best Seller","Trending","New","🔥 Hot"].map(b=>(
          <button key={b} onClick={()=>setBadge(b)} className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors mb-1 ${badge===b?"bg-amber-400/12 text-amber-400 font-bold":"text-white/40 hover:text-white hover:bg-white/[0.04]"}`}>{b}</button>
        ))}
      </div>
      <div>
        <div className="flex justify-between mb-2.5">
          <p className="text-white/35 text-[10px] tracking-widest uppercase font-bold">Max Price</p>
          <span className="text-amber-400 text-xs font-bold">{inr(maxPrice)}</span>
        </div>
        <input type="range" min={1000} max={10000} step={500} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} className="w-full accent-amber-400"/>
        <div className="flex justify-between text-white/20 text-[10px] mt-1"><span>₹1,000</span><span>₹10,000</span></div>
      </div>
      <button onClick={()=>{setCat("All");setBadge("All");setSort("newest");setMaxPrice(10000);setSearch("");}}
        className="w-full border border-white/10 hover:border-rose-400/40 text-white/25 hover:text-rose-400 text-xs py-2.5 rounded-xl transition-colors">Reset Filters</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] pt-24">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap'); .font-serif{font-family:'Playfair Display',Georgia,serif!important}`}</style>
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="mb-8">
          <p className="text-amber-400 text-[11px] tracking-[0.2em] uppercase font-bold mb-1">Our Collection</p>
          <h1 className="text-4xl font-black text-white font-serif">All Products</h1>
          {search&&<p className="text-white/35 text-sm mt-2">Results for "<span className="text-white/60">{search}</span>"</p>}
        </div>
        <div className="flex gap-8">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-28 bg-[#0f0f0f] border border-white/[0.06] rounded-2xl p-5"><Filters/></div>
          </aside>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <button onClick={()=>setDrawer(true)} className="lg:hidden flex items-center gap-2 bg-white/[0.04] border border-white/10 text-white/50 text-xs font-semibold px-4 py-2.5 rounded-full hover:border-amber-400/30 hover:text-white transition-colors">
                  ⚙ Filters
                </button>
                <span className="text-white/20 text-xs">{filtered.length} products</span>
              </div>
              <select value={sort} onChange={e=>setSort(e.target.value)} className="bg-[#111] border border-white/10 text-white/50 text-xs rounded-full px-4 py-2.5 outline-none cursor-pointer">
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low→High</option>
                <option value="price_desc">Price: High→Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            {filtered.length===0 ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
                <span className="text-5xl">🔍</span>
                <p className="text-white/35 text-sm">No products match your filters.</p>
                <button onClick={()=>{setCat("All");setBadge("All");setMaxPrice(10000);setSearch("");}} className="bg-amber-400 text-black font-bold text-sm px-6 py-2.5 rounded-full hover:bg-amber-300 transition-colors">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">{filtered.map(p=><ProductCard key={p.id} product={p}/>)}</div>
            )}
          </div>
        </div>
      </div>
      {drawer&&(
        <>
          <div className="fixed inset-0 bg-black/70 z-50 lg:hidden" onClick={()=>setDrawer(false)}/>
          <div className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[#0e0e0e] border-t border-white/[0.07] z-50 rounded-t-3xl overflow-y-auto p-6 lg:hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg font-serif">Filters</h3>
              <button onClick={()=>setDrawer(false)} className="text-white/30 hover:text-white">✕</button>
            </div>
            <Filters/>
            <button onClick={()=>setDrawer(false)} className="w-full mt-6 bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm py-3.5 rounded-full transition-colors">Show {filtered.length} Results</button>
          </div>
        </>
      )}
    </div>
  );
}