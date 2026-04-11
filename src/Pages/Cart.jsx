import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, inr } from "../store";
import { useAuth, useOrders } from "../AuthStore";
import { validateCoupon } from "../adminStore";

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQty, clearCart, cartCount, cartTotal, cartOriginal, cartSavings } = useCart();
  const [coupon, setCoupon]       = useState("");
  const [couponRes, setCouponRes] = useState(null);
  const [ordered, setOrdered]     = useState(false);

  const discount   = couponRes?.valid ? couponRes.discount : 0;
  const shipping   = cartTotal - discount >= 999 ? 0 : 99;
  const finalTotal = cartTotal - discount + shipping;

  const handleCoupon = () => setCouponRes(validateCoupon(coupon, cartTotal));
  const handleOrder  = () => { setOrdered(true); clearCart(); };

  if (ordered) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-5 pt-20">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap'); .font-serif{font-family:'Playfair Display',Georgia,serif!important}`}</style>
      <div className="text-center max-w-md space-y-6">
        <div className="text-7xl">🎉</div>
        <h1 className="text-4xl font-black text-white font-serif">Order Placed!</h1>
        <p className="text-white/40 text-sm leading-relaxed">Thank you for shopping with PR. Your order is confirmed and will be delivered in 2–4 business days.</p>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4">
          <p className="text-emerald-400 font-semibold text-sm">You saved {inr(cartSavings + discount)} on this order! 🏷️</p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={()=>navigate("/")} className="bg-amber-400 hover:bg-amber-300 text-black font-black text-sm px-8 py-4 rounded-full transition-colors">Back to Home</button>
          <button onClick={()=>navigate("/allproduct")} className="border border-white/10 hover:border-white/20 text-white/40 hover:text-white text-sm px-8 py-4 rounded-full transition-colors">Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] pt-24">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap'); .font-serif{font-family:'Playfair Display',Georgia,serif!important}`}</style>
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="mb-8">
          <p className="text-amber-400 text-[11px] tracking-[0.2em] uppercase font-bold mb-1">Your Bag</p>
          <h1 className="text-4xl font-black text-white font-serif">Shopping Cart</h1>
          <p className="text-white/25 text-sm mt-1">{cartCount} item{cartCount!==1?"s":""}</p>
        </div>

        {items.length===0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <span className="text-7xl">🛍️</span>
            <div><h2 className="text-2xl font-black text-white font-serif mb-2">Your cart is empty</h2><p className="text-white/30 text-sm">Looks like you haven't added anything yet.</p></div>
            <Link to="/allproduct" className="bg-amber-400 hover:bg-amber-300 text-black font-black text-sm px-8 py-4 rounded-full transition-colors">Start Shopping →</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item=>(
                <div key={item._key} className="flex gap-4 bg-[#111] border border-white/[0.06] rounded-2xl p-4 hover:border-white/10 transition-colors">
                  <img src={item.images?.[0]} alt={item.name} onClick={()=>navigate(`/product/${item.id}`)}
                    className="w-28 h-36 object-cover rounded-xl flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"/>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <p className="text-white font-bold text-base leading-snug cursor-pointer hover:text-amber-400 transition-colors" onClick={()=>navigate(`/product/${item.id}`)}>{item.name}</p>
                      <p className="text-white/20 text-xs mt-1">{item.category}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.selectedSize&&<span className="bg-white/[0.05] border border-white/[0.07] text-white/35 text-[10px] px-2 py-0.5 rounded-full">Size: {item.selectedSize}</span>}
                      </div>
                      <p className="text-amber-400 font-black text-base mt-2">{inr(item.price*item.qty)}</p>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center bg-white/[0.05] border border-white/[0.07] rounded-full">
                        <button onClick={()=>updateQty(item._key,item.qty-1)} className="w-9 h-9 flex items-center justify-center text-white/45 hover:text-white text-lg transition-colors">−</button>
                        <span className="w-7 text-center text-white font-bold text-sm">{item.qty}</span>
                        <button onClick={()=>updateQty(item._key,item.qty+1)} className="w-9 h-9 flex items-center justify-center text-white/45 hover:text-white text-lg transition-colors">+</button>
                      </div>
                      {item.qty>1&&<p className="text-white/20 text-xs">{inr(item.price)} each</p>}
                    </div>
                  </div>
                  <button onClick={()=>removeFromCart(item._key)} className="self-start text-white/15 hover:text-rose-400 transition-colors p-1 mt-1 text-lg">✕</button>
                </div>
              ))}
              <button onClick={clearCart} className="text-white/15 hover:text-rose-400 text-xs transition-colors underline underline-offset-2">Clear entire cart</button>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              {/* Coupon */}
              <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-5">
                <p className="text-white font-bold text-sm mb-3">🏷️ Have a coupon?</p>
                <div className="flex gap-2">
                  <input type="text" value={coupon} onChange={e=>{setCoupon(e.target.value.toUpperCase());setCouponRes(null);}} placeholder="Enter code"
                    className="flex-1 bg-white/[0.04] border border-white/10 focus:border-amber-400/50 text-white placeholder-white/20 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors uppercase tracking-widest"/>
                  <button onClick={handleCoupon} className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-4 rounded-xl transition-colors">Apply</button>
                </div>
                {couponRes&&<p className={`text-xs mt-2 font-semibold ${couponRes.valid?"text-emerald-400":"text-rose-400"}`}>{couponRes.valid?"✓":"✗"} {couponRes.message}</p>}
                <p className="text-white/15 text-[10px] mt-2">Try: PR10 · SAVE20 · FIRST15 · FLAT100</p>
              </div>

              {/* Order Summary */}
              <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-5 space-y-3">
                <h2 className="text-white font-black text-lg font-serif mb-4">Order Summary</h2>
                <div className="flex justify-between text-sm"><span className="text-white/45">Subtotal ({cartCount} items)</span><span className="text-white">{inr(cartTotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/45">You save</span><span className="text-emerald-400 font-semibold">−{inr(cartSavings)}</span></div>
                {couponRes?.valid&&<div className="flex justify-between text-sm"><span className="text-white/45">Coupon ({Math.round(couponRes.rate*100)}% off)</span><span className="text-emerald-400 font-semibold">−{inr(couponRes.discount)}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-white/45">Shipping</span><span className={shipping===0?"text-emerald-400 font-semibold":"text-white"}>{shipping===0?"FREE 🎉":inr(shipping)}</span></div>
                {shipping>0&&<p className="text-white/25 text-[10px] text-right">Add {inr(999-(cartTotal-discount))} more for free shipping</p>}
                <div className="border-t border-white/[0.07] pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-amber-400 font-black text-xl">{inr(finalTotal)}</span>
                </div>
                <button onClick={handleOrder} className="w-full bg-amber-400 hover:bg-amber-300 text-black font-black text-sm py-4 rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.35)] hover:scale-[1.02] mt-2">Place Order →</button>
                <Link to="/allproduct" className="block text-center text-white/25 hover:text-white text-xs transition-colors underline underline-offset-2">Continue Shopping</Link>
                <div className="flex items-center justify-center gap-4 pt-1">
                  {["🔒 Secure","📦 Fast Ship","🔄 Easy Return"].map(t=><span key={t} className="text-white/15 text-[10px]">{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}