import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const LandingPage    = lazy(() => import('./pages/LandingPage'));
const AuthPage       = lazy(() => import('./pages/AuthPage'));
const ProductsPage   = lazy(() => import('./pages/ProductsPage'));
const AddProductPage = lazy(() => import('./pages/AddProductPage'));
const CartPage       = lazy(() => import('./pages/CartPage'));
const AdminDashboard    = lazy(() => import('./pages/AdminDashboard'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));

const Loader = () => (
  <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
    <div style={{ width:48, height:48, borderRadius:'50%', border:'3px solid rgba(14,165,233,0.2)', borderTopColor:'#0ea5e9', animation:'spin 0.7s linear infinite' }}></div>
    <span style={{ color:'var(--text3)', fontSize:14, fontWeight:500 }}>Loading Haseeb Shop...</span>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
            <Navbar />
            <main style={{ flex:1 }}>
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
                  <Route path="/cart"     element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                  <Route path="/admin"    element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/add-product" element={<ProtectedRoute adminOnly><AddProductPage /></ProtectedRoute>} />
                  <Route path="/products/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
            <footer style={{ borderTop:'1px solid rgba(14,165,233,0.1)', padding:'20px 28px', textAlign:'center', color:'var(--text4)', fontSize:13, background:'rgba(255,255,255,0.5)', backdropFilter:'blur(20px)' }}>
              Haseeb Shop © 2024 — Built with React.js · Node.js · MongoDB · Express
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
