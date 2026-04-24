import React, { useState, useEffect, useCallback, useRef } from 'react';
import useSEO from '../hooks/useSEO';
import { productAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import SearchBar from '../components/SearchBar';

const SORT_OPTIONS = [
  { value:'createdAt', label:'Newest First' },
  { value:'price', label:'Price: Low to High' },
  { value:'-price', label:'Price: High to Low' },
  { value:'rating', label:'Top Rated' },
];

const ProductsPage = () => {
  const { isAdmin } = useAuth();
  useSEO({ title: isAdmin ? 'Manage Products' : 'All Products', description:'Browse all products on Haseeb Shop. Filter, search, and add to cart.', keywords:'products, shop, buy online, haseeb shop' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [editProduct, setEditProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const searchTimeout = useRef();

  const fetchProducts = useCallback(async (pg = 1, q = search, sort = sortBy) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: 12, sortBy: sort === '-price' ? 'price' : sort };
      if (q.trim()) params.search = q;
      const res = await productAPI.getAll(params);
      let prods = res.data.products;
      if (sort === '-price') prods = [...prods].sort((a,b) => b.price - a.price);
      setProducts(prods); setTotalPages(res.data.totalPages); setTotal(res.data.total);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [search, sortBy]);

  useEffect(() => { fetchProducts(1); }, [sortBy]);

  const handleSearch = (q) => {
    setSearch(q); clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setPage(1); fetchProducts(1, q, sortBy); }, 400);
  };

  const handleEdit = async (formData) => {
    setFormLoading(true);
    try { await productAPI.update(editProduct._id, formData); toast.success('Product updated!'); setEditProduct(null); fetchProducts(page); }
    catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    try { await productAPI.delete(id); toast.success('Product deleted'); setDeleteConfirm(null); fetchProducts(page); }
    catch { toast.error('Delete failed'); }
  };

  const handlePageChange = (pg) => { setPage(pg); fetchProducts(pg); window.scrollTo({ top:0, behavior:'smooth' }); };

  return (
    <div style={{ minHeight:'100vh', padding:'36px 24px' }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:36, fontWeight:800, color:'var(--text)', marginBottom:8, letterSpacing:'-0.02em' }}>
            {isAdmin ? 'Product Manager' : 'All Products'}
          </h1>
          <p style={{ color:'var(--text3)', fontSize:15 }}>{total > 0 ? `${total} product${total !== 1 ? 's' : ''} available` : 'No products yet'}</p>
        </div>

        <div style={{ display:'flex', gap:14, marginBottom:28, flexWrap:'wrap' }}>
          <div style={{ flex:'1 1 280px' }}><SearchBar onSearch={handleSearch} placeholder="Search products, shops..." /></div>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className="input-field" style={{ width:'auto', minWidth:180 }}>
            {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
            {[...Array(8)].map((_,i) => (
              <div key={i} style={{ height:380, borderRadius:'var(--radius-lg)', background:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.9)', animation:'pulse 1.5s ease-in-out infinite' }}>
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px' }}>
            <div style={{ fontSize:64, marginBottom:16 }}>📦</div>
            <h3 style={{ fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:8 }}>No products found</h3>
            <p style={{ color:'var(--text3)' }}>{search ? 'Try a different search term' : isAdmin ? 'Add your first product to get started' : 'Check back soon!'}</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
            {products.map(product => <ProductCard key={product._id} product={product} onEdit={setEditProduct} onDelete={(id) => setDeleteConfirm(id)} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:40 }}>
            <button onClick={() => handlePageChange(page-1)} disabled={page===1} className="btn-ghost" style={{ padding:'9px 16px', opacity: page===1 ? 0.4 : 1 }}>← Prev</button>
            {[...Array(totalPages)].map((_,i) => (
              <button key={i} onClick={() => handlePageChange(i+1)} style={{ width:40, height:40, borderRadius:10, border:'none', cursor:'pointer', fontWeight:700, fontSize:14, transition:'all 0.2s', background: page===i+1 ? 'linear-gradient(135deg,#0ea5e9,#6366f1)' : 'rgba(255,255,255,0.7)', color: page===i+1 ? '#fff' : 'var(--text3)', boxShadow: page===i+1 ? '0 4px 12px rgba(14,165,233,0.3)' : 'none' }}>{i+1}</button>
            ))}
            <button onClick={() => handlePageChange(page+1)} disabled={page===totalPages} className="btn-ghost" style={{ padding:'9px 16px', opacity: page===totalPages ? 0.4 : 1 }}>Next →</button>
          </div>
        )}
      </div>

      <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)} title="Edit Product" maxWidth={620}>
        {editProduct && <ProductForm initialData={editProduct} onSubmit={handleEdit} onCancel={() => setEditProduct(null)} loading={formLoading} />}
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Product?" maxWidth={420}>
        <p style={{ color:'var(--text2)', marginBottom:24, lineHeight:1.7 }}>This action cannot be undone. The product and its image will be permanently removed.</p>
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={() => setDeleteConfirm(null)} className="btn-ghost" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger" style={{ flex:1, justifyContent:'center' }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};
export default ProductsPage;
