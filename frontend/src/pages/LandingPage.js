import React from 'react';
import useSEO from '../hooks/useSEO';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  useSEO({ title:'Welcome', description:'Haseeb Shop — a full-stack product management platform with Admin and Customer panels, multi-currency support, and real-time inventory.', keywords:'haseeb shop, product management, ecommerce, online store, shopping cart, admin panel, inventory management' });
  return (
    <div style={{ minHeight:'100vh' }}>
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', padding:'60px 28px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(14,165,233,0.12),transparent)', top:'-150px', right:'-100px' }} />
          <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.1),transparent)', bottom:'-100px', left:'-50px' }} />
          <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.08),transparent)', top:'40%', left:'40%' }} />
        </div>
        <div style={{ maxWidth:1200, margin:'0 auto', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center', position:'relative', zIndex:1 }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:20, background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.2)', marginBottom:28 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#0ea5e9', display:'inline-block', animation:'pulse 2s infinite' }}></span>
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
              <span style={{ fontSize:12, color:'#0284c7', fontWeight:700, letterSpacing:'0.04em' }}>Full-Stack · MVC · Portfolio-Ready</span>
            </div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(42px,5vw,70px)', fontWeight:800, color:'var(--text)', lineHeight:1.05, marginBottom:22, letterSpacing:'-0.03em' }}>
              Haseeb<br />
              <span style={{ background:'linear-gradient(135deg,#0ea5e9 0%,#6366f1 50%,#14b8a6 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Shop</span><br />
              <span style={{ fontSize:'0.55em', fontWeight:600, color:'var(--text3)', letterSpacing:'-0.01em' }}>Product Management Platform</span>
            </h1>
            <p style={{ fontSize:16, color:'var(--text3)', lineHeight:1.75, marginBottom:36, maxWidth:460 }}>
              A clean, fast product platform with separate Admin and Customer panels. Full CRUD, JWT auth, image uploads, and multi-currency support.
            </p>
            <div style={{ display:'flex', gap:14, marginBottom:36 }}>
              <Link to="/auth"><button className="btn-primary" style={{ padding:'14px 32px', fontSize:15 }}>Open the Shop →</button></Link>
              <a href="https://github.com" target="_blank" rel="noreferrer"><button className="btn-ghost" style={{ padding:'14px 32px', fontSize:15 }}>GitHub</button></a>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {['React 18','Node.js','MongoDB','Express','JWT','Multer','MVC'].map(t => (
                <span key={t} style={{ padding:'5px 14px', borderRadius:20, background:'rgba(255,255,255,0.7)', border:'1px solid rgba(14,165,233,0.15)', fontSize:12, color:'var(--text3)', fontWeight:600, backdropFilter:'blur(10px)' }}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ background:'rgba(255,255,255,0.6)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.9)', borderRadius:24, padding:28, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 20px 60px rgba(14,165,233,0.12)' }}>
              {[
                { icon:'⚙️', title:'Admin Panel', desc:'Add, edit, delete products', bg:'rgba(14,165,233,0.08)', border:'rgba(14,165,233,0.2)', col:'#0284c7', grad:'linear-gradient(135deg,#0ea5e9,#6366f1)' },
                { icon:'🛍', title:'Customer Panel', desc:'Browse products, add to cart', bg:'rgba(20,184,166,0.08)', border:'rgba(20,184,166,0.2)', col:'#0f766e', grad:'linear-gradient(135deg,#14b8a6,#0ea5e9)' },
              ].map(r => (
                <div key={r.title} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderRadius:14, background:r.bg, border:`1px solid ${r.border}` }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:r.grad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }} dangerouslySetInnerHTML={{ __html: r.icon }} />
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>{r.title}</div>
                    <div style={{ fontSize:12, color:r.col }}>{r.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:4 }}>
                {[{ n:'CRUD', l:'Operations' },{ n:'JWT', l:'Auth' },{ n:'MVC', l:'Pattern' }].map(s => (
                  <div key={s.n} style={{ textAlign:'center', padding:'14px 8px', background:'rgba(255,255,255,0.7)', borderRadius:12, border:'1px solid rgba(14,165,233,0.12)', backdropFilter:'blur(10px)' }}>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{s.n}</div>
                    <div style={{ fontSize:10, color:'var(--text4)', marginTop:2, fontWeight:600 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:'80px 28px', background:'rgba(255,255,255,0.4)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(14,165,233,0.08)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:38, fontWeight:800, color:'var(--text)', marginBottom:12, letterSpacing:'-0.02em' }}>Built for real use</h2>
            <p style={{ color:'var(--text3)', fontSize:16 }}>Every feature you need in a modern product management system</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:20 }}>
            {[
              { icon:'🔐', title:'Role-Based Auth', desc:'Admin and Customer panels with JWT auth, protected API routes, bcrypt password hashing.' },
              { icon:'📦', title:'Full CRUD', desc:'Create with image upload, search & filter, inline edit with preview, delete with file cleanup.' },
              { icon:'🌐', title:'Multi-Currency', desc:'USD, JPY, CNY, EUR, GBP — each formatted correctly per locale.' },
              { icon:'📐', title:'MVC Architecture', desc:'Models, controllers, routes cleanly separated. Team-scalable codebase.' },
              { icon:'🔍', title:'Search & Filter', desc:'MongoDB text indexes, price sorting, debounced search — fast across large catalogs.' },
              { icon:'📱', title:'Fully Responsive', desc:'Works on mobile, tablet, and desktop with adaptive layouts and touch controls.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding:26 }}>
                <div style={{ fontSize:30, marginBottom:14 }} dangerouslySetInnerHTML={{ __html: f.icon }} />
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color:'var(--text)', marginBottom:8 }}>{f.title}</h3>
                <p style={{ color:'var(--text3)', fontSize:13, lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;
