import React, { useState } from 'react';
import useSEO from '../hooks/useSEO';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { toast } from '../utils/toast';
import ProductForm from '../components/ProductForm';

const AddProductPage = () => {
  const navigate = useNavigate();
  useSEO({ title:'Add Product', description:'Add a new product to Haseeb Shop inventory.' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try { await productAPI.create(formData); toast.success('Product added!'); navigate('/products'); }
    catch (err) { toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create product'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', padding:'40px 24px' }}>
      <div style={{ maxWidth:680, margin:'0 auto' }}>
        <div style={{ marginBottom:36 }}>
          <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', gap:6, marginBottom:20, padding:0, fontWeight:600 }}>← Back</button>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:54, height:54, borderRadius:16, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, boxShadow:'0 8px 24px rgba(14,165,233,0.3)' }}>📦</div>
            <div>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, color:'var(--text)', lineHeight:1.1 }}>Add New Product</h1>
              <p style={{ color:'var(--text3)', fontSize:14, marginTop:4 }}>Fill in the details to list a new product</p>
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:28 }}>
          {[{ icon:'📷', text:'Add a clear product image for better visibility' },{ icon:'💰', text:'Set competitive pricing with correct currency' },{ icon:'⭐', text:'Rate products honestly to build trust' }].map((tip, i) => (
            <div key={i} style={{ padding:'12px 14px', borderRadius:12, background:'rgba(255,255,255,0.7)', border:'1px solid rgba(14,165,233,0.12)', display:'flex', gap:10, alignItems:'flex-start', backdropFilter:'blur(10px)' }}>
              <span style={{ fontSize:18, flexShrink:0 }} dangerouslySetInnerHTML={{ __html: tip.icon }} />
              <span style={{ fontSize:12, color:'var(--text3)', lineHeight:1.5 }}>{tip.text}</span>
            </div>
          ))}
        </div>

        <div className="glass" style={{ borderRadius:'var(--radius-xl)', padding:32 }}>
          <ProductForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};
export default AddProductPage;
