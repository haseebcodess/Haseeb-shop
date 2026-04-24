import React from 'react';
import useSEO from '../hooks/useSEO';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/api';
import { toast } from '../utils/toast';

const CartPage = () => {
  useSEO({ title:'Your Cart', description:'Review your selected products and proceed to checkout on Haseeb Shop.', keywords:'cart, checkout, haseeb shop cart' });
  const { cart, cartTotal, cartLoading, removeFromCart, updateQuantity, clearCart } = useCart();
  const [imgErrors, setImgErrors] = React.useState({});
  const [removing, setRemoving] = React.useState(null);
  const [clearing, setClearing] = React.useState(false);

  const handleRemove = async (productId, name) => {
    setRemoving(productId);
    try { await removeFromCart(productId); toast.success(`${name} removed`); }
    catch { toast.error('Failed to remove item'); }
    finally { setRemoving(null); }
  };

  const handleClear = async () => {
    setClearing(true);
    try { await clearCart(); toast.success('Cart cleared'); }
    catch { toast.error('Failed to clear cart'); }
    finally { setClearing(false); }
  };

  const handleQty = async (productId, qty) => {
    try { await updateQuantity(productId, qty); }
    catch { toast.error('Failed to update quantity'); }
  };

  if (cartLoading) return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:48, height:48, borderRadius:'50%', border:'3px solid rgba(14,165,233,0.2)', borderTopColor:'#0ea5e9', animation:'spin 0.7s linear infinite' }}></div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (cart.length === 0) return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
      <div style={{ fontSize:80 }}>🛒</div>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, color:'var(--text)' }}>Your cart is empty</h2>
      <p style={{ color:'var(--text3)', fontSize:15 }}>Start adding products to your cart</p>
      <Link to="/products"><button className="btn-primary">Browse Products</button></Link>
    </div>
  );

  const groupedByCurrency = cart.reduce((acc, item) => {
    const code = item.product?.currencyCode || 'USD';
    if (!acc[code]) acc[code] = { items:[], total:0 };
    acc[code].items.push(item);
    acc[code].total += (item.product?.price || 0) * item.quantity;
    return acc;
  }, {});

  return (
    <div style={{ minHeight:'100vh', padding:'36px 24px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32, flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:34, fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em' }}>Your Cart</h1>
            <p style={{ color:'var(--text3)', marginTop:4 }}>{cart.reduce((s,i) => s+i.quantity, 0)} items</p>
          </div>
          <button onClick={handleClear} disabled={clearing} className="btn-ghost" style={{ fontSize:13 }}>
            {clearing ? <><span className="spinner"></span> Clearing...</> : 'Clear All'}
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {cart.map(item => {
              const product = item.product;
              if (!product) return null;
              const imageUrl = getImageUrl(product.image);
              return (
                <div key={item._id || product._id} className="card fade-in" style={{ padding:18, display:'flex', gap:16, alignItems:'center' }}>
                  <div style={{ width:86, height:86, borderRadius:12, overflow:'hidden', flexShrink:0, background:'rgba(14,165,233,0.06)' }}>
                    {imageUrl && !imgErrors[product._id] ? (
                      <img src={imageUrl} alt={product.productName} onError={() => setImgErrors(p => ({...p, [product._id]:true}))} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    ) : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>📦</div>}
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:10, color:'var(--text4)', marginBottom:3, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{product.shopName}</p>
                    <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:6, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{product.productName}</h3>
                    <span style={{ fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                      {formatPrice(product.price, product.currencyCode)}
                    </span>
                  </div>

                  <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                    <div style={{ display:'flex', alignItems:'center', background:'rgba(255,255,255,0.8)', borderRadius:10, overflow:'hidden', border:'1px solid rgba(14,165,233,0.15)', backdropFilter:'blur(10px)' }}>
                      <button onClick={() => handleQty(product._id, item.quantity - 1)} style={{ width:34, height:36, background:'none', border:'none', color:'var(--text)', cursor:'pointer', fontSize:18, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                      <span style={{ minWidth:32, textAlign:'center', fontSize:14, fontWeight:700, color:'var(--text)' }}>{item.quantity}</span>
                      <button onClick={() => handleQty(product._id, item.quantity + 1)} style={{ width:34, height:36, background:'none', border:'none', color:'var(--text)', cursor:'pointer', fontSize:18, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                    </div>
                    <button onClick={() => handleRemove(product._id, product.productName)} disabled={removing === product._id}
                      style={{ width:36, height:36, borderRadius:9, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {removing === product._id ? <span className="spinner" style={{ width:14, height:14, borderColor:'rgba(239,68,68,0.2)', borderTopColor:'#ef4444' }}></span> : '✕'}
                    </button>
                  </div>

                  <div style={{ textAlign:'right', flexShrink:0, minWidth:80 }}>
                    <p style={{ fontSize:11, color:'var(--text4)', marginBottom:4 }}>Subtotal</p>
                    <p style={{ fontSize:15, fontWeight:700, color:'var(--text)' }}>{formatPrice(product.price * item.quantity, product.currencyCode)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass" style={{ borderRadius:'var(--radius-xl)', padding:24, position:'sticky', top:80 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:20 }}>Order Summary</h3>

            {Object.entries(groupedByCurrency).map(([code, data]) => (
              <div key={code} style={{ display:'flex', justifyContent:'space-between', color:'var(--text3)', fontSize:13, marginBottom:10 }}>
                <span>{data.items.length} item{data.items.length!==1?'s':''} ({code})</span>
                <span style={{ fontWeight:600, color:'var(--text)' }}>{formatPrice(data.total, code)}</span>
              </div>
            ))}

            <div style={{ height:1, background:'rgba(14,165,233,0.12)', margin:'16px 0' }} />

            {cart.some(i => i.product?.freeDelivery) && (
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#15803d', marginBottom:12, fontWeight:600 }}>
                <span>🚚 Free Delivery</span>
                <span>−$0.00</span>
              </div>
            )}

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:22 }}>
              <span style={{ fontSize:14, color:'var(--text3)', fontWeight:600 }}>Total (USD est.)</span>
              <span style={{ fontSize:26, fontWeight:800, background:'linear-gradient(135deg,#0ea5e9,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>${cartTotal.toFixed(2)}</span>
            </div>

            <button className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:15 }}>
              Proceed to Checkout →
            </button>
            <Link to="/products" style={{ textDecoration:'none' }}>
              <button className="btn-ghost" style={{ width:'100%', justifyContent:'center', marginTop:10 }}>Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
