import React, { useEffect } from 'react';
const Modal = ({ isOpen, onClose, title, children, maxWidth = 600 }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, overflowY:'auto' }}>
      <div onClick={e => e.stopPropagation()} className="slide-up" style={{ width:'100%', maxWidth, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.9)', borderRadius:'var(--radius-xl)', padding:32, boxShadow:'0 25px 60px rgba(14,165,233,0.2)', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:'var(--text)' }}>{title}</h2>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:'var(--radius-sm)', background:'rgba(14,165,233,0.08)', border:'1px solid rgba(14,165,233,0.15)', color:'var(--text3)', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};
export default Modal;
