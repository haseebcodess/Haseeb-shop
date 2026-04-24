import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { productAPI, formatPrice, getImageUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from '../utils/toast';

const StarRating = ({ rating, size = 16 }) => (
  <div style={{ display:'flex', gap:2 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ fontSize:size, color: i <= rating ? '#f59e0b' : '#e2e8f0' }}>★</span>
    ))}
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [qty, setQty] = useState(1);

  // Image gallery state
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  useSEO({
    title: product ? product.productName : 'Product Detail',
    description: product ? `Buy ${product.productName} from ${product.shopName}. Price: ${formatPrice(product.price, product.currencyCode)}` : '',
    keywords: product ? `${product.productName}, ${product.shopName}, buy online, haseeb shop` : '',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getOne(id);
        setProduct(res.data.product);
        // Load related products
        const rel = await productAPI.getAll({ limit: 4, page: 1 });
        setRelated(rel.data.products.filter(p => p._id !== id).slice(0, 4));
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product._id, qty);
      toast.success(`${product.productName} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, [zoomed]);

  if (loading) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:48, height:48, borderRadius:'50%', border:'3px solid rgba(14,165,233,0.2)', borderTopColor:'#0ea5e9', animation:'spin 0.7s linear infinite' }}></div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!product) return null;

  // Build image array — main image + placeholders for demo
  const imageUrl = getImageUrl(product.image);
  const images = imageUrl ? [imageUrl] : [];

  const CURRENCY_FLAGS = { USD:'🇺🇸', JPY:'🇯🇵', CNY:'🇨🇳', EUR:'🇪🇺', GBP:'🇬🇧' };

  return (
    <div style={{ minHeight:'100vh', padding:'32px 24px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:28, fontSize:13, color:'var(--text4)' }}>
          <Link to="/products" style={{ color:'var(--p1)', textDecoration:'none', fontWeight:600 }}>Products</Link>
          <span>›</span>
          <span style={{ color:'var(--text3)' }}>{product.shopName}</span>
          <span>›</span>
          <span style={{ color:'var(--text)', fontWeight:600 }}>{product.productName}</span>
        </div>

        {/* Main section */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, marginBottom:64, alignItems:'start' }}>

          {/* LEFT — Image gallery */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* Main image with zoom */}
            <div
              style={{ position:'relative', borderRadius:'var(--radius-xl)', overflow:'hidden', background:'linear-gradient(135deg,rgba(14,165,233,0.06),rgba(99,102,241,0.06))', cursor: images.length ? (zoomed ? 'zoom-out' : 'zoom-in') : 'default', aspectRatio:'1', border:'1px solid rgba(255,255,255,0.9)', boxShadow:'var(--shadow-lg)' }}
              onClick={() => images.length && setZoomed(!zoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomed(false)}
            >
              {images.length > 0 ? (
                <img
                  src={images[activeImg]}
                  alt={product.productName}
                  style={{
                    width:'100%', height:'100%', objectFit:'cover',
                    transition: zoomed ? 'none' : 'transform 0.3s ease',
                    transform: zoomed ? `scale(2.2)` : 'scale(1)',
                    transformOrigin: zoomed ? `${zoomPos.x}% ${zoomPos.y}%` : 'center',
                    display:'block',
                  }}
                />
              ) : (
                <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
                  <span style={{ fontSize:64 }}>📦</span>
                  <span style={{ fontSize:13, color:'var(--text4)' }}>No image available</span>
                </div>
              )}

              {/* Zoom hint */}
              {images.length > 0 && !zoomed && (
                <div style={{ position:'absolute', bottom:14, right:14, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(8px)', borderRadius:20, padding:'6px 12px', fontSize:11, color:'#fff', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
                  🔍 Click to zoom
                </div>
              )}

              {/* Badges */}
              {product.freeDelivery && (
                <div style={{ position:'absolute', top:14, left:14 }}>
                  <span style={{ padding:'5px 12px', borderRadius:20, background:'rgba(20,184,166,0.9)', color:'#fff', fontSize:11, fontWeight:700 }}>Free Delivery</span>
                </div>
              )}
            </div>

            {/* Thumbnail strip — shown when there are multiple images */}
            {images.length > 1 && (
              <div style={{ display:'flex', gap:10 }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{ width:72, height:72, borderRadius:10, overflow:'hidden', cursor:'pointer', border:`2px solid ${activeImg===i ? 'var(--p1)' : 'transparent'}`, opacity: activeImg===i ? 1 : 0.6, transition:'all 0.2s', flexShrink:0 }}>
                    <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Product info */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Shop + currency */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:12, fontWeight:700, color:'var(--p1)', textTransform:'uppercase', letterSpacing:'0.07em' }}>{product.shopName}</span>
              <span style={{ fontSize:13, color:'var(--text4)', background:'rgba(14,165,233,0.08)', padding:'4px 10px', borderRadius:20, fontWeight:600 }}>
                {CURRENCY_FLAGS[product.currencyCode]} {product.currencyCode}
              </span>
            </div>

            {/* Product name */}
            <div>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:30, fontWeight:800, color:'var(--text)', lineHeight:1.2, marginBottom:6, letterSpacing:'-0.02em' }}>{product.productName}</h1>
              <p style={{ fontSize:13, color:'var(--text4)' }}>SKU: {product.name}</p>
            </div>

            {/* Rating */}
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <StarRating rating={product.rating} size={20} />
              <span style={{ fontSize:14, fontWeight:700, color:'var(--text2)' }}>{product.rating}.0 / 5</span>
            </div>

            {/* Price */}
            <div style={{ padding:'18px 22px', borderRadius:'var(--radius-lg)', background:'linear-gradient(135deg,rgba(14,165,233,0.06),rgba(99,102,241,0.06))', border:'1px solid rgba(14,165,233,0.12)' }}>
              <p style={{ fontSize:12, color:'var(--text4)', marginBottom:4, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>Price</p>
              <span style={{ fontSize:38, fontWeight:900, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1 }}>
                {formatPrice(product.price, product.currencyCode)}
              </span>
              {product.freeDelivery && (
                <p style={{ fontSize:12, color:'#15803d', marginTop:6, fontWeight:600 }}>✓ Free delivery included</p>
              )}
            </div>

            {/* Stock */}
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background: product.stock > 0 ? '#22c55e' : '#ef4444' }}></div>
              <span style={{ fontSize:13, color:'var(--text3)', fontWeight:600 }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity + Add to cart */}
            {!isAdmin && (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--text3)' }}>Quantity</span>
                  <div style={{ display:'flex', alignItems:'center', background:'rgba(255,255,255,0.8)', borderRadius:10, border:'1px solid rgba(14,165,233,0.15)', overflow:'hidden' }}>
                    <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ width:38, height:40, background:'none', border:'none', color:'var(--text)', cursor:'pointer', fontSize:20, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                    <span style={{ minWidth:40, textAlign:'center', fontSize:15, fontWeight:700, color:'var(--text)' }}>{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q+1))} style={{ width:38, height:40, background:'none', border:'none', color:'var(--text)', cursor:'pointer', fontSize:20, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                  </div>
                </div>
                <button onClick={handleAddToCart} disabled={adding || product.stock === 0} className="btn-primary" style={{ padding:'15px', fontSize:15, justifyContent:'center', width:'100%' }}>
                  {adding ? <><span className="spinner"></span> Adding...</> : product.stock === 0 ? 'Out of Stock' : `Add ${qty > 1 ? qty + ' items' : 'to Cart'} →`}
                </button>
              </div>
            )}

            {/* Admin actions */}
            {isAdmin && (
              <div style={{ display:'flex', gap:12 }}>
                <Link to="/products" style={{ textDecoration:'none', flex:1 }}>
                  <button className="btn-ghost" style={{ width:'100%', justifyContent:'center' }}>← Back to Manage</button>
                </Link>
              </div>
            )}

            {/* Details grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, paddingTop:8, borderTop:'1px solid rgba(14,165,233,0.1)' }}>
              {[
                { label:'Category', value: product.shopName },
                { label:'Currency', value: `${CURRENCY_FLAGS[product.currencyCode]} ${product.currencyCode}` },
                { label:'Rating', value: `${product.rating} / 5 ★` },
                { label:'Delivery', value: product.freeDelivery ? '🚚 Free' : 'Standard' },
              ].map(d => (
                <div key={d.label} style={{ padding:'10px 14px', background:'rgba(255,255,255,0.6)', borderRadius:10, border:'1px solid rgba(14,165,233,0.08)', backdropFilter:'blur(10px)' }}>
                  <p style={{ fontSize:10, color:'var(--text4)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>{d.label}</p>
                  <p style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{d.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em' }}>You may also like</h2>
              <Link to="/products" style={{ textDecoration:'none', fontSize:13, color:'var(--p1)', fontWeight:600 }}>See all →</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))', gap:18 }}>
              {related.map(p => {
                const imgUrl = getImageUrl(p.image);
                return (
                  <Link key={p._id} to={`/products/${p._id}`} style={{ textDecoration:'none' }}>
                    <div className="card" style={{ overflow:'hidden', cursor:'pointer' }}>
                      <div style={{ height:170, background:'linear-gradient(135deg,rgba(14,165,233,0.06),rgba(99,102,241,0.06))', position:'relative', overflow:'hidden' }}>
                        {imgUrl ? (
                          <img src={imgUrl} alt={p.productName} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }}
                            onMouseEnter={e => e.target.style.transform='scale(1.06)'}
                            onMouseLeave={e => e.target.style.transform='scale(1)'} />
                        ) : (
                          <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>📦</div>
                        )}
                      </div>
                      <div style={{ padding:'14px 16px' }}>
                        <p style={{ fontSize:10, color:'var(--text4)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{p.shopName}</p>
                        <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:8, lineHeight:1.3 }}>{p.productName}</h3>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <span style={{ fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                            {formatPrice(p.price, p.currencyCode)}
                          </span>
                          <StarRating rating={p.rating} size={12} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
