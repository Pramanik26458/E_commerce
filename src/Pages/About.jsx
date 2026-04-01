// src/pages/About.jsx
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-[#080808] pt-20">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap'); .font-serif{font-family:'Playfair Display',Georgia,serif!important}`}</style>

      {/* Hero */}
      <div className="relative h-[58vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80" alt="About" className="w-full h-full object-cover" style={{filter:"brightness(0.22) saturate(0.5)"}}/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent"/>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-4 px-5">
          <p className="text-amber-400 text-[11px] tracking-[0.3em] uppercase font-bold">Our Story</p>
          <h1 className="text-5xl md:text-7xl font-black text-white font-serif leading-tight max-w-2xl">
            Fashion with a<br/><em className="text-amber-400 not-italic">Point of View.</em>
          </h1>
          <p className="text-white/35 text-base max-w-lg leading-relaxed">PR was born from a simple belief — premium fashion shouldn't cost the earth or your ethics.</p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 text-[11px] tracking-[0.2em] uppercase font-bold mb-4">Our Mission</p>
          <h2 className="text-3xl md:text-5xl font-black text-white font-serif leading-tight mb-6">Dress like nobody's watching.<br/>Feel like everyone is.</h2>
          <p className="text-white/40 text-lg leading-relaxed">We curate limited drops of premium clothing for people who know what they want and aren't afraid to show it. Every piece is intentional. Nothing is filler.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#0f0f0f] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[{stat:"2021",label:"Founded"},{stat:"10K+",label:"Happy Customers"},{stat:"100%",label:"Ethical Sourcing"},{stat:"4.9★",label:"Avg. Rating"}].map(({stat,label})=>(
            <div key={label} className="group"><p className="text-4xl font-black text-white font-serif group-hover:text-amber-400 transition-colors">{stat}</p><p className="text-white/30 text-sm mt-1">{label}</p></div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-[11px] tracking-[0.2em] uppercase font-bold mb-2">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-black text-white font-serif">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {icon:"🎯",title:"Intentional Design",desc:"Every piece is designed with purpose. No filler, no fast fashion."},
              {icon:"♻️",title:"Sustainable Practice",desc:"Ethical factories, responsible materials. Fashion shouldn't cost the planet."},
              {icon:"🤝",title:"Community First",desc:"10,000+ customers. Real people, real stories. Relationships, not transactions."},
              {icon:"✨",title:"Uncompromising Quality",desc:"Premium fabrics, meticulous construction. We stand behind everything we make."},
            ].map(({icon,title,desc})=>(
              <div key={title} className="bg-[#111] border border-white/[0.06] hover:border-amber-400/20 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] group">
                <span className="text-3xl group-hover:scale-110 transition-transform inline-block">{icon}</span>
                <h3 className="text-white font-bold text-base mt-4 mb-2">{title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white font-serif mb-4">Ready to find your style?</h2>
          <p className="text-white/35 text-sm mb-8">Explore our latest drops and curated collections.</p>
          <Link to="/allproduct" className="inline-block bg-amber-400 hover:bg-amber-300 text-black font-black text-sm px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.35)] hover:scale-105">
            Shop the Collection →
          </Link>
        </div>
      </section>
    </div>
  );
}