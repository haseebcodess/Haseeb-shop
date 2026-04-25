import React, { useState, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import { Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon, label, value, grad, sub }) => (
  <div className="card" style={{ padding:'22px 24px' }}>
    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
      <div style={{ width:48, height:48, borderRadius:14, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, boxShadow:'0 4px 14px rgba(14,165,233,0.2)', flexShrink:0 }}>{icon}</div>
      <div>
        <p style={{ fontSize:12, color:'var(--text4)', fontWeight:600, marginBottom:4 }}>{label}</p>
        <p style={{ fontSize:28, fontWeight:800, color:'var(--text)', lineHeight:1, fontFamily:'var(--font-display)' }}>{value}</p>
        {sub && <p style={{ fontSize:11, color:'var(--text3)', marginTop:3 }}>{sub}</p>}
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  useSEO({ title:'Admin Dashboard', description:'Admin dashboard for Haseeb Shop — manage products, view stats, and control inventory.' });
  const [stats, setStats] = useState({ total:0, avgPrice:0, withImages:0, freeDelivery:0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productAPI.getAll({ limit:50, page:1 });
        const products = res.data.products;
        const total = res.data.total;
        const avgPrice = products.length ? (products.reduce((s,p) => s+p.price, 0) / products.length) : 0;
        const withImages = products.filter(p => p.image).length;
        const freeDelivery = products.filter(p => p.freeDelivery).length;
        setStats({ total, avgPrice: avgPrice.toFixed(2), withImages, freeDelivery });
        setRecentProducts(products.slice(0, 8));
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const STAT_CARDS = [
    { icon:'📦', label:'Total Products', value: loading ? '...' : stats.total, grad:'linear-gradient(135deg,#0ea5e9,#6366f1)', sub:'Across all shops' },
    { icon:'💰', label:'Avg. Price', value: loading ? '...' : `$${stats.avgPrice}`, grad:'linear-gradient(135deg,#6366f1,#8b5cf6)', sub:'USD average' },
    { icon:'📸', label:'With Images', value: loading ? '...' : stats.withImages, grad:'linear-gradient(135deg,#14b8a6,#0ea5e9)', sub:'Products with photos' },
    { icon:'🚚', label:'Free Delivery', value: loading ? '...' : stats.freeDelivery, grad:'linear-gradient(135deg,#f59e0b,#ef4444)', sub:'Offer free shipping' },
  ];

  return (
    <div style={{ minHeight:'100vh', padding:'36px 24px' }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>

        <div style={{ marginBottom:36, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontSize:34, fontWeight:800, color:'var(--text)', marginBottom:6, letterSpacing:'-0.02em' }}>Admin Dashboard</h1>
            <p style={{ color:'var(--text3)', fontSize:15 }}>Welcome back, <span style={{ background:'linear-gradient(135deg,#0ea5e9,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontWeight:700 }}>{user?.name}</span> 👋</p>
          </div>
          <Link to="/admin/add-product">
            <button className="btn-primary">+ Add Product</button>
          </Link>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:36 }}>
          {STAT_CARDS.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        <div style={{ marginBottom:36 }}>
          <h2 style={{ fontSize:20, fontWeight:700, color:'var(--text)', marginBottom:16 }}>Quick Actions</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14 }}>
            {[
              { icon:'+', title:'Add New Product', desc:'Create a new product listing', to:'/admin/add-product', grad:'linear-gradient(135deg,#0ea5e9,#6366f1)' },
              { icon:'📋', title:'Manage Products', desc:'Edit or delete existing products', to:'/products', grad:'linear-gradient(135deg,#6366f1,#8b5cf6)' },
              { icon:'🌐', title:'View as Customer', desc:'See the customer-facing store', to:'/products', grad:'linear-gradient(135deg,#14b8a6,#0ea5e9)' },
            ].map(action => (
              <Link key={action.title} to={action.to} style={{ textDecoration:'none' }}>
                <div className="card" style={{ padding:20, cursor:'pointer', display:'flex', gap:14, alignItems:'center' }}>
                  <div style={{ width:46, height:46, borderRadius:13, background:action.grad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0, boxShadow:'0 4px 12px rgba(14,165,233,0.25)' }} dangerouslySetInnerHTML={{ __html: action.icon }} />
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:3 }}>{action.title}</p>
                    <p style={{ fontSize:12, color:'var(--text3)' }}>{action.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h2 style={{ fontSize:20, fontWeight:700, color:'var(--text)' }}>Recent Products</h2>
            <Link to="/products" style={{ textDecoration:'none', fontSize:13, color:'var(--p1)', fontWeight:600 }}>View all →</Link>
          </div>
          <div style={{ background:'rgba(255,255,255,0.7)', borderRadius:'var(--radius-lg)', border:'1px solid rgba(255,255,255,0.9)', overflow:'hidden', backdropFilter:'blur(20px)', boxShadow:'var(--shadow-sm)' }}>
            {loading ? (
              <div style={{ textAlign:'center', padding:40, color:'var(--text3)' }}>Loading...</div>
            ) : recentProducts.length === 0 ? (
              <div style={{ padding:40, textAlign:'center', color:'var(--text3)' }}>
                No products yet. <Link to="/admin/add-product" style={{ color:'var(--p1)', fontWeight:600 }}>Add one!</Link>
              </div>
            ) : (
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid rgba(14,165,233,0.1)', background:'rgba(14,165,233,0.03)' }}>
                    {['Product','Shop','Price','Rating','Stock','Delivery'].map(h => (
                      <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:12, fontWeight:600, color:'var(--text4)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((p, i) => (
                    <tr key={p._id} style={{ borderBottom: i < recentProducts.length-1 ? '1px solid rgba(14,165,233,0.06)' : 'none', transition:'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(14,165,233,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'14px 16px' }}>
                        <div style={{ fontWeight:700, color:'var(--text)' }}>{p.productName}</div>
                        <div style={{ fontSize:11, color:'var(--text4)' }}>{p.name}</div>
                      </td>
                      <td style={{ padding:'14px 16px', color:'var(--text3)' }}>{p.shopName}</td>
                      <td style={{ padding:'14px 16px', fontWeight:700, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>${p.price}</td>
                      <td style={{ padding:'14px 16px', color:'#f59e0b' }}>{'★'.repeat(p.rating)}</td>
                      <td style={{ padding:'14px 16px', color:'var(--text3)' }}>{p.stock}</td>
                      <td style={{ padding:'14px 16px' }}>
                        <span className={`badge ${p.freeDelivery ? 'badge-teal' : 'badge-red'}`}>{p.freeDelivery ? 'Free' : 'Paid'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
