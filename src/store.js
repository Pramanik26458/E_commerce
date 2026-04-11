
// Global state: PRODUCTS catalogue, useCart hook, useWishlist hook, coupons
// All state persisted via localStorage and synced across tabs

import { useState, useEffect, useCallback } from "react";

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export const PRODUCTS = [
  {
    id: "p1",
    name: "Arc Oversized Tee",
    category: "Men",
    price: 2499,
    original: 3499,
    rating: 4.8,
    reviews: 1240,
    badge: "Trending",
    stock: 7,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["#1a1a1a", "#f5f0e8", "#4a6741"],
    description:
      "Our signature oversized tee in premium 240gsm cotton blend. Dropped shoulders, boxy silhouette — a finish that only gets better with every wash.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
    ],
  },
  {
    id: "p2",
    name: "Velvet Drape Dress",
    category: "Women",
    price: 4199,
    original: 5999,
    rating: 4.9,
    reviews: 843,
    badge: "Best Seller",
    stock: 3,
    sizes: ["XS", "S", "M", "L"],
    colors: ["#2d1b4e", "#8b0000", "#1a1a1a"],
    description:
      "Floor-grazing velvet dress with fluid drape and adjustable tie waist. The dress that makes every entrance count.",
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    ],
  },
  {
    id: "p3",
    name: "Street Cargo Pants",
    category: "Men",
    price: 3299,
    original: 4299,
    rating: 4.7,
    reviews: 672,
    badge: "New",
    stock: 14,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["#3d3d2d", "#1a1a1a", "#4a3728"],
    description:
      "Six-pocket cargo pants in washed twill. Relaxed through the thigh, tapered leg. Built for streets, ready for everything.",
    images: [
      "https://imgs.search.brave.com/4OPBbyiezQoMXd0t78g2pqnVpd5N-C21oKE8rIueK60/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFmd3pkRFdoLUwu/anBn",
      "https://imgs.search.brave.com/TlU_rB70Bo5m4bZaoxG68mRGM68M7AunsD5wVa4CSBo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzEySWttSWZMcEwu/anBn",
      "https://imgs.search.brave.com/bGiuGGShl80k1-Du9rZb_gVI9vdLtnWeM-3UNbU0JHU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjF0ZFRKSWFFT0wu/anBn",
    ],
  },
  {
    id: "p4",
    name: "Linen Co-ord Set",
    category: "Women",
    price: 5499,
    original: 7200,
    rating: 4.9,
    reviews: 2105,
    badge: "🔥 Hot",
    stock: 5,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#e8dcc8", "#c4b49a", "#8a7a6a"],
    description:
      "Matching linen blazer and wide-leg trouser. Breathable, elevated, endlessly versatile — dressed up or down.",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
    ],
  },
  {
    id: "p5",
    name: "Classic Bomber Jacket",
    category: "Men",
    price: 6999,
    original: 9500,
    rating: 4.8,
    reviews: 534,
    badge: "Best Seller",
    stock: 9,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#1a1a1a", "#2d3a2d", "#3a2820"],
    description:
      "Heavyweight satin bomber with ribbed cuffs, collar, and hem. The essential outerwear piece that anchors any look.",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
    ],
  },
  {
    id: "p6",
    name: "Satin Wrap Skirt",
    category: "Women",
    price: 2899,
    original: 3800,
    rating: 4.6,
    reviews: 387,
    badge: "New",
    stock: 11,
    sizes: ["XS", "S", "M", "L"],
    colors: ["#c4a882", "#8b0000", "#1a1a1a"],
    description:
      "Bias-cut satin wrap skirt, fluid midi length, adjustable tie waist. Dress it up, dress it down.",
    images: [
      "https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
    ],
  },
  {
    id: "p7",
    name: "Slim Chino Trousers",
    category: "Men",
    price: 2199,
    original: 3200,
    rating: 4.5,
    reviews: 910,
    badge: "Trending",
    stock: 20,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["#c4b49a", "#1a1a1a", "#2d3a2d"],
    description:
      "Italian-finish cotton chinos, slim straight leg. Wrinkle-resistant and machine washable.",
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b5f13?w=800&q=80",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
    ],
  },
  {
    id: "p8",
    name: "Floral Midi Dress",
    category: "Women",
    price: 3799,
    original: 5100,
    rating: 4.9,
    reviews: 1560,
    badge: "🔥 Hot",
    stock: 4,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#f5e6d3", "#e8c4a0", "#d4a878"],
    description:
      "Hand-printed floral midi in lightweight crepe. Adjustable straps, smocked back, sweeping silhouette.",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    ],
  },
  {
    id: "p9",
    name: "Utility Overshirt",
    category: "Men",
    price: 3999,
    original: 5200,
    rating: 4.7,
    reviews: 445,
    badge: "New",
    stock: 8,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#4a5240", "#3a2820", "#1a1a1a"],
    description:
      "Four-pocket overshirt in brushed cotton twill. Light jacket or shirt layer — a wardrobe workhorse.",
    images: [
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
    ],
  },
  {
    id: "p10",
    name: "Knit Bodycon Dress",
    category: "Women",
    price: 3299,
    original: 4500,
    rating: 4.8,
    reviews: 729,
    badge: "Trending",
    stock: 6,
    sizes: ["XS", "S", "M", "L"],
    colors: ["#1a1a1a", "#8b0000", "#2d1b4e"],
    description:
      "Ribbed knit bodycon in stretch viscose blend. Scoop neck, long sleeves, figure-skimming fit.",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
    ],
  },
  {
    id: "p11",
    name: "Wide Leg Jeans",
    category: "Men",
    price: 4299,
    original: 5800,
    rating: 4.6,
    reviews: 312,
    badge: "Best Seller",
    stock: 15,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["#3a4a5c", "#1a1a1a", "#5a4a3c"],
    description:
      "90s-inspired wide leg in heavyweight 12oz denim. High rise, clean finish, a leg opening that makes a statement.",
    images: [
      "https://levi.in/cdn/shop/files/006N50000_01_Elevated.jpg?v=1758538045",
      "https://levi.in/cdn/shop/files/006N50000_04_Front.jpg?v=1758538045",
      "https://levi.in/cdn/shop/files/006N50000_05_Back.jpg?v=1758538045",
      "https://levi.in/cdn/shop/files/006N50000_06_Detail.jpg?v=1758538045",
      "https://levi.in/cdn/shop/files/006N50000_07_Side.jpg?v=1758538045",
      "https://levi.in/cdn/shop/files/006N50000_03_Front.jpg?v=1758522820"

    ],
  },
  {
    id: "p12",
    name: "Ruffle Georgette Blouse",
    category: "Women",
    price: 1999,
    original: 2800,
    rating: 4.5,
    reviews: 203,
    badge: "New",
    stock: 18,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#f5f0e8", "#e8c4a0", "#1a1a1a"],
    description:
      "Tiered ruffle blouse in semi-sheer georgette. Relaxed fit, billowing sleeves, self-tie neck.",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    ],
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const pctOff = (orig, price) =>
  Math.round(((orig - price) / orig) * 100);

// ─── CART ────────────────────────────────────────────────────────────────────

const CART_KEY = "pr_cart_v2";
const load = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

let _cartItems = load(CART_KEY);
let _cartSubs = [];
const _notifyCart = () => _cartSubs.forEach((fn) => fn([..._cartItems]));

export function useCart() {
  const [items, setItems] = useState(_cartItems);

  useEffect(() => {
    _cartSubs.push(setItems);
    const sync = (e) => {
      if (e.key === CART_KEY) {
        _cartItems = load(CART_KEY);
        _notifyCart();
      }
    };
    window.addEventListener("storage", sync);
    return () => {
      _cartSubs = _cartSubs.filter((f) => f !== setItems);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addToCart = useCallback((product, size = null, color = null) => {
    const key = `${product.id}_${size}_${color}`;
    _cartItems = _cartItems.find((i) => i._key === key)
      ? _cartItems.map((i) => (i._key === key ? { ...i, qty: i.qty + 1 } : i))
      : [
          ..._cartItems,
          {
            ...product,
            qty: 1,
            selectedSize: size,
            selectedColor: color,
            _key: key,
          },
        ];
    save(CART_KEY, _cartItems);
    _notifyCart();
  }, []);

  const removeFromCart = useCallback((key) => {
    _cartItems = _cartItems.filter((i) => i._key !== key);
    save(CART_KEY, _cartItems);
    _notifyCart();
  }, []);

  const updateQty = useCallback((key, qty) => {
    _cartItems =
      qty < 1
        ? _cartItems.filter((i) => i._key !== key)
        : _cartItems.map((i) => (i._key === key ? { ...i, qty } : i));
    save(CART_KEY, _cartItems);
    _notifyCart();
  }, []);

  const clearCart = useCallback(() => {
    _cartItems = [];
    save(CART_KEY, []);
    _notifyCart();
  }, []);

  const cartCount = items.reduce((s, i) => s + i.qty, 0);
  const cartTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const cartOriginal = items.reduce((s, i) => s + i.original * i.qty, 0);
  const cartSavings = cartOriginal - cartTotal;

  return {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartCount,
    cartTotal,
    cartOriginal,
    cartSavings,
  };
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────

const WISH_KEY = "pr_wish_v2";
let _wishIds = load(WISH_KEY);
let _wishSubs = [];
const _notifyW = () => _wishSubs.forEach((fn) => fn([..._wishIds]));

export function useWishlist() {
  const [ids, setIds] = useState(_wishIds);

  useEffect(() => {
    _wishSubs.push(setIds);
    const sync = (e) => {
      if (e.key === WISH_KEY) {
        _wishIds = load(WISH_KEY);
        _notifyW();
      }
    };
    window.addEventListener("storage", sync);
    return () => {
      _wishSubs = _wishSubs.filter((f) => f !== setIds);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id) => {
    _wishIds = _wishIds.includes(id)
      ? _wishIds.filter((i) => i !== id)
      : [..._wishIds, id];
    save(WISH_KEY, _wishIds);
    _notifyW();
  }, []);

  const isWished = useCallback((id) => ids.includes(id), [ids]);
  return { ids, toggle, isWished, count: ids.length };
}

// ─── COUPONS ─────────────────────────────────────────────────────────────────

// const COUPONS = { PR10: 0.1, SAVE20: 0.2, FIRST15: 0.15, WELCOME: 0.12 };

// export function applyCoupon(code, total) {
//   const rate = COUPONS[code.trim().toUpperCase()];
//   if (!rate)
//     return { valid: false, discount: 0, message: "Invalid coupon code." };
//   return {
//     valid: true,
//     discount: Math.round(total * rate),
//     rate,
//     message: `${Math.round(rate * 100)}% off applied! 🎉`,
//   };
// }
