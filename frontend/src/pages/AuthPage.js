import React, { useState } from 'react';
import useSEO from '../hooks/useSEO';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';

const AuthPage = () => {
  const { login, signup, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'customer' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);

  useSEO({ title: isLogin ? 'Sign In' : 'Create Account', description:'Sign in or create an account on Haseeb Shop to manage or browse products.', keywords:'login, signup, haseeb shop account, ecommerce login' });
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin' : '/products'} replace />;

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = 'Name required';
    if (!form.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'At least 6 characters';
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); if (!validate()) return;
    setLoading(true);
    try {
      let user;
      if (isLogin) { user = await login(form.email, form.password); }
      else { user = await signup(form.name, form.email, form.password, form.role); }
      toast.success(`Welcome${isLogin ? ' back' : ''}, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/products', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]:'' }));
  };

  const E = ({ msg }) => msg ? <span style={{ fontSize:12, color:'#ef4444', display:'block', marginTop:4 }}>{msg}</span> : null;

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr' }}>
      <div style={{ background:'linear-gradient(135deg,#e0f2fe 0%,#ede9fe 60%,#ccfbf1 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:56, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(14,165,233,0.15),transparent)', top:'-80px', right:'-80px' }} />
        <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.12),transparent)', bottom:'-60px', left:'-40px' }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:360, width:'100%' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:48 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:900, color:'#fff', fontFamily:'var(--font-display)', boxShadow:'0 8px 24px rgba(14,165,233,0.4)' }}>H</div>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1 }}>Haseeb Shop</div>
              <div style={{ fontSize:12, color:'var(--text3)', marginTop:3 }}>Product Management Platform</div>
            </div>
          </div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:800, color:'var(--text)', lineHeight:1.15, marginBottom:14, letterSpacing:'-0.02em' }}>
            Your shop.<br />
            <span style={{ background:'linear-gradient(135deg,#0ea5e9,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Your products.</span>
          </h2>
          <p style={{ color:'var(--text3)', fontSize:14, lineHeight:1.75, marginBottom:36 }}>Sign in to manage your catalog or browse as a customer.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { icon:'⚙️', title:'Admin', desc:'Add, edit, delete products', bg:'rgba(99,102,241,0.1)', border:'rgba(99,102,241,0.25)', col:'#4f46e5' },
              { icon:'🛍', title:'Customer', desc:'Browse products & shop', bg:'rgba(14,165,233,0.08)', border:'rgba(14,165,233,0.2)', col:'#0284c7' },
            ].map(r => (
              <div key={r.title} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:12, background:r.bg, border:`1px solid ${r.border}`, backdropFilter:'blur(10px)' }}>
                <span style={{ fontSize:22 }} dangerouslySetInnerHTML={{ __html: r.icon }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{r.title}</div>
                  <div style={{ fontSize:11, color:r.col, fontWeight:500 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:56, background:'rgba(255,255,255,0.5)', backdropFilter:'blur(20px)' }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          <div style={{ display:'flex', background:'rgba(14,165,233,0.06)', borderRadius:12, padding:4, marginBottom:32, border:'1px solid rgba(14,165,233,0.12)' }}>
            {['Sign In','Sign Up'].map((tab, i) => (
              <button key={tab} onClick={() => { setIsLogin(i===0); setErrors({}); }}
                style={{ flex:1, padding:'10px 0', borderRadius:9, border:'none', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all 0.2s',
                  background: isLogin===(i===0) ? 'linear-gradient(135deg,#0ea5e9,#6366f1)' : 'transparent',
                  color: isLogin===(i===0) ? '#fff' : 'var(--text3)',
                  boxShadow: isLogin===(i===0) ? '0 4px 12px rgba(14,165,233,0.3)' : 'none' }}>{tab}</button>
            ))}
          </div>

          <div style={{ marginBottom:28 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:25, fontWeight:800, color:'var(--text)', marginBottom:6 }}>{isLogin ? 'Welcome back' : 'Create account'}</h3>
            <p style={{ color:'var(--text3)', fontSize:13 }}>{isLogin ? 'Enter your credentials to continue.' : 'Join Haseeb Shop today.'}</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:15 }}>
            {!isLogin && (
              <div>
                <label className="field-label">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="input-field" style={errors.name ? { borderColor:'#ef4444' } : {}} />
                <E msg={errors.name} />
              </div>
            )}
            <div>
              <label className="field-label">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-field" style={errors.email ? { borderColor:'#ef4444' } : {}} />
              <E msg={errors.email} />
            </div>
            <div>
              <label className="field-label">Password</label>
              <div style={{ position:'relative' }}>
                <input name="password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min 6 characters" className="input-field" style={{ paddingRight:44, ...(errors.password ? { borderColor:'#ef4444' } : {}) }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text4)', cursor:'pointer', fontSize:16 }}>{showPwd ? '🙈' : '👁'}</button>
              </div>
              <E msg={errors.password} />
            </div>
            {!isLogin && (
              <div>
                <label className="field-label">Account Type</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {[{ value:'customer', label:'Customer', desc:'Browse & buy' },{ value:'admin', label:'Admin', desc:'Manage products' }].map(opt => (
                    <label key={opt.value} style={{ display:'flex', flexDirection:'column', gap:3, padding:'12px 14px', borderRadius:10, cursor:'pointer', border:`1px solid ${form.role===opt.value ? 'rgba(14,165,233,0.5)' : 'rgba(14,165,233,0.12)'}`, background: form.role===opt.value ? 'rgba(14,165,233,0.08)' : 'rgba(255,255,255,0.5)', transition:'all 0.18s', backdropFilter:'blur(10px)' }}>
                      <input type="radio" name="role" value={opt.value} checked={form.role===opt.value} onChange={handleChange} style={{ display:'none' }} />
                      <span style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{opt.label}</span>
                      <span style={{ fontSize:11, color:'var(--text3)' }}>{opt.desc}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop:6, justifyContent:'center', padding:'14px', fontSize:15 }}>
              {loading ? <><span className="spinner"></span> {isLogin ? 'Signing in...' : 'Creating account...'}</> : isLogin ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          {isLogin && (
            <div style={{ marginTop:22, padding:'14px 16px', borderRadius:12, background:'rgba(14,165,233,0.05)', border:'1px solid rgba(14,165,233,0.15)' }}>
              <p style={{ fontSize:10, color:'var(--text4)', marginBottom:7, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em' }}>Demo Accounts</p>
              <div style={{ display:'flex', flexDirection:'column', gap:4, fontSize:12, color:'var(--text3)', fontFamily:'monospace' }}>
                <span>Admin → admin@shopflow.com / admin123</span>
                <span>Customer → customer@shopflow.com / user1234</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
