import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/api';
import { toast } from '../utils/toast';

const StarRating = ({ rating }) => (
  <div className="stars">
    {[1,2,3,4,5].map(i => <span key={i} className={`star ${i <= rating ? 'star-filled' : 'star-empty'}`}>★</span>)}
  </div>
);

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imageUrl = getImageUrl(product.image);

  const handleAddToCart = async () => {
    setAdding(true);
    try { await addToCart(product._id, 1); toast.success(`${product.productName} added to cart!`); }
    catch { toast.error('Failed to add to cart'); }
    finally { setAdding(false); }
  };

  return (
    <div className="card fade-in" style={{ overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ height:200, position:'relative', overflow:'hidden', flexShrink:0, background:'linear-gradient(135deg,rgba(14,165,233,0.08),rgba(99,102,241,0.08))' }}>
        {imageUrl && !imgError ? (
          <img src={imageUrl} alt={product.productName} onError={() => setImgError(true)}
            style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s ease' }}
            onMouseEnter={e => e.target.style.transform='scale(1.06)'}
            onMouseLeave={e => e.target.style.transform='scale(1)'}
          />
        ) : (
          <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8 }}>
            <span style={{ fontSize:44 }}>📦</span>
            <span style={{ fontSize:11, color:'var(--text4)' }}>No image</span>
          </div>
        )}
        <div style={{ position:'absolute', top:10, right:10 }}><span className="badge badge-blue">{product.currencyCode}</span></div>
        {product.freeDelivery && <div style={{ position:'absolute', top:10, left:10 }}><span className="badge badge-teal">Free Ship</span></div>}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(255,255,255,0.1),transparent)', pointerEvents:'none' }} />
      </div>

      <div style={{ padding:'16px 18px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
        <p style={{ fontSize:10, color:'var(--text4)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em' }}>{product.shopName}</p>
        <div>
          <Link to={`/products/${product._id}`} style={{ textDecoration:'none' }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text)', lineHeight:1.3, cursor:'pointer' }}>{product.productName}</h3>
        </Link>
          <p style={{ fontSize:11, color:'var(--text4)', marginTop:2 }}>{product.name}</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize:11, color:'var(--text4)' }}>{product.rating}.0</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto', paddingTop:10, borderTop:'1px solid rgba(14,165,233,0.1)' }}>
          <span style={{ fontSize:21, fontWeight:800, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            {formatPrice(product.price, product.currencyCode)}
          </span>
          <span style={{ fontSize:11, color:'var(--text4)', background:'rgba(14,165,233,0.07)', padding:'3px 8px', borderRadius:20 }}>Stock: {product.stock}</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {isAdmin ? (
            <>
              <button onClick={() => onEdit(product)} className="btn-ghost" style={{ flex:1, padding:'9px 12px', fontSize:12, justifyContent:'center' }}>✏ Edit</button>
              <button onClick={() => onDelete(product._id)} className="btn-danger" style={{ flex:1, justifyContent:'center', fontSize:12 }}>🗑 Delete</button>
            </>
          ) : (
            <button onClick={handleAddToCart} disabled={adding || product.stock === 0} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'11px' }}>
              {adding ? <><span className="spinner"></span> Adding...</> : product.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
