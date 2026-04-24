import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logout(); navigate('/auth'); };
  const navLinks = isAdmin
    ? [{ to:'/admin', label:'Dashboard' }, { to:'/admin/add-product', label:'Add Product' }, { to:'/products', label:'Store' }]
    : [{ to:'/products', label:'Products' }, { to:'/cart', label:'Cart' }];

  return (
    <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.72)', backdropFilter:'blur(20px) saturate(180%)', WebkitBackdropFilter:'blur(20px) saturate(180%)', borderBottom:'1px solid rgba(255,255,255,0.85)', boxShadow:'0 1px 20px rgba(14,165,233,0.08)', padding:'0 28px' }}>
      <div style={{ maxWidth:1240, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>

        <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/products') : '/'} style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, fontWeight:900, color:'#fff', fontFamily:'var(--font-display)', boxShadow:'0 4px 12px rgba(14,165,233,0.4)' }}>H</div>
          <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-0.01em' }}>Haseeb</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:10, fontWeight:700, color:'#14b8a6', letterSpacing:'0.14em', textTransform:'uppercase' }}>Shop</span>
          </div>
        </Link>

        {isAuthenticated && (
          <div style={{ display:'flex', alignItems:'center', gap:2 }}>
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} style={{ textDecoration:'none', padding:'8px 16px', borderRadius:20, fontSize:13, fontWeight: active ? 700 : 500, color: active ? '#0284c7' : 'var(--text3)', background: active ? 'rgba(14,165,233,0.1)' : 'transparent', border: active ? '1px solid rgba(14,165,233,0.2)' : '1px solid transparent', transition:'all 0.2s' }}>{label}</Link>
              );
            })}
          </div>
        )}

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <Link to="/cart" style={{ textDecoration:'none', position:'relative' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:'rgba(14,165,233,0.08)', border:'1px solid rgba(14,165,233,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, cursor:'pointer', transition:'all 0.2s' }}>🛍</div>
                  {cartCount > 0 && <span style={{ position:'absolute', top:-5, right:-5, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', color:'#fff', borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800 }}>{cartCount > 9 ? '9+' : cartCount}</span>}
                </Link>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:20, background:'rgba(255,255,255,0.8)', border:'1px solid rgba(14,165,233,0.15)', backdropFilter:'blur(10px)' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#0ea5e9,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff' }}>{user?.name?.[0]?.toUpperCase()}</div>
                <div style={{ display:'flex', flexDirection:'column' }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'var(--text)', lineHeight:1.2 }}>{user?.name}</span>
                  <span style={{ fontSize:10, color:'var(--p1)', textTransform:'capitalize', fontWeight:600 }}>{user?.role}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-ghost" style={{ padding:'8px 16px', fontSize:12 }}>Sign out</button>
            </>
          ) : (
            <Link to="/auth"><button className="btn-primary" style={{ padding:'10px 22px', fontSize:13 }}>Sign In</button></Link>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
